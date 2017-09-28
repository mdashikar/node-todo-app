var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// Real mongodb url below when it up-runing then uncomment this
//mongoose.connect('process.env.MONGODB_URI');

//below local mongodb url
mongoose.connect('mongodb://localhost:27017/TodoApp');

module.exports = {mongoose};