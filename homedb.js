  const mongoose = require('mongoose');

  const connectDB = async () => {
    
     try{
         const connect = await mongoose.connect('mongodb://localhost:27017/homedata', {
         useNewUrlParser: true,
         useUnifiedTopology: true
     });
     
         console.log(`MongoDB connected... `); 
         console.log(`hostname: ${connect.connection.host}`);

     }catch(err){
        console.log(err);
     }


  }

  module.exports = connectDB;