const mongoose = require('mongoose');


const votesSchema = new mongoose.Schema({
    positions:[
        {
            type: String,
            required: true
        }
    ],
    names:[
        {
            type: String,
            required: true
        }
    ],
    partys:[
        {
            type: String,
            uppercase: true,
            required: true
        }
    ],
    nin:{
        type: String, required: true,
    }
  });
  const Votes = mongoose.model("vote", votesSchema);

module.exports = Votes;