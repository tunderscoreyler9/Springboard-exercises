const express = require('express');
const path = require('path');
const app = express();
const ExpressError = require('./expressError');
app.use(express.urlencoded({ extended: true })); // For Form Data

const { convertAndValidateNumsArray, findMode, findMean, findMedian } = require('./helpers');

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Root route to render index.html
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

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
    }

    return res.send(result);
});

app.post('/mean/post', (req, res) => {
    let numsAsStrings = req.body.mean.split(',');
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
    }

    return res.send(result);
});

app.post('/median/post', (req, res) => {
    let numsAsStrings = req.body.median.split(',');
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
    }

    return res.send(result);
});

app.post('/mode/post', (req, res) => {
    let numsAsStrings = req.body.mode.split(',');
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