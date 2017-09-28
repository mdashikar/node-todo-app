const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {Users} = require('./../server/models/users');


Todo.findByIdAndRemove('59b5c4ffd7f35616b471ef69').then( (todo) => {
    console.log(todo);
})