const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const itemsRoutes = require('./api/routes/items');
const usersRoutes = require('./api/routes/users');

mongoose.connect('mongodb+srv://JovanaCh:rM7fhidTjqJSG7V@ib.kcauhys.mongodb.net/?retryWrites=true&w=majority');
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use('/items', itemsRoutes);
app.use('/users', usersRoutes);

app.use((req, res, next) => {
    const error = new Error('Item not found');
    error.status = 404;
    next(error);
});
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app; 