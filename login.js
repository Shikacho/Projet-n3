document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.querySelector(".login-form");
  const errorMessage = document.querySelector(".error-message");

  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (email === "sophie.bluel@test.tld" && password === "S0phie") {
      fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email, password: password }),
      })
        .then((response) => {
          if (!response.ok) {
            return response.text().then((text) => {
              throw new Error(text);
            });
          }
          return response.json();
        })
        .then((data) => {
          if (data.token) {
            localStorage.setItem("authToken", data.token);
            localStorage.setItem("loggedIn", "true");
            window.location.href = "./index.html";
          } else {
            errorMessage.textContent = "E-mail ou mot de passe incorrect.";
            errorMessage.style.display = "block";
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          errorMessage.textContent =
            "Une erreur est survenue. Veuillez réessayer.";
          errorMessage.style.display = "block";
        });
    } else {
      errorMessage.textContent = "E-mail ou mot de passe incorrect.";
      errorMessage.style.display = "block";
    }
  });
});
