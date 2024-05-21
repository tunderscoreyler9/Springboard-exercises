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

// Route to serve mean.html
app.get('/mean', function (req, res) {
    res.sendFile(path.join(__dirname, 'public', 'mean.html'));
});

// Route to handle mean calculation
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

        return res.send(result);
    } catch (e) {
        return next(e);
    }
});

// Route to serve median.html
app.get('/median', function (req, res) {
    res.sendFile(path.join(__dirname, 'public', 'median.html'));
});

// Route to handle median calculation
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

        return res.send(result);
    } catch (e) {
        return next(e);
    }
});

// Route to serve mode.html
app.get('/mode', function (req, res) {
    res.sendFile(path.join(__dirname, 'public', 'mode.html'));
});

// Route to handle mode calculation
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
