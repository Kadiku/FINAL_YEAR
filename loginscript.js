const form = document.querySelector("form"),
passField = form.querySelector(".create-password"),
passInput = passField.querySelector(".password")


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

// calling function on form Submit
form.addEventListener("submit", (e) =>{
e.preventDefault(); //preventing form submitting
createPass();

//calling function on key up
passInput.addEventListener("keyup", createPass);

if(!passField.classList.contains("invalid")) {
form.action = "/login";
form.submit();
}
});