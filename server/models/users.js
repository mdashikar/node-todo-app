const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        minLength: 1,
        trim:true,
        unique: true,
        validate: {
            validator: validator.isEmail,
            massage: '{VALUE} is not a valid email'
        }
        // validate:{
        //     validator: (value)=>{

        //         return validator.isEmail(value);  

        //     },

        //     message:'{VALUE} is not a valid Email'

        // }
    },
    password: {
        type: String,
        required: true,
        minLength: 8
    },
    tokens: [{
        access:{
            type: String,
            required: true
        },
        token:{
            type: String,
            required: true
        }
    }]

    
});

UserSchema.methods.toJSON = function (){
    var users = this;
    var usersObject = users.toObject();

    return _.pick(usersObject, ['_id', 'email']);

};

UserSchema.methods.generateAuthToken = function () {
    var users = this;
    var access = 'auth';
    var token = jwt.sign({_id: users._id.toHexString(), access}, 'abc123').toString();

    
    users.tokens.push({access, token});

    return users.save().then( () => {
        return token;
    });

};

UserSchema.methods.removeToken = function(token) {
    var users = this;

    return users.update({
        $pull : {
            tokens : {token}
        }
    });
}

UserSchema.pre('save', function(next) {
    var users = this;

    if(users.isModified('password')){
        bcrypt.genSalt(10, (err, salt) =>{
            bcrypt.hash(users.password, salt, (err, hash) => {
                users.password = hash;
                next();
            });
        });
    }else {
        next();
    }
});

UserSchema.statics.findByToken = function (token){

    var Users = this;
    var decoded;

    try{
        decoded = jwt.verify(token, 'abc123');
    } catch(e) {
        return Promise.reject();
    }

    return Users.findOne( {
        '_id' : decoded._id,
        'tokens.token' : token,
        'tokens.access' : 'auth'
    });
}

UserSchema.statics.findByCredentials = function (email, password) {
    var Users = this;

    return Users.findOne({email}).then( (users) => {
        if(!users){
            return Promise.reject();
        }

        return new Promise((resolve, reject) => {
            bcrypt.compare(password, users.password, (err, res) => {
                if(res){
                    resolve(users);
                }else{
                    reject();
                }
            });
        });
    })

};

var Users = mongoose.model('Users', UserSchema);

module.exports = {Users};