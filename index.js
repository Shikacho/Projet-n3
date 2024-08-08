document.addEventListener("DOMContentLoaded", () => {
  let allProjects = [];
  const mainGallery = document.querySelector(".main-gallery");
  const buttonsContainer = document.querySelector(".buttons");
  const loginLogout = document.getElementById("login-logout");
  const editBar = document.getElementById("edit-bar");
  const header = document.querySelector("header");
  const modalLink = document.querySelector(".js-modal");

  const displayProjects = (projects) => {
    mainGallery.innerHTML = "";
    projects.forEach((work) => {
      const figure = document.createElement("figure");
      figure.setAttribute('data-id', work.id);

      const img = document.createElement("img");
      img.src = work.imageUrl;
      img.alt = work.title;

      const figcaption = document.createElement("figcaption");
      figcaption.textContent = work.title;

      figure.appendChild(img);
      figure.appendChild(figcaption);
      mainGallery.appendChild(figure);
    });
  };

  const fetchData = () => {
    const token = localStorage.getItem("authToken");
    return fetch("http://localhost:5678/api/works", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        allProjects = data;
        displayProjects(allProjects);
        return data;
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des données:", error);
      });
  };

  const createButton = (text, filterFn, data) => {
    const button = document.createElement("button");
    button.textContent = text;
    button.addEventListener("click", () => {
      const activeButton = buttonsContainer.querySelector(".active");
      if (activeButton) activeButton.classList.remove("active");
      button.classList.add("active");
      displayProjects(filterFn(data));
    });
    buttonsContainer.appendChild(button);
  };

  const initializeButtons = (data) => {
    createButton("Tous", () => data, data);

    const categoryIds = {
      Objets: 1,
      Appartements: 2,
      "Hotels & Restaurants": 3,
    };

    createButton(
      "Objets",
      (data) => data.filter((work) => work.categoryId === categoryIds["Objets"]),
      data
    );
    createButton(
      "Appartements",
      (data) => data.filter((work) => work.categoryId === categoryIds["Appartements"]),
      data
    );
    createButton(
      "Hotels & Restaurants",
      (data) => data.filter((work) => work.categoryId === categoryIds["Hotels & Restaurants"]),
      data
    );

    displayProjects(data);
    buttonsContainer.querySelector("button").classList.add("active");
  };

  fetchData()
    .then((data) => {
      if (localStorage.getItem("loggedIn") === "true") {
        loginLogout.innerHTML = '<a href="#" id="logout">Logout</a>';
        editBar.style.display = "flex";
        header.classList.add("with-edit-bar");

        document.getElementById("logout").addEventListener("click", () => {
          localStorage.removeItem("loggedIn");
          localStorage.removeItem("authToken");
          window.location.href = "./login.html";
        });

        if (modalLink) {
          modalLink.style.display = "block";
        }

        buttonsContainer.style.display = "none";
        displayProjects(data);
      } else {
        editBar.style.display = "none";

        if (modalLink) {
          modalLink.style.display = "none";
        }

        initializeButtons(data);
      }
    })
    .catch((error) => {
      console.error("Erreur lors de la récupération des données:", error);
    });
});