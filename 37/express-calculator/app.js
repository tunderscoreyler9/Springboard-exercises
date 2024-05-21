const express = require('express');
const path = require('path');
const app = express();
const ExpressError = require('./expressError');
const { convertAndValidateNumsArray, findMode, findMean, findMedian } = require('./helpers');

app.use(express.urlencoded({ extended: true })); // For Form Data
// Set the view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));


app.get('/', (req, res) => {
  res.render('index', { title: 'Home' });
});

app.get('/mean', (req, res) => {
  res.render('mean', { title: 'Calculate Mean' }); 
});

app.post('/mean/post', (req, res, next) => {
  try {
    let numsAsStrings = req.body.mean.split(',');
    let nums = convertAndValidateNumsArray(numsAsStrings);
    if (nums instanceof Error) {
      throw new ExpressError(nums.message);
    }

    let result = {
      operation: "mean",
      result: findMean(nums)
    };

    return res.render('result', { title: 'Calculation Result', result });
  } catch (e) {
    return next(e);
  }
});


app.get('/median', (req, res) => {
  res.render('median', { title: 'Calculate Median' });
});

app.post('/median/post', (req, res, next) => {
  try {
    let numsAsStrings = req.body.median.split(',');
    let nums = convertAndValidateNumsArray(numsAsStrings);
    if (nums instanceof Error) {
      throw new ExpressError(nums.message);
    }

    let result = {
      operation: "median",
      result: findMedian(nums)
    };

    return res.render('result', { title: 'Calculation Result', result });
  } catch (e) {
    return next(e);
  }
});


app.get('/mode', (req, res) => {
  res.render('mode', { title: 'Calculate Mode' });
});

app.post('/mode/post', (req, res, next) => {
  try {
    let numsAsStrings = req.body.mode.split(',');
    let nums = convertAndValidateNumsArray(numsAsStrings);
    if (nums instanceof Error) {
      throw new ExpressError(nums.message);
    }

    let result = {
      operation: "mode",
      result: findMode(nums)
    };

    return res.render('result', { title: 'Calculation Result', result });
  } catch (e) {
    return next(e);
  }
});

// #####################################
// Routes for GET query parameter routes:

// GET route for calculating mean with query parameters
app.get('/mean', function (req, res, next) {
  if (!req.query.nums) {
    throw new ExpressError('You must pass a query key of nums with a comma-separated list of numbers.', 400);
  }
  let numsAsStrings = req.query.nums.split(',');
  let nums = convertAndValidateNumsArray(numsAsStrings);
  if (nums instanceof Error) {
    throw new ExpressError(nums.message);
  }

  let result = {
    operation: "mean",
    result: findMean(nums)
  };

  return res.send(result);
});

// GET route for calculating median with query parameters
app.get('/median', function (req, res, next) {
  if (!req.query.nums) {
    throw new ExpressError('You must pass a query key of nums with a comma-separated list of numbers.', 400);
  }
  let numsAsStrings = req.query.nums.split(',');
  let nums = convertAndValidateNumsArray(numsAsStrings);
  if (nums instanceof Error) {
    throw new ExpressError(nums.message);
  }

  let result = {
    operation: "median",
    result: findMedian(nums)
  };

  return res.send(result);
});

// GET route for calculating mode with query parameters
app.get('/mode', function (req, res, next) {
  if (!req.query.nums) {
    throw new ExpressError('You must pass a query key of nums with a comma-separated list of numbers.', 400);
  }
  let numsAsStrings = req.query.nums.split(',');
  let nums = convertAndValidateNumsArray(numsAsStrings);
  if (nums instanceof Error) {
    throw new ExpressError(nums.message);
  }

  let result = {
    operation: "mode",
    result: findMode(nums)
  };

  return res.send(result);
});

// #######################################
// ~further study '/all' route:
app.get('/all', (req, res) => {
  res.render('all', {title: 'Calculate all'})
});

app.post('/all', (req, res, next) => {
  try {
    let meanNumsAsStrings = req.body.mean.split(',');
    let medianNumsAsStrings = req.body.median.split(',');
    let modeNumsAsStrings = req.body.mode.split(',');

    let meanNums = convertAndValidateNumsArray(meanNumsAsStrings);
    let medianNums = convertAndValidateNumsArray(medianNumsAsStrings);
    let modeNums = convertAndValidateNumsArray(modeNumsAsStrings);

    for(let x of [meanNums, medianNums, modeNums]) {
      if(x instanceof Error) {
        throw new ExpressError(x.message);
      }
    }

    let result = {
      operation: "all",
      mean: findMean(meanNums),
      median: findMedian(medianNums),
      mode: findMode(modeNums)
    };

    return res.send(result);

  } catch (e) {
    return next(e);
  }
});

// 404 error handler
app.use(function (req, res, next) {
  const err = new ExpressError("Not Found", 404);
  return next(err);
});

// Error handler
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  return res.json({
    error: err,
    message: err.message
  });
});

app.listen(3000, function () {
  console.log(`Server starting on port 3000`);
});