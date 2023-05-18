const mongoose = require('mongoose');

const facesSchema = new mongoose.Schema({
  nin: {
    type: String,
    required: true
  },
  imagePath: {
    type: String,
    required: true
  }
});

const Face = mongoose.model('Face', facesSchema);

module.exports = Face;