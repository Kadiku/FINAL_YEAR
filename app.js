const express = require('express');
const port = process.env.PORT || 5000;
const connectDB = require('./homedb');
const Citizens = require('./citizens');
const Registers = require('./registers');
const Candidates = require('./candidates');
const Face = require('./faces');
const Votes = require('./votes');
const session = require('express-session');
const bytes = require('bytes');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const axios = require('axios');
const NodeWebcam = require('node-webcam');
let alert = require('alert');
const { createCanvas, loadImage } = require('canvas');
const faceapi = require('face-api.js');
const canvas = require('canvas');
const cloudinary = require('cloudinary').v2;

const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });


// async function loadModels() {
//   // Specify the model URLs
//   const MODEL_URL = 'https://cdn.jsdelivr.net/npm/face-api.js@latest/weights';

//   try {
//     // Load face-api.js models
//     await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
//     await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
//     await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);

//     console.log('Face models loaded successfully.');

//     // Proceed with face detection or other operations
//     // ...
//   } catch (error) {
//     console.error('Error loading face models:', error);
//   }
// }

// // Call the loadModels function before using face-api.js
// loadModels();

const app = express();

const bodyParser = require('body-parser');

// Set the payload size limit to 10MB (or any other value you prefer)
const payloadSizeLimit = '10MB';
app.use(bodyParser.urlencoded({ limit: payloadSizeLimit, extended: false }));
app.use(bodyParser.json({ limit: payloadSizeLimit }));

cloudinary.config({
  cloud_name: "dnbstrta4",
  api_key: "342782392454458",
  api_secret: "AySVXc42xEdrIVuIW3uEziHOSzk"
});

// Add this middleware to your app to enable sessions
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));


app.use(express.json());

app.use(express.urlencoded({extended: true}));

app.use(express.static('public'));

app.get('/homepagescript.js', (req, res) => {
    res.setHeader('Content-Type', 'text/javascript');
    res.sendFile(__dirname + '/homepagescript.js');
  });

  app.get('/facecapture.js', (req, res) => {
    res.setHeader('Content-Type', 'text/javascript');
    res.sendFile(__dirname + '/facecapture.js');
  });

  app.get('/faceauthentication.js', (req, res) => {
    res.setHeader('Content-Type', 'text/javascript');
    res.sendFile(__dirname + '/faceauthentication.js');
  });

  app.get('/apositionscript.js', (req, res) => {
    res.setHeader('Content-Type', 'text/javascript');
    res.sendFile(__dirname + '/apositionscript.js');
  });

app.get('/loginscript.js', (req, res) => {
    res.setHeader('Content-Type', 'text/javascript');
    res.sendFile(__dirname + '/loginscript.js');
  });

app.get('/dashboardscript.js', (req, res) => {
    res.setHeader('Content-Type', 'text/javascript');
    res.sendFile(__dirname + '/dashboardscript.js');
  });

  app.get('/adminscript.js', (req, res) => {
    res.setHeader('Content-Type', 'text/javascript');
    res.sendFile(__dirname + '/adminscript.js');
  });

  app.get('/votescript.js', (req, res) => {
    res.setHeader('Content-Type', 'text/javascript');
    res.sendFile(__dirname + '/votescript.js');
  });

  app.get('/dpositionscript.js', (req, res) => {
    res.setHeader('Content-Type', 'text/javascript');
    res.sendFile(__dirname + '/dpositionscript.js');
  });


app.get('/form',(req,res)=>{
    
    res.sendFile(__dirname + '/public/index.html');
});

app.post('/formget',(req,res)=>{
    let citizensdata = new Citizens({nin:req.body.nin,
        firstname:req.body.firstname,lastname:req.body.lastname,dob:req.body.dob});
        citizensdata.save();
        res.redirect('/homepage');
});

app.get('/homepage', async(req,res)=>{
         res.sendFile(__dirname + '/homepage.html');
})

app.post('/formPost', async(req,res)=>{
    const { nin, firstname, lastname, dob, phonenumber, password, email, gender} = req.body;

    const citizen = await Citizens.findOne({ nin });
  if (!citizen) {
    // return res.status(404).send('Citizen not found.');
    return alert('Citizen not found.')
  }

  const existingRegistration = await Registers.findOne({ nin });
  if (existingRegistration) {
    // return res.status(400).send('Citizen has already been registered.');
    return alert('Citizen has already been registered.')
  }

  // Check eligibility based on the citizen's age and nin
  const ageLimit = 18; // Minimum age requirement
  const today = new Date();
  const birthdate = new Date(citizen.dob);
  const age = today.getFullYear() - birthdate.getFullYear();
  const isOldEnough = age >= ageLimit;
  
  if (!isOldEnough) {
    // return res.status(400).send('You are not eligible to register.');
    return alert('You are not eligible to register.')
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const registersData = new Registers({ nin, firstname, lastname, dob, phonenumber,    password: hashedPassword, email, gender });
    registersData.save();
    res.redirect(`/facecapture?nin=${nin}`);
    } catch (error) {
        console.error(error);
        return alert('An error occurred while processing the registration.')
    }
});

app.get('/facecapture', (req, res) => {
  res.sendFile(__dirname + '/facecapture.html');

  async function loadImage(imagePath, imageFormat) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = `data:image/${imageFormat};base64,${fs.readFileSync(imagePath).toString('base64')}`;
    });
  }
}); 
app.post('/facecapture', async (req, res) => {
  const { imageData, imageType, } = req.body;
  const nin = req.query.nin || req.body.nin; // Check both query parameter and request body for NIN
  
  console.log('Received Image Type:', imageType);
  console.log('Received NIN:', nin);
  
  if (!nin) {
    return res.status(400).send('NIN is missing.');
  }

  try {
    const result = await cloudinary.uploader.upload(imageData, { public_id: nin });

    const imagePath = result.secure_url;

    // Load the captured image using the canvas module
    const img = await loadImage(imagePath, imageType);

  //   const imageUrl = imagePath;
  //   const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
  //   const buffer = Buffer.from(response.data, 'binary');
  //   const image = await loadImage(buffer);

  //   // Perform face detection with faceapi
  //   const detections = await faceapi.detectAllFaces(image).withFaceLandmarks().withFaceDescriptors();

  //  if (detections.length === 0) {
  //     return res.status(400).send('No face detected in the picture.');
  //   }

  //   // Save the face descriptors to the Face model with the NIN used to register
  //   const faceDescriptor = detections[0].descriptor;
    const faceData = new Face({ nin, imagePath });
    await faceData.save();

    res.redirect('/login');
  } catch (error) {
    console.error(error);
    return res.status(500).send('An error occurred while capturing the face.');
  }
});

app.get('/authenticate', (req, res) => {
  res.sendFile(__dirname + '/faceauthentication.html');
});

app.post('/authenticate', async (req, res) => {
  const { imageData, imageType } = req.body;
  const nin = req.query.nin || req.body.nin; // Check both query parameter and request body for NIN

  const base = await Face.findOne({ nin });

  const result = await cloudinary.uploader.upload(imageData, { public_id: `${nin}-login` });

  const imagePath = result.secure_url;

  const options = {
    method: 'POST',
    url: 'https://facematch.p.rapidapi.com/API/verify/Facematch',
    headers: {
      'content-type': 'application/json',
      'X-RapidAPI-Key': '63ce7aa17cmshd19182b019f1c7ap159109jsn65b110130c86',
      'X-RapidAPI-Host': 'facematch.p.rapidapi.com'
    },
    data: {
      method: 'facevalidate',
      txn_id: 'test-f23a-4bed-88fa-270befab4407',
      clientid: '222',
      image_url1: base.imagePath,
      image_url2: imagePath,
    }
  };
  
  try {
    const response = await axios.request(options);
    console.log(response.data.Succeeded);

    const { data } = response.data.Succeeded
    if (Number(data.confidence) >= 85.0) {
      if(nin.startsWith("3")) {
        return res.redirect(`/admin?nin=${nin}`);
      }else{
       return res.redirect(`/dashboard?nin=${nin}`);
      }
    }
    else{
     return res.redirect(`/login`);
    }
  } catch (error) {
    console.error(error);
  }


});

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/loginpage.html');
  });
  
  app.post('/login', async (req, res) => {
    
    const { nin, password } = req.body;
  
    try {
      const citizen = await Registers.findOne({ nin });
      if (!citizen) {
        // NIN not found
        // return res.status(404).send('Citizen not found.');
        return alert('Voter not found.')
      }

      const isPasswordCorrect = await bcrypt.compare(password, citizen.password);
      if (!isPasswordCorrect ) {
        // Incorrect password
        // return res.status(401).send('Incorrect password.');
         return alert('Incorrect Password')
      }

      // if (citizen.nin.startsWith('3')) {
      //   return res.redirect(`/admin?nin=${citizen.nin}`);
      // }
  
      // Login successful
      res.redirect(`/authenticate?nin=${citizen.nin}`);
      // res.redirect(`/dashboard?nin=${citizen.nin}`);
  
    } catch (error) {
      console.error(error);
      // res.status(500).send('An error occurred while processing the login.');
      return alert('An error occurred while processing the login.')
    }
  });

  app.get('/api/getFirstName', async (req, res) => {
    const { nin } = req.query;
  
    try {
      const citizen = await Registers.findOne({ nin });
      if (!citizen) {
        // NIN not found
        // return res.status(404).json({message: 'Citizen not found.'});
        return alert('Citizenzzz not found.')
      }
  
      res.send(citizen.firstname);
  
    } catch (error) {
      console.error(error);
      // res.status(500).send('An error occurred while processing the request.');
      return alert('An error occurred while processing the request.')
    }
  });

  app.get('/userimage', async (req, res) => {
    const { nin } = req.query;
  
    try {
      const image = await Face.findOne({ nin });
      res.send(image.imagePath);
  
    } catch (error) {
      console.error(error);
      // res.status(500).send('An error occurred while processing the request.');
      return alert('An error occurred while processing the request.')
    }
  });


  app.get('/api/getUserProfile', async (req, res) => {
    try {
      const { nin } = req.query;
      const user = await Registers.findOne({ nin });
      if (!user) {
        // return res.status(404).json({ message: 'User not found' });
        return alert('User not found')
      }
      const { firstname, lastname, email, phonenumber, gender, nin: userNin } = user;
      res.json({ firstname, lastname, email, phonenumber, gender, nin: userNin });
    } catch (error) {
      console.error(error);
      // res.status(500).json({ message: 'Server Error' });
      return alert('Server Error')
    }
  });

  app.get('/dashboard', (req, res) => {
    res.sendFile(__dirname + '/dashboard.html');
  }); 

  app.get('/admin', (req, res) => {
    res.sendFile(__dirname + '/admin.html');
  }); 

  app.get('/vote', (req, res) => {
    res.sendFile(__dirname + '/vote.html');
  }); 

  app.get('/dposition', (req, res) => {
    res.sendFile(__dirname + '/dposition.html');
  }); 
  
  app.get('/aposition', (req, res) => {
    res.sendFile(__dirname + '/addposition.html');
  }); 

  app.post('/aposition', async(req,res)=>{
    const { positionname, candidatename, politicalparty} = req.body;

  try {
    const candidatesData = new Candidates({ positionname, candidatename, politicalparty });
    candidatesData.save();
    res.setHeader('Refresh', '0; URL=/aposition');
    return alert('New position and candidate added')
  } catch (error) {
    console.error(error);
    // res.status(500).send('An error occurred while processing the registration.');
    return alert('An error occurred while adding new position.')
  }
   
})


app.get('/votes/:nin', async (req, res) => {
  const nin = req.params.nin;
  const voted = await Votes.findOne({ nin });
  if (voted) {
    displaySelectedCandidates(selectedCandidates);
  } else {
    axios.get('/candidates')
      .then(response => {
        // handle response
        res.status(200).send('NIN not found in votes collection');
      })
      .catch(error => {
        // handle error
        res.status(500).send('Error retrieving candidates');
      });
  }
});

app.post('/votes', async(req,res)=>{
  const { position, name, party, nin} = req.body;

try {
  const votesData = new Votes(
    {
      positions: req.body.selectedCandidates?.map((details) => (
        details.position
      )),
      names: req.body.selectedCandidates?.map((details) => (
        details.name
      )),
      partys: req.body.selectedCandidates?.map((details) => (
        details.party
      )),
      nin: nin
    }
  );
 
  votesData.save();
  // res.setHeader('Refresh', '0; URL=/aposition');
  // return alert('Votes added')
} catch (error) {
  console.error(error);
  // res.status(500).send('An error occurred while processing the registration.');
  return alert('An error occurred while adding new position.')
}
 
})


app.get('/candidates', async (req, res) => {
  try {
    const candidates = await Candidates.find({});
    res.json(candidates);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while fetching candidates.');
  }
});

app.get('/result', async (req, res) => {
  try {
    const votes = await Votes.find({})

    const results = {};
    
    // Loop through all the votes and count the number of votes for each candidate under each position
    votes.forEach(vote => {
      const { positions, names, partys } = vote;
      positions.forEach((position, index) => {
        if (!results[position]) {
          results[position] = {};
        }
        if (!results[position][names[index]]) {
          results[position][names[index]] = { party: partys[index], count: 0 };
        }
        results[position][names[index]].count++;
      });
    });

    // Send the results as a JSON response
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while fetching candidates.');
  }
});


  app.post('/logout', (req, res) => {
    req.session.destroy((error) => {
      if (error) {
        console.error(error);
        // res.status(500).send('An error occurred while logging out.');
        return alert('An error occurred while logging out.')
      } else {
        // res.status(200).send('Logged out successfully.');
        return alert('Logged out successfully.')
      }
    });
  });

  app.get('/api/getRegisteredVotersCount', async (req, res) => {
    try {
      const count = await Registers.countDocuments({ nin: { $not: /^3/ } });
      res.send(count.toString());
    } catch (error) {
      console.error(error);
      // res.status(500).send('Internal server error');
      return alert('Internal server error')
    }
  });

  app.delete('/deleteCandidate', (req, res) => {
    const selectedCandidates = req.body.selectedCandidates;
  
    const deletePromises = selectedCandidates.map(candidate => {
      const { position, name, party } = candidate;
      return Candidates.deleteOne({ positionname: position, candidatename: name, politicalparty: party });
    });
  
    Promise.all(deletePromises)
      .then(results => {
        return alert('Selected candidates deleted successfully');
      })
      .catch(error => {
        console.error(error);
        return alert('Failed to delete selected candidates');
      });
  });

  app.get('/positionsCount', async (req, res) => {
    try {
      const uniquePositions = await Candidates.distinct('positionname');
      const count = uniquePositions.length;
      res.send(count.toString());
    } catch (error) {
      console.error(error);
      return res.status(500).send('Internal server error');
    }
  });

  app.get('/candidatesCount', async (req, res) => {
    try {
      const count = await Candidates.distinct('candidatename').countDocuments();
      res.send(count.toString());
    } catch (error) {
      console.error(error);
      // res.status(500).send('Internal server error');
      return alert('Internal server error')
    }
  });

  app.get('/votersCount', async (req, res) => {
    try {
      const count = await Votes.countDocuments({ nin: { $not: /^3/ } });
      res.send(count.toString());
    } catch (error) {
      console.error(error);
      // res.status(500).send('Internal server error');
      return alert('Internal server error')
    }
  });

  
  // Handle GET request on the /api/votes endpoint
  app.get('/api/votes', async (req, res) => {
    try {
      const voted = await Votes.find({
        nin: req.query.nin
      });
      return res.json(voted);
    } catch (err) {
      console.error(err);
      returnres.status(500).json({ message: 'Internal server error' });
    }
});

app.get("/voted", async (req, res) => {
  const nin = req.params.nin;
  const votesSnapshot = await Votes.where("nin", "==", nin).get();
  const selectedCandidates = [];
  votesSnapshot.forEach((doc) => {
    const voteData = doc.data();
    selectedCandidates.push(...voteData.selectedCandidates);
  });
  res.json(selectedCandidates);
});


app.listen(port,()=>{
    console.log(`Server started at http://localhost:${port}`)
});

connectDB();
