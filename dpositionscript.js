const urlParams = new URLSearchParams(window.location.search);
const nin = urlParams.get('nin');

const voteLink = document.getElementById('dash-link');
const voteUrl = `/admin?nin=${nin}`;
voteLink.href = voteUrl;

const posLink = document.getElementById('pos-link');
const posUrl = `/aposition?nin=${nin}`;
posLink.href = posUrl;

const submitButton = document.querySelector('#submit-button');
submitButton.addEventListener('click', () => {
  const confirmed = confirm('Are you sure you want to delete this positions?');
  if (confirmed) {
    collectSelectedCandidates();
  }
});

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



  fetch('/candidates')
  .then(response => response.json())
  .then(data => {
    // Create a map to group the candidates by position
    const candidatesByPosition = new Map();
    data.forEach(candidate => {
      const positionName = candidate.positionname;
      const candidates = candidatesByPosition.get(positionName) || [];
      candidates.push(candidate);
      candidatesByPosition.set(positionName, candidates);
    });

    // Generate a table for each position
    const tablesContainer = document.querySelector('#tables-container');
    candidatesByPosition.forEach((candidates, positionName) => {
      const table = document.createElement('table');
      table.classList.add('position-table');

      const headerRow = document.createElement('tr');
      const positionHeaderCell = document.createElement('th');
      positionHeaderCell.textContent = positionName;
      positionHeaderCell.classList.add('header-cell');
      positionHeaderCell.setAttribute('colspan', '');
      headerRow.appendChild(positionHeaderCell);
      table.appendChild(headerRow);

      const spacerRow = document.createElement('tr');
      const spacerCell = document.createElement('th');
      spacerCell.setAttribute('colspan', '3');
      spacerRow.appendChild(spacerCell);
      table.appendChild(spacerRow);

      const subHeaderRow = document.createElement('tr');
      const candidateNameHeaderCell = document.createElement('th');
      candidateNameHeaderCell.textContent = 'Candidate Name';
      candidateNameHeaderCell.classList.add('subheader-cell');
      subHeaderRow.appendChild(candidateNameHeaderCell);

      const politicalPartyHeaderCell = document.createElement('th');
      politicalPartyHeaderCell.textContent = 'Political Party';
      politicalPartyHeaderCell.classList.add('subheader-cell');
      subHeaderRow.appendChild(politicalPartyHeaderCell);

      const checkboxHeaderCell = document.createElement('th');
      checkboxHeaderCell.textContent = 'Delete';
      checkboxHeaderCell.classList.add('subheader-cell');
      subHeaderRow.appendChild(checkboxHeaderCell);

      table.appendChild(subHeaderRow);

      candidates.forEach(candidate => {
        const row = document.createElement('tr');
        const candidateNameCell = document.createElement('td');
        candidateNameCell.textContent = candidate.candidatename;
        candidateNameCell.classList.add('table-cell');
        row.appendChild(candidateNameCell);

        const politicalPartyCell = document.createElement('td');
        politicalPartyCell.textContent = candidate.politicalparty;
        politicalPartyCell.classList.add('table-cell');
        row.appendChild(politicalPartyCell);

        const checkboxCell = document.createElement('td');
        checkboxCell.classList.add('table-cell');
        const checkboxInput = document.createElement('input');
        checkboxInput.type = 'checkbox';
        checkboxInput.addEventListener('change', (event) => {
          // Get all the checkboxes under the same position
          const positionRows = Array.from(table.getElementsByTagName('tr')).slice(3);
          const positionCheckboxes = positionRows.map(row => row.getElementsByTagName('input')[0]);
          
        });
        checkboxCell.appendChild(checkboxInput);
        row.appendChild(checkboxCell);
      

        table.appendChild(row);
      });

      tablesContainer.appendChild(table);
    });
  })
  .catch(error => console.error(error));


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

// const candidateDeleteButton = document.getElementById('submit-button');
// candidateDeleteButton.addEventListener('click', async () => {
//     try {
//         await fetch("/deleteCandidate", 
//         { 
//             method: 'DELETE',
//             // body: JSON.stringify(),
//             // headers: {
//             //     'Content-Type': 'application/json'
//             // }
//         })
//     } catch (error) {
//         console.log(error)
//     }
// })

function collectSelectedCandidates() {
    const selectedCandidates = [];
  
    // Loop through all the checkboxes and collect the selected ones
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
      if (checkbox.checked) {
        // Find the candidate's name, political party, and position name
        const positionName = checkbox.parentNode.parentNode.parentNode.querySelector('th').textContent;
        const candidateName = checkbox.parentNode.parentNode.querySelector('.table-cell').textContent;
        const politicalParty = checkbox.parentNode.parentNode.querySelector('.table-cell:nth-child(2)').textContent;
  
        // Add the candidate to the collection
        selectedCandidates.push({ position: positionName, name: candidateName, party: politicalParty });
      }
    });
  
    // Do something with the selected candidates
    console.log(selectedCandidates.map((details) => (
      details
    )));

    fetch('/deleteCandidate', {
      method: 'DELETE',
      body: JSON.stringify({selectedCandidates}),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to delete selected candidates');
      }
      return response.json();
    })
    .then(data => {
      console.log(data);
    })
    .catch(error => {
      console.error(error);
    });
  }

// Add event listener to hide the user popup when the user clicks outside of it
document.addEventListener('click', hideUserPopup);
