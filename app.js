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

  
  document.getElementById('add-photo-btn').addEventListener('click', function () {
    
    document.getElementById('gallery-content').style.display = 'none';
    document.getElementById('titlemodal').style.display = 'none';

    
    document.getElementById('add-photo-content').style.display = 'flex';
    document.getElementById('titlemodal2').style.display = 'block';
  });

  
  document.getElementById('back-to-gallery').addEventListener('click', function () {
    
    document.getElementById('add-photo-content').style.display = 'none';
    document.getElementById('titlemodal2').style.display = 'none';

    
    document.getElementById('gallery-content').style.display = 'flex';
    document.getElementById('titlemodal').style.display = 'block';
  });
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

  
  if (!token) {
    console.error("Aucun token d'authentification trouvé.");
    return;
  }

  fetch("http://localhost:5678/api/works", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Erreur lors de la récupération des projets : ${response.statusText}`);
      }
      return response.json();
    })
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
      console.error("Erreur lors de la récupération des données pour la modale:", error.message || error);
    });
};

const deleteProject = (id) => {
  console.log(`Tentative de suppression du projet avec ID : ${id}`);
  const token = localStorage.getItem("authToken");

  
  console.log(`Token d'authentification utilisé : ${token}`);

  
  if (!token) {
    console.error("Aucun token d'authentification trouvé. Impossible de supprimer le projet.");
    return;
  }

  fetch(`http://localhost:5678/api/works/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  .then((response) => {
    if (response.ok) {
      console.log(`Projet avec ID ${id} supprimé avec succès.`);
      const figure = document.querySelector(`figure[data-id="${id}"]`);
      if (figure) {
        figure.remove();
      }
      const mainGallery = document.querySelector(".main-gallery");
      const mainFigure = mainGallery.querySelector(`figure[data-id="${id}"]`);
      if (mainFigure) {
        mainFigure.remove();
      }
    } else if (response.status === 401) {
      console.error("Le token d'authentification est invalide ou expiré. Veuillez vous reconnecter.");
      throw new Error("Unauthorized: Vous devez être authentifié pour supprimer ce projet.");
    } else {
      console.error(`Échec de la suppression : Code de statut ${response.status} ${response.statusText}`);
      return response.json().then(data => {
        console.error(`Erreur lors de la suppression du projet avec ID ${id}:`, JSON.stringify(data, null, 2));
        throw new Error(data.error || `Une erreur est survenue lors de la suppression du projet avec ID ${id}.`);
      });
    }
  })
  .catch((error) => {
    console.error("Erreur lors de la suppression du projet:", error.message || JSON.stringify(error, null, 2));
  });
};


document.getElementById('photo-upload').addEventListener('change', function(event) {
  const file = event.target.files[0];
  const previewContainer = document.getElementById('photo-preview-container');
  const previewImage = document.getElementById('photo-preview');

  if (file) {
    const reader = new FileReader();

    reader.onload = function(e) {
      previewImage.src = e.target.result;
      previewContainer.style.display = 'block';
    };

    reader.readAsDataURL(file);
  } else {
    previewContainer.style.display = 'none';
    previewImage.src = '';
  }
});


document.getElementById('photo-preview').addEventListener('click', function(event) {
  const previewContainer = document.getElementById('photo-preview-container');
  const photoUploadInput = document.getElementById('photo-upload');

  
  previewContainer.style.display = 'none';
  photoUploadInput.value = ''; 
});

document.querySelectorAll(".js-modal").forEach((a) => {
  a.addEventListener("click", openModal1);
});