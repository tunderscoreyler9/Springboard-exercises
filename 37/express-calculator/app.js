const express = require('express');
const path = require('path');
const app = express();
const ExpressError = require('./expressError');
const { convertAndValidateNumsArray, findMode, findMean, findMedian } = require('./helpers');

app.use(express.urlencoded({ extended: true })); // For Form Data

// Set the view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Root route
app.get('/', (req, res) => {
  res.render('index', { title: 'Home' }); // Render index.ejs
});

// Calculate Mean route (GET for form, POST for calculation)
app.get('/mean', (req, res) => {
  res.render('mean', { title: 'Calculate Mean' }); // Render mean.ejs
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

    return res.render('result', { title: 'Calculation Result', result }); // Render result.ejs with data
  } catch (e) {
    return next(e);
  }
});

// Calculate Median routes
app.get('/median', (req, res) => {
  res.render('median', { title: 'Calculate Median' }); // Render median.ejs
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

    return res.render('result', { title: 'Calculation Result', result }); // Render result.ejs with data
  } catch (e) {
    return next(e);
  }
});

// Calculate Mode routes
app.get('/mode', (req, res) => {
  res.render('mode', { title: 'Calculate Mode' }); // Render mode.ejs
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

    return res.render('result', { title: 'Calculation Result', result }); // Render result.ejs with data
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