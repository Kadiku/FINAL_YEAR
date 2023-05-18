 const form = document.querySelector("form"),
       emailField = form.querySelector(".email-field"),
       emailInput = emailField.querySelector(".email"),
       passField = form.querySelector(".create-password"),
       passInput = passField.querySelector(".password"),
       cpassField = form.querySelector(".confirm-password"),
       cpassInput = cpassField.querySelector(".cPassword");

const responseDiv = document.getElementById("response-message");

// Email validation
function checkEmail(){
    const emaipattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
    if (!emailInput.value.match(emaipattern)) {
      return emailField.classList.add("invalid");
    }
    emailField.classList.remove("invalid"); //removing invalid class if email value matched with emaipattern
}

//Hide and show password
const eyeIcons = document.querySelectorAll(".show-hide");

eyeIcons.forEach(eyeIcon =>{
  eyeIcon.addEventListener("click", () => {
   const pInput = eyeIcon.parentElement.querySelector("input");
   if (pInput.type === "password") {
     eyeIcon.classList.replace("la-eye-slash", "la-eye");
     return (pInput.type = "text");
   }
   eyeIcon.classList.replace("la-eye", "la-eye-slash");
   pInput.type = "password";
  });
});

// Password validation
function createPass(){
 const passPattern = 
   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

 if (!passInput.value.match(passPattern)){
   return passField.classList.add("invalid");
  }
  passField.classList.remove("invalid");
}

// Confirmpassword validation
function confirmPass(){
    if(passInput.value !== cpassInput.value || cpassInput.value === ""){
      return cpassField.classList.add("invalid");
    }
    cpassField.classList.remove("invalid");
}

// calling function on form Submit
form.addEventListener("submit", (e) =>{
 e.preventDefault(); //preventing form submitting
 checkEmail();
 createPass();
 confirmPass();

 //calling function on key up
 emailInput.addEventListener("keyup", checkEmail);
 passInput.addEventListener("keyup", createPass);
 cpassInput.addEventListener("keyup", confirmPass);

 if(!emailField.classList.contains("invalid") &&
    !passField.classList.contains("invalid") &&
    !cpassField.classList.contains("invalid")
    ) {
      form.action = "/formPost";
      form.submit();
  
    }
});


if (response.status === 200) {
  responseDiv.innerHTML = "Registration successful!";
} else if (response.status === 403) {
  responseDiv.innerHTML = "You are not eligible to register.";
} else if (response.status === 400) {
  responseDiv.innerHTML = "You have already registered.";
} else if (response.status === 404) {
  responseDiv.innerHTML = "Citizen not found.";
}