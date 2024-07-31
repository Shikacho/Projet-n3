document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.querySelector(".login-form");
  const errorMessage = document.querySelector(".error-message");

  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (email === "sophie.bluel@test.tld" && password === "S0phie") {
      sessionStorage.setItem("loggedIn", "true");
      window.location.href = "./index.html";
    } else {
      errorMessage.textContent = "E-mail ou mot de passe incorrect.";
      errorMessage.style.display = "block";
    }
  });
});
