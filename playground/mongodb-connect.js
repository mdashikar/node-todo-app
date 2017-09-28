// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectId} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {

    if(err){
        return console.log('Unable to connect MongoDB database');
    }
    console.log('Connected Succesfully to mongoDB database');

    // db.collection('Todos').insertOne({
    //     text: 'something to do',
    //     completed: false
    // }, (err, result) => {
    //     if(err){
    //         return console.log('Unable to insert into Todos', err);
    //     }
    //     console.log(JSON.stringify(result.ops, undefined, 2));
    // });
    db.collection('Users').insertOne({
        name: 'Abu Tuhel Rana',
        age: 25,
        location: '25 Street, Sylhet',
        completed: false
    }, (err, result) => {
        if(err){
            return console.log('Unable to insert into Todos', err);
        }
        console.log(JSON.stringify(result.ops, undefined, 2));
    });
    db.collection('Users').insertOne({
        name: 'Abu Tuhel Rana',
        age: 25,
        location: '25 Street, Sylhet',
        completed: false
    }, (err, result) => {
        if(err){
            return console.log('Unable to insert into Todos', err);
        }
        console.log(JSON.stringify(result.ops, undefined, 2));
    });
  
    db.close();

});