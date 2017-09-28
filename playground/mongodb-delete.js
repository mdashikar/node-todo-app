// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectId} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {

    if(err){
        return console.log('Unable to connect MongoDB database');
    }
    console.log('Connected Succesfully to mongoDB database');
    
    //To delete many data together command : deleteMany
    db.collection('Todos').deleteMany({text:'Eat the cat'}).then((result)=> {
        console.log(result);
    }, (err) => {
        console.log('Unable to delete data. Try again later!!');
    });
    //To delete one data together command : deleteOne

    db.collection('Users').deleteOne({name:'Abu Tuhel Rana'}).then((result) => {
        console.log(result);
    },(err)=>{
        console.log('Unable to delete data. Try again later!!');
    });

    //to delete find and delete one is also return deleted files details command: findOneAndDelete
    db.collection('Users').findOneAndDelete({
        _id: new ObjectId('59af22057b6e458e8541a0d3')
    
    }).then((result) => {
        console.log(result);
    },(err)=>{
        console.log('Unable to delete data. Try again later!!');
    });



    //db.close();

});