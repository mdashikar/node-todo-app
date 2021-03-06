require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {Users} = require('./models/users');
var {authenticate} = require('./middleware/authenticate');
var {ObjectID} = require('mongodb');

var app = express();
app.use(bodyParser.json());

const port = process.env.PORT;

app.post('/todos',authenticate, (req, res) => {
   
   var todo = new Todo({
       text: req.body.text,
       _creator: req.users._id
   });

   todo.save().then((doc) => {
        res.send(doc);
   }, (e) => {
        res.status(400).send(e);
   });

});



app.get('/todos', authenticate, (req, res) => {
    Todo.find({
        _creator: req.users._id
    }).then((todos)=>{
        res.send({todos});
    }, (e) => {
        res.status(404).send(e);
    });
});

app.get('/todos/:id', authenticate, (req, res) => {
    var id = req.params.id;
    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }
    Todo.findOne({
        _id: id,
        _creator: req.users._id
    }).then((todo)=>{
        if(!todo){
            return res.status(404).send();
        }
        res.send({todo});
    }).catch( (e) => {
        res.status(400).send();
    });
});
app.delete('/todos/:id', authenticate, (req, res) => {
    var id = req.params.id;

    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }
    Todo.findOneAndRemove({
        _id: id,
        _creator: req.users._id
    }).then((todo) => {
        if(!todo){
            return res.status(404).send();
        }
        res.status(200).send({todo});

    }).catch( (e) => {
        res.status(400).send();
    });


});

app.patch('/todos/:id', authenticate, (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);
    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }
    if(_.isBoolean(body.completed) && body.completed){
        body.completedAt = new Date().getTime();
    }else{
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findOneAndUpdate({_id:id, _creator: req.users._id}, { $set: body}, {$new: true}).then((todo) => {
        if(!todo){
            return res.status(404).send();
        }
        res.send({todo});
    }).catch((e) => {
        res.status(400).send();
    });

});

app.post('/users', (req, res) => {
   
//    var users = new Users({
//        email: req.body.email,
//        password:req.body.password
//    });
   var body = _.pick(req.body, ['email', 'password']);
   var users = new Users(body);

   users.save().then(() => {
        return users.generateAuthToken();
   }).then((token) => {
        res.header('x-auth', token).send(users);
   }).catch((e) => {
        res.status(400).send(e);
    });
});

//private route get method 
app.get('/users/me', authenticate , (req, res) => {
    res.send(req.users);
});
//get all user list 
app.get('/users', (req, res) => {

    Users.find().then((users)=>{
        res.send(users);
    }).catch((e) => {
        res.status(401).send(e);
    });

});

app.delete('/users/me/token', authenticate , (req, res) => {
    req.users.removeToken(req.token).then( () => {
        res.status(200).send();
    }, () => {
        res.status(401).send();
    });
});

//post route for login
app.post('/users/login', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);

    Users.findByCredentials(body.email, body.password).then((users) => {
        return users.generateAuthToken().then((token) => {
            res.header('x-auth', token).send(users);
        });
    }).catch ((e) => {
        res.status(400).send();
    });

});

app.listen(port, () => {
    console.log(`Started on port: ${port}`);
});

module.exports = {app};
