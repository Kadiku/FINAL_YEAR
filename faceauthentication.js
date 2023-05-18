const urlParams = new URLSearchParams(window.location.search);
const nin = urlParams.get('nin');


// Access the user's camera and capture a picture
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const constraints = { video: true };

function canvasToImage(canvas) {
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = reader.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      }, 'image/jpeg'); // Specify the image format as JPEG
    });
  }

// Function to capture the face and submit the form
async function captureFace() {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    video.srcObject = stream;
    video.play();
  
    const captureButton = document.querySelector('.capture-button input');
    captureButton.addEventListener('click', async () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      stream.getTracks().forEach(track => track.stop());
  
      console.log('Canvas dimensions:', canvas.width, canvas.height);
      // Convert the canvas to an image
      const img = await canvasToImage(canvas);
  
      // Validate image format
      const imageFormat = getImageFormat(img.src);
      if (!isValidImageFormat(imageFormat)) {
        alert('Invalid image format. Please capture a valid image.');
        return;
      }
      console.log('Image Data:', img.src);
      console.log('Image Type:', getImageFormat(img.src));
     // Create a hidden form and append the image data
const form = document.createElement('form');
form.method = 'POST';
form.action = '/authenticate';

const NIN = document.createElement('input');
NIN.type = 'hidden';
NIN.name = 'nin';
NIN.value = nin;
form.appendChild(NIN);

const inputImageData = document.createElement('input');
inputImageData.type = 'hidden';
inputImageData.name = 'imageData';
inputImageData.value = img.src;
form.appendChild(inputImageData);

const inputImageType = document.createElement('input');
inputImageType.type = 'hidden';
inputImageType.name = 'imageType';
inputImageType.value = imageFormat; // Pass the image format obtained from getImageFormat()
form.appendChild(inputImageType);

// Submit the form
document.body.appendChild(form);
form.submit();
    });
  }
  
  // Function to get the image format from the data URL
  function getImageFormat(dataUrl) {
    const matches = dataUrl.match(/^data:image\/(\w+);base64,/);
    if (matches) {
      return matches[1];
    }
    return null;
  }
  
  // Function to check if the image format is valid
  function isValidImageFormat(format) {
    // Add supported image formats here (e.g., 'jpeg', 'png', 'gif', etc.)
    const supportedFormats = ['jpeg', 'png'];
    return supportedFormats.includes(format.toLowerCase());
  }


// Call the captureFace function when the page loads
window.addEventListener('load', captureFace);