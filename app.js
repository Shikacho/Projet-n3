let modal = null;

const openModal1 = (e) => {
  e.preventDefault();
  const target = document.querySelector(e.target.getAttribute('href'));
  target.style.display = 'flex'; 
  target.removeAttribute('aria-hidden');
  target.setAttribute('aria-modal', 'true');
  modal = target;
  modal.querySelector('.js-modal-close').addEventListener('click', closeModal);
  setTimeout(() => {
    document.addEventListener('click', handleOutsideClick);
  }, 0);
  loadProjectsInModal(); 
};

const closeModal = (e) => {
  if (modal === null) return;
  const isClickInside = modal.contains(e.target);
  const isClickOnCloseButton = e.target.closest('.js-modal-close');
  if (!isClickInside || isClickOnCloseButton) {
    e.preventDefault();
    modal.style.display = "none";
    modal.setAttribute('aria-hidden', 'true');
    modal.removeAttribute('aria-modal');
    modal.removeEventListener('click', closeModal);
    document.removeEventListener('click', handleOutsideClick);
    modal.querySelector('.js-modal-close').removeEventListener('click', closeModal);
    modal = null;
  }
};

const handleOutsideClick = (e) => {
  if (modal && !modal.contains(e.target) && !e.target.closest('.js-modal-close')) {
    closeModal(e);
  }
};

const loadProjectsInModal = () => {
  const modalGallery = modal.querySelector(".modal-gallery");
  const token = localStorage.getItem("authToken");
  fetch("http://localhost:5678/api/works", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      modalGallery.innerHTML = "";
      data.forEach((work) => {
        const figure = document.createElement("figure");
        figure.setAttribute("data-id", work.id);

        const img = document.createElement("img");
        img.src = work.imageUrl;
        img.alt = work.title;

        const deleteButton = document.createElement("button");
        deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
        deleteButton.addEventListener("click", (event) => {
          event.stopPropagation(); 
          deleteProject(work.id);
        });

        figure.appendChild(img);
        figure.appendChild(deleteButton);
        modalGallery.appendChild(figure);
      });
    })
    .catch((error) => {
      console.error("Erreur lors de la récupération des données pour la modale:", error);
    });
};

const deleteProject = (id) => {
  const token = localStorage.getItem("authToken");
  fetch(`http://localhost:5678/api/works/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      if (response.ok) {
        const figure = document.querySelector(`figure[data-id="${id}"]`);
        if (figure) {
          figure.remove();
        }
        const mainGallery = document.querySelector(".main-gallery");
        const mainFigure = mainGallery.querySelector(`figure[data-id="${id}"]`);
        if (mainFigure) {
          mainFigure.remove();
        }
      } else {
        console.error("Erreur lors de la suppression du projet");
      }
    })
    .catch((error) => {
      console.error("Erreur lors de la suppression du projet:", error);
    });
};

document.querySelectorAll(".js-modal").forEach((a) => {
  a.addEventListener("click", openModal1);
});