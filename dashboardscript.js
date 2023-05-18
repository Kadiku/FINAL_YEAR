const urlParams = new URLSearchParams(window.location.search);
const nin = urlParams.get('nin');

const voteLink = document.getElementById('vote-link');
const voteUrl = `/vote?nin=${nin}`;
voteLink.href = voteUrl;

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

  fetch('/votersCount')
  .then(response => response.text())
  .then(count => {
    // Update the count element with the fetched count
    document.getElementById('voter').textContent = count;
    document.getElementById('votes').textContent = count;
  });

  async function updatevoterCount() {
    try {
      const response = await fetch('/votersCount');
      const count = await response.text();
      document.getElementById('voter').textContent = count;
    } catch (error) {
      console.error(error);
    }
  }
  
  updatevoterCount();
  setInterval(updatevoterCount, 60000); // update count every 1 minute


  var today = new Date();
  var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  var dateTime = today.toLocaleDateString('en-US', options) + ' ' + today.toLocaleTimeString();

  // Update the HTML with the current time and date
  document.getElementById("date-time").innerHTML = dateTime;

  fetch(`/result`)
  .then(response => response.json())
  .then(data => {
    console.log('Data:', data);
    console.log('Type of data:', typeof data);
    const tablesContainer = document.getElementById("tables-container");
tablesContainer.innerHTML = "";

// Loop through each position in the data object
for (const position in data) {
  // Create a new table element for each position
  const table = document.createElement("table");
  table.classList.add("position-table");

  // Create a header row for the position
  const headerRow = table.insertRow();
  const positionHeaderCell = headerRow.insertCell();
  positionHeaderCell.colSpan = 2;
  const positionHeader = document.createElement("th");
  positionHeader.textContent = position;
  positionHeaderCell.appendChild(positionHeader);
  positionHeaderCell.classList.add("header-cell");

  // Create a subheader row for the table
  const subHeaderRow = table.insertRow();
  subHeaderRow.innerHTML = `<th class="subheader-cell">Candidate Name</th><th class="subheader-cell">Political Party</th><th class="subheader-cell">Votes</th>`;

  // Loop through each candidate in the position
  let totalVotes = 0;
  for (const candidate in data[position]) {
    // Create a new row for each candidate
    const dataRow = table.insertRow();
    const nameDataCell = dataRow.insertCell();
    nameDataCell.innerHTML = candidate;
    nameDataCell.classList.add("table-cell");
    const partyDataCell = dataRow.insertCell();
    partyDataCell.innerHTML = data[position][candidate].party;
    partyDataCell.classList.add("table-cell");
    const votesDataCell = dataRow.insertCell();
    votesDataCell.innerHTML = data[position][candidate].count;
    votesDataCell.classList.add("table-cell");
    totalVotes += parseInt(data[position][candidate].count);
  }

  const footerRow = table.insertRow();
  const footerCell = footerRow.insertCell();
  footerCell.colSpan = 3;
  footerCell.style.textAlign = "right";
  footerCell.style.fontWeight = "bold";
  footerCell.innerHTML = `Total votes: ${totalVotes}`;
  console.log(`Position: ${position} Total Votes: ${totalVotes}`);
  
  tablesContainer.appendChild(table);

  // Append the table to the tables container element
  tablesContainer.appendChild(table);
}
    // Add "Voting Results" header
    const headerRow = document.createElement("tr");
    const headerCell = document.createElement("th");
    headerCell.colSpan = 2;
    headerCell.textContent = "Voting Results";
    headerCell.style.textAlign = "center";
    headerCell.style.whiteSpace = "nowrap";
    headerCell.style.fontSize = "18px";
    headerCell.style.padding = "10px";
    headerCell.style.display = "flex";
    headerCell.style.justifyContent = "center";
    headerCell.style.verticalAlign = "middle";
    headerRow.appendChild(headerCell);
    tablesContainer.insertBefore(headerRow, tablesContainer.firstChild);
  
    // Remove any existing submit button
    const submitButton = document.getElementById("submit-button");
    if (submitButton) {
      submitButton.parentNode.removeChild(submitButton);
    }
  })

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