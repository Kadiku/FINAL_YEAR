const mongoose = require('mongoose');

const citizensSchema = new mongoose.Schema({
    nin:{
        type: String, required: true, maxLength: 11, minLength: 11, unique: true
    },

    firstname:{
        type:String, required: true
    },

    lastname:{
        type:String, required:true, uppercase: true
    },

    dob:{
        type:String, required:true
    },
});

const Citizens = mongoose.model("citizen", citizensSchema);
module.exports = Citizens;