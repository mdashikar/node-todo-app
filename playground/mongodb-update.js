// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectId} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {

    if(err){
        return console.log('Unable to connect MongoDB database');
    }
    console.log('Connected Succesfully to mongoDB database');
    
    // db.collection('Todos').findOneAndUpdate({
    //     _id: new ObjectId('59b083b5822a2741024e7983')
    // },{
    //     $set : {
    //         completed: true
    //     }
    // },{
    //     returnOriginal: false
    // }).then((result) => {
    //     console.log(result);
    // });
    db.collection('Users').findOneAndUpdate({
        _id: new ObjectId('59af22757d92371b689b021b')
    },{
        $set : {
            name: 'Adu babu'
        },
        $inc: {
            age: 1
        }
    },{
        returnOriginal: false
    }).then((result) => {
        console.log(result);
    });


    //db.close();

});