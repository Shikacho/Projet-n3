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

  fetch("http://localhost:5678/api/works")
    .then((response) => response.json())
    .then((data) => {
      const createButton = (text, filterFn) => {
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

      createButton("Tous", () => data);

      const categoryIds = {
        Objets: 1,
        Appartements: 2,
        "Hotels & Restaurants": 3,
      };

      createButton("Objets", (data) =>
        data.filter((work) => work.categoryId === categoryIds["Objets"])
      );
      createButton("Appartements", (data) =>
        data.filter((work) => work.categoryId === categoryIds["Appartements"])
      );
      createButton("Hotels & Restaurants", (data) =>
        data.filter(
          (work) => work.categoryId === categoryIds["Hotels & Restaurants"]
        )
      );

      displayProjects(data);
      buttonsContainer.querySelector("button").classList.add("active");
    })
    .catch((error) => {
      console.error("Erreur lors de la récupération des données:", error);
    });
});
