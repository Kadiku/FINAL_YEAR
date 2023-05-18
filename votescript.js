const urlParams = new URLSearchParams(window.location.search);
const nin = urlParams.get('nin');

const voteLink = document.getElementById('dash-link');
const voteUrl = `/dashboard?nin=${nin}`;
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



const submitButton = document.querySelector('#submit-button');
submitButton.addEventListener('click', () => {
  const confirmed = confirm('Are you sure you want to submit your votes?');
  if (confirmed) {
    collectSelectedCandidates();
  }
});

const selectedCandidates = [];


fetch(`/api/votes?nin=${nin}`)
  .then(response => response.json())
  .then(data => {
    //const vote = data.find(vote => vote.nin === nin);
    if (data.length != 0) {
      console.log(data)
      return displaydata(data)
    } else {
      console.log("not found")
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
        checkboxHeaderCell.textContent = 'Vote';
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
            
            // Uncheck all the checkboxes except the one that was just clicked
            positionCheckboxes.forEach(cb => {
              if (cb !== event.target) {
                cb.checked = false;
              }
            });
          });
          checkboxCell.appendChild(checkboxInput);
          row.appendChild(checkboxCell);
        

          table.appendChild(row);
        });

        tablesContainer.appendChild(table);
      });
    })
    .catch(error => console.error(error));

  }
})
.catch(error => console.error(error));



  function collectSelectedCandidates() {
    console.log('collectSelectedCandidates() called');
  
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
    localStorage.setItem("selectedCandidates", JSON.stringify(selectedCandidates));
    displaySelectedCandidates(selectedCandidates);

  // Do something with the selected candidates
  console.log(selectedCandidates.map((details) => (
    details
  )));

    fetch('/votes', {
      method: 'POST',
      body: JSON.stringify({nin,selectedCandidates}),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      console.log('Response received from server');
      if (!response.ok) {
        throw new Error('Failed to save selected candidates');
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
  

  function displaySelectedCandidates(selectedCandidates) {
    const tablesContainer = document.getElementById("tables-container");
    tablesContainer.innerHTML = "";
    let positionNames = [];
    selectedCandidates.forEach((candidate) => {
      if (!positionNames.includes(candidate.position)) {
        positionNames.push(candidate.position);
      }
    });
    positionNames.forEach(positionName => {
      const table = document.createElement("table");
      table.classList.add('position-table'); 
      const headerRow = table.insertRow();
      const subHeaderRow = table.insertRow();
      const dataRow = table.insertRow();
      const positionHeaderCell = headerRow.insertCell();
      positionHeaderCell.colSpan = 2;
      const positionHeader = document.createElement("th");
      positionHeader.textContent = positionName;
      positionHeaderCell.appendChild(positionHeader);
      positionHeaderCell.classList.add('header-cell'); 
      subHeaderRow.innerHTML = `<th class="subheader-cell">Candidate Name</th><th class="subheader-cell">Political Party</th>`;
      const candidatesForPosition = selectedCandidates.filter(candidate => candidate.position === positionName);
      candidatesForPosition.forEach(candidate => {
        const nameDataCell = dataRow.insertCell();
        nameDataCell.innerHTML = candidate.name;
        nameDataCell.classList.add('table-cell'); 
        const partyDataCell = dataRow.insertCell();
        partyDataCell.innerHTML = candidate.party;
        partyDataCell.classList.add('table-cell'); 
      });
      tablesContainer.appendChild(table);
    });
  
    const headerRow = document.createElement("tr");
    const headerCell = document.createElement("th");
    headerCell.colSpan = 2;
    headerCell.textContent = "Your Ballot";
    headerCell.style.textAlign = "center";
    headerCell.style.whiteSpace = "nowrap";
    // headerCell.style.backgroundColor = "#f2f2f2";
    headerCell.style.fontSize = "18px";
    headerCell.style.padding = "10px"; 
    headerCell.style.display = "flex"; 
    headerCell.style.justifyContent = "center"; 
    headerCell.style.verticalAlign = "middle";
    headerRow.appendChild(headerCell);
    tablesContainer.insertBefore(headerRow, tablesContainer.firstChild);
  
  
    const submitButton = document.getElementById("submit-button");
    if (submitButton) {
      submitButton.parentNode.removeChild(submitButton);
    }
  
  } 

  function displaydata(data) {
    const tablesContainer = document.getElementById("tables-container");
    tablesContainer.innerHTML = "";
  
    // Get all unique positions from the data
    let positionNames = [];
    data.forEach((data) => {
      data.positions.forEach((position) => {
        if (!positionNames.includes(position)) {
          positionNames.push(position);
        }
      });
    });
  
    // Create a table for each position
    positionNames.forEach((position) => {
      const table = document.createElement("table");
      table.classList.add("position-table");
  
      // Add header row with position name
      const headerRow = table.insertRow();
      const positionHeaderCell = headerRow.insertCell();
      positionHeaderCell.colSpan = 2;
      const positionHeader = document.createElement("th");
      positionHeader.textContent = position;
      positionHeaderCell.appendChild(positionHeader);
      positionHeaderCell.classList.add("header-cell");
  
      // Add subheader row with "Candidate Name" and "Political Party"
      const subHeaderRow = table.insertRow();
      subHeaderRow.innerHTML = `<th class="subheader-cell">Candidate Name</th><th class="subheader-cell">Political Party</th>`;
  
      // Find the candidate that matches this position and add a row with their name and party
      const candidateIndex = data.findIndex((data) => data.positions.includes(position));
      if (candidateIndex > -1) {
        const candidate = data[candidateIndex];
        const name = candidate.names[candidate.positions.indexOf(position)];
        const party = candidate.partys[candidate.positions.indexOf(position)];
        const dataRow = table.insertRow();
        const nameDataCell = dataRow.insertCell();
        nameDataCell.innerHTML = name;
        nameDataCell.classList.add("table-cell");
        const partyDataCell = dataRow.insertCell();
        partyDataCell.innerHTML = party;
        partyDataCell.classList.add("table-cell");
      }
  
      tablesContainer.appendChild(table);
    });
  
    // Add "Your Ballot" header
    const headerRow = document.createElement("tr");
    const headerCell = document.createElement("th");
    headerCell.colSpan = 2;
    headerCell.textContent = "Your Ballot";
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
  }

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