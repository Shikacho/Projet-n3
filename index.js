document.addEventListener("DOMContentLoaded", () => {
  const gallery = document.querySelector(".gallery");
  const buttonsContainer = document.querySelector(".buttons");

  const displayProjects = (projects) => {
    gallery.innerHTML = "";
    projects.forEach((work) => {
      const figure = document.createElement("figure");

      const img = document.createElement("img");
      img.src = work.imageUrl;
      img.alt = work.title;

      const figcaption = document.createElement("figcaption");
      figcaption.textContent = work.title;

      figure.appendChild(img);
      figure.appendChild(figcaption);
      gallery.appendChild(figure);
    });
  };

  const fetchData = () => {
    return fetch("http://localhost:5678/api/works")
      .then((response) => response.json())
      .then((data) => {
        localStorage.setItem("projects", JSON.stringify(data));
        return data;
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
      (data) =>
        data.filter((work) => work.categoryId === categoryIds["Objets"]),
      data
    );
    createButton(
      "Appartements",
      (data) =>
        data.filter((work) => work.categoryId === categoryIds["Appartements"]),
      data
    );
    createButton(
      "Hotels & Restaurants",
      (data) =>
        data.filter(
          (work) => work.categoryId === categoryIds["Hotels & Restaurants"]
        ),
      data
    );

    displayProjects(data);
    buttonsContainer.querySelector("button").classList.add("active");
  };

  const storedProjects = localStorage.getItem("projects");

  if (storedProjects) {
    const data = JSON.parse(storedProjects);
    initializeButtons(data);
  } else {
    fetchData()
      .then((data) => {
        initializeButtons(data);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des données:", error);
      });
  }
});
