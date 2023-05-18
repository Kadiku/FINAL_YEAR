const mongoose = require('mongoose');


const candidatesSchema = new mongoose.Schema({
    positionname:{
        type:String, required: true,
        index: true // add index to positionname field
    },

    candidatename:{
        type:String, required:true
    },

    politicalparty:{
        type:String, uppercase: true, required:true
    }
  });
  const Candidates = mongoose.model("candidate", candidatesSchema);

module.exports = Candidates;