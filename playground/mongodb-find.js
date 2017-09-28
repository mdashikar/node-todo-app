// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectId} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {

    if(err){
        return console.log('Unable to connect MongoDB database');
    }
    console.log('Connected Succesfully to mongoDB database');
    
    db.collection('Users').find({name:'Abu Tuhel Rana'}).toArray().then((docs)=> {
        console.log('User Details');
        console.log(JSON.stringify(docs, undefined, 2));
    }, (err) => {
        console.log('Unable to fetch data. Try again later!!');
    });
    db.collection('Users').find({name:'Abu Tuhel Rana'}).count().then((count)=> {
        console.log(`Number of users: ${count}`);
    }, (err) => {
        console.log('Unable to fetch data. Try again later!!');
    });


    //db.close();

});