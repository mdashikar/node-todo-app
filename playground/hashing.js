const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


var password = 'abc123!';

// bcrypt.genSalt(10, (err, salt) => {
//     bcrypt.hash(password, salt, (err, hash) => {
//         console.log(hash);
//     });
// });

var hashedPass = '$2a$10$OHbOk1jeC7MHm3LJHGwpoeNhYAWmHIbnp8kwhhlJirAeq.u8NSnUe';

bcrypt.compare(password, hashedPass, (err, res) => {
    console.log(res);
});

// var massage = "I am number 4";

// var hash = SHA256(massage).toString();


// var data = {
//     id : 5
// };

// var token = jwt.sign(data, 'saltingSecret');

// var decoded = jwt.verify(token, 'saltingSecret');

// console.log('Decoded:', decoded);



// console.log(`Massage: ${massage}`);
// console.log(`Hashed Text : ${hash}`);