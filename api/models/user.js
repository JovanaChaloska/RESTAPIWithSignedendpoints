const mongoose = require('mongoose');
const Crypto = require('crypto');

const userModel = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: {type: String, required: true, unique: true, 
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/},
    hash: String,
    salt: String
});

userModel.methods.setPassword = function(password) { 
    this.salt = Crypto.randomBytes(16).toString('hex'); 
    this.hash = Crypto.pbkdf2Sync(password, this.salt, 1000, 64, `sha512`).toString(`hex`); 
}; 
     

userModel.methods.validPassword = function(password) { 
    var hash = Crypto.pbkdf2Sync(password, this.salt, 1000, 64, `sha512`).toString(`hex`); 
    return this.hash === hash; 
};  

module.exports = mongoose.model('User', userModel);