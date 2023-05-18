const urlParams = new URLSearchParams(window.location.search);
const nin = urlParams.get('nin');

const voteLink = document.getElementById('dash-link');
const voteUrl = `/admin?nin=${nin}`;
voteLink.href = voteUrl;

const posLink = document.getElementById('delete-link');
const posUrl = `/dposition?nin=${nin}`;
posLink.href = posUrl;

// Make an AJAX request to retrieve the user's first name
const xhr = new XMLHttpRequest();
xhr.open('GET', `/api/getFirstName?nin=${nin}`);
xhr.onload = () => {
  if (xhr.status === 200) {
    const firstName = xhr.response;
    // Update the HTML element with the user's first name
    document.getElementById('firstName').textContent = firstName;
  } else {
    console.error(xhr.statusText);
  }
};
xhr.onerror = () => {
  console.error(xhr.statusText);
};
xhr.send();

fetch(`/userimage?nin=${nin}`)
  .then(response => {
    if (response.ok) {
      return response.text();
    } else {
      throw new Error('Request failed.');
    }
  })
  .then(imageUrl => {
    // Update the src attribute of the image element
    const userImage = document.getElementById('user-image');
    userImage.src = imageUrl;
  })
  .catch(error => {
    console.error(error);
    // Handle error case
  });

const logoutButton = document.getElementById('logout-button');

logoutButton.addEventListener('click', async () => {
    try {
      await fetch('/logout', { method: 'POST' });
      window.location.replace('/login');
      history.go(-1);
      history.go(-1);
    } catch (error) {
      console.error(error);
    }
  });


  const isLoggedIn = () => {
    // Check if the user is logged in
    // Return true if the user is logged in, false otherwise
  };
  
  window.addEventListener('popstate', () => {
    if (!isLoggedIn() && window.location.pathname !== '/login') {
      // Redirect the user to the login page if they are not logged in
      window.location.replace('/login');
    }
  });

  fetch('/api/getRegisteredVotersCount')
  .then(response => response.text())
  .then(count => {
    // Update the count element with the fetched count
    document.getElementById('registered-voters-count').textContent = count;
  });

  async function updateRegisteredVotersCount() {
    try {
      const response = await fetch('/api/getRegisteredVotersCount');
      const count = await response.text();
      document.getElementById('registered-voters-count').textContent = count;
    } catch (error) {
      console.error(error);
    }
  }
  
  updateRegisteredVotersCount();
  setInterval(updateRegisteredVotersCount, 60000); // update count every 1 minute

  fetch('/positionsCount')
  .then(response => response.text())
  .then(count => {
    // Update the count element with the fetched count
    document.getElementById('positions').textContent = count;
  });

  async function updatepositionCount() {
    try {
      const response = await fetch('/positionsCount');
      const count = await response.text();
      document.getElementById('positions').textContent = count;
    } catch (error) {
      console.error(error);
    }
  }
  
  updatepositionCount();
  setInterval(updatepositionCount, 60000); // update count every 1 minute


  fetch('/candidatesCount')
  .then(response => response.text())
  .then(count => {
    // Update the count element with the fetched count
    document.getElementById('candidate').textContent = count;
  });

  async function updatecandidateCount() {
    try {
      const response = await fetch('/candidatesCount');
      const count = await response.text();
      document.getElementById('candidate').textContent = count;
    } catch (error) {
      console.error(error);
    }
  }
  
  updatecandidateCount();
  setInterval(updatecandidateCount, 60000); // update count every 1 minute

  var today = new Date();
  var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  var dateTime = today.toLocaleDateString('en-US', options) + ' ' + today.toLocaleTimeString();

  // Update the HTML with the current time and date
  document.getElementById("date-time").innerHTML = dateTime;



  // Get the user's NIN from the query string


// Add event listener for the "User" button
const userButton = document.getElementById('user-button');
userButton.addEventListener('click', async () => {
  try {
    // Fetch the user's profile details from the server
    const response = await fetch(`/api/getUserProfile?nin=${nin}`);
    const userProfile = await response.json();

    // Update the popup with the user's profile details
    document.getElementById('user-firstname').textContent = userProfile.firstname;
    document.getElementById('user-lastname').textContent = userProfile.lastname;
    document.getElementById('user-email').textContent = userProfile.email;
    document.getElementById('user-phonenumber').textContent = userProfile.phonenumber;
    document.getElementById('user-gender').textContent = userProfile.gender;
    document.getElementById('user-nin').textContent = userProfile.nin;

    // Show the popup
    document.getElementById('user-popup').style.display = 'block';
  } catch (error) {
    console.error(error);
  }
});

// Function to hide the user popup when the user clicks outside of it
function hideUserPopup(event) {
  if (!event.target.closest('#user-popup') && !event.target.closest('#user-button')) {
    document.getElementById('user-popup').style.display = 'none';
  }
}

// Add event listener to hide the user popup when the user clicks outside of it
document.addEventListener('click', hideUserPopup);


const myForm = document.getElementById('myForm');
myForm.addEventListener('submit', async (event) => {
  form.action = "/aposition";
  form.submit();

  if (response.ok) {
    alert('New position and candidate added');
    window.location.reload(); // reload the page
  } else {
    alert('An error occurred while adding new position.');
  }
});