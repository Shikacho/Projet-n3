document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.querySelector(".login-form");
  const errorMessage = document.querySelector(".error-message");

  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    
    fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, password: password }),
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("Non autorisé");
          } else if (response.status === 404) {
            throw new Error("Utilisateur non trouvé");
          } else {
            return response.text().then((text) => {
              throw new Error(text);
            });
          }
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
        if (error.message === "Non autorisé") {
          errorMessage.textContent = "Non autorisé.";
        } else if (error.message === "Utilisateur non trouvé") {
          errorMessage.textContent = "Utilisateur non trouvé.";
        } else {
          errorMessage.textContent = "Une erreur est survenue. Veuillez réessayer.";
        }
        errorMessage.style.display = "block";
      });
  });
});

