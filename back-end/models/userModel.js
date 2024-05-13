const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator'); 

const Schema = mongoose.Schema;

const  userSchema = new Schema({
    email: {
        type: String,
        required: true,
        //the email associated to the user in the database is going to be unique
        unique: true
    },
    password: {
        type: String,
        required: true
    }
})

//static signup method
userSchema.statics.signup = async function(email, password) {
    //validation 💪
    if(!email || !password){
        throw Error('All fields must be filled ⚠');
    }
    //using validator package
    if(!validator.isEmail(email)){
        throw Error('Email is not valid 😢');
    }
    if(!validator.isStrongPassword(password)){
        throw Error('Password not strong enough 🏋️‍♂️');
    }
    
    //validation to see if email already exist
    const exists = await this.findOne({ email }) 

    if(exists){
        throw Error('Email already in use... ❌');
    }
    
    //using bcrypt package to hash the passwords
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
    const user = await this.create({ email, password: hash})

    return user;
}

//static login method
userSchema.statics.login = async function(email, password){
    
    if(!email || !password){
        throw Error('All fields must be filled');
    }

    //find the user in the database with the required email
    const user = await this.findOne({email})

    if(!user){
        throw Error('Invalid login credentials')
    }

    //associating the password of the user with the hashed password (user.password of the document)
    const match = await bcrypt.compare(password, user.password)

    if(!match){
        throw Error('Invalid login credentials')
    }

    return user
}

module.exports = mongoose.model('User', userSchema);