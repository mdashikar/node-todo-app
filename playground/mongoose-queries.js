const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {Users} = require('./../server/models/users');

// var id = '59b312f5a09dfb13948fdad6';

var userId = '59b1c36499388e1850b9daa4';

if(!ObjectID.isValid(userId)){
    console.log('Id not found!');
}

// Todo.find({
//     _id: id
// }).then((todos) => {
//     console.log('Todus ->', JSON.stringify(todos, undefined, 4));
// });

// Todo.findOne({
//     _id: id
// }).then((todo) => {
//     console.log('Todus ->', JSON.stringify(todo, undefined, 4));
// });

// Todo.findById(id).then((todo) => {
//     console.log('Todus ->', JSON.stringify(todo, undefined, 4));
// });

Users.findById(userId).then((user) =>{
    if(!user){
        return console.log('User you looking for not found.');
    }
    console.log(JSON.stringify(user, undefined, 2));
}).catch((e) => console.log(e));
