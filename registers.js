const mongoose = require('mongoose');

const registersSchema = new mongoose.Schema({
    nin:{
        type: String, required: true, maxLength: 11, minLength: 11
    },

    firstname:{
        type:String, required: true
    },

    lastname:{
        type:String, required:true, uppercase: true
    },

    phonenumber:{
        type:String, required:true, maxLength: 11, minLength: 11
    },

    password:{
        type:String, required:true
    },

    email:{
        type:String, required:true
    },

    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other']
      },
});

const Registers = mongoose.model("register", registersSchema);
module.exports = Registers;