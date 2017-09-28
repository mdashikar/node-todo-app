const {ObjectID} = require('mongodb');
const {Todo} = require('./../../models/todo');
const {Users} = require('./../../models/users');

const jwt = require('jsonwebtoken');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const users = [{
    _id: userOneId,
    email: 'mdashikar@gmail.com',
    password: 'userPass',
    tokens : [{
        access: 'auth',
        token: jwt.sign({_id: userOneId, access:'auth'}, 'abc123').toString()
    }]
},
{
    _id: userTwoId,
    email: 'mdashik@gmail.com',
    password: 'usPass'

}];

const todos = [{
    _id: new ObjectID(),
    text: 'This is GET test One'
},
{
    _id: new ObjectID(),
    text: 'This is GET test Two',
    completed: true,
    completedAT: 333

}];

const populateTodos = (done) => {
    Todo.remove({}).then(() => {
      return  Todo.insertMany(todos)

    }).then(()=> done());
}
const populateUsers = (done) => {
    Users.remove({}).then(() => {
        var userOne = new Users(users[0]).save();
        var userTwo = new Users(users[1]).save();
      return  Promise.all([userOne, userTwo]);

    }).then(()=> done());
}

module.exports = ({todos, users, populateUsers, populateTodos});