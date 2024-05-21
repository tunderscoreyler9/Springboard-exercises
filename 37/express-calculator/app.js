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

// Root route to render index.ejs
app.get('/', function (req, res) {
    res.render('layout', { title: 'Home', body: `
        <h1>Welcome to the Calculator App</h1>
        <p>Select an operation to perform:</p>
        <ul>
            <li><a href="/mean">Calculate Mean</a></li>
            <li><a href="/median">Calculate Median</a></li>
            <li><a href="/mode">Calculate Mode</a></li>
        </ul>
    ` });
});

app.get('/mean', function (req, res) {
    res.render('layout', { title: 'Calculate Mean', body: `
        <h1>Calculate Mean</h1>
        <form action="/mean/post" method="POST">
            <label for="mean">Enter numbers (comma-separated):</label>
            <input type="text" id="mean" name="mean" placeholder="e.g. 1,2,3,4">
            <button type="submit">Calculate</button>
        </form>
    ` });
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

        return res.render('layout', { title: 'Calculation Result', body: `
            <h1>Calculation Result</h1>
            <p>Operation: ${result.operation}</p>
            <p>Result: ${result.result}</p>
            <a href="/">Go back to Home</a>
        ` });
    } catch (e) {
        return next(e);
    }
});

app.get('/median', function (req, res) {
    res.render('layout', { title: 'Calculate Median', body: `
        <h1>Calculate Median</h1>
        <form action="/median/post" method="POST">
            <label for="median">Enter numbers (comma-separated):</label>
            <input type="text" id="median" name="median" placeholder="e.g. 1,2,3,4">
            <button type="submit">Calculate</button>
        </form>
    ` });
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

        return res.render('layout', { title: 'Calculation Result', body: `
            <h1>Calculation Result</h1>
            <p>Operation: ${result.operation}</p>
            <p>Result: ${result.result}</p>
            <a href="/">Go back to Home</a>
        ` });
    } catch (e) {
        return next(e);
    }
});

app.get('/mode', function (req, res) {
    res.render('layout', { title: 'Calculate Mode', body: `
        <h1>Calculate Mode</h1>
        <form action="/mode/post" method="POST">
            <label for="mode">Enter numbers (comma-separated):</label>
            <input type="text" id="mode" name="mode" placeholder="e.g. 1,2,3,4">
            <button type="submit">Calculate</button>
        </form>
    ` });
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

        return res.render('layout', { title: 'Calculation Result', body: `
            <h1>Calculation Result</h1>
            <p>Operation: ${result.operation}</p>
            <p>Result: ${result.result}</p>
            <a href="/">Go back to Home</a>
        ` });
    } catch (e) {
        return next(e);
    }
});

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