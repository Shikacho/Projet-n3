document.addEventListener('DOMContentLoaded', function() {

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

    
    document.getElementById('photo-preview').addEventListener('click', function() {
        const previewContainer = document.getElementById('photo-preview-container');
        const photoUploadInput = document.getElementById('photo-upload');

        previewContainer.style.display = 'none'; 
        photoUploadInput.value = ''; 
    });

    
    document.getElementById('photo-form').addEventListener('submit', function(event) {
        event.preventDefault(); 

        const errorMessageDiv = document.getElementById('form-error-message');
        const successMessageDiv = document.getElementById('form-success-message');
        const title = document.getElementById('photo-title').value.trim();
        const categoryId = document.getElementById('photo-category').value; 
        const fileInput = document.getElementById('photo-upload');
        const file = fileInput.files[0];

        
        errorMessageDiv.innerHTML = '';
        successMessageDiv.innerHTML = '';
        errorMessageDiv.style.display = 'none';
        successMessageDiv.style.display = 'none';

        
        console.log(`CategoryId récupéré: ${categoryId}`);

        if (!title || !categoryId || !file) {
            errorMessageDiv.innerHTML = 'Veuillez remplir tous les champs correctement.';
            errorMessageDiv.style.display = 'block';
            return;
        }

        
        const formData = new FormData();
        formData.append('title', title);
        formData.append('category', categoryId); 
        formData.append('image', file);

        const token = localStorage.getItem("authToken");

        console.log(`Token d'authentification: Bearer ${token}`);
        console.log(`Titre: ${title}`);
        console.log(`CategoryId: ${categoryId}`);
        console.log(`Nom de l'image: ${file.name}`);

        fetch('http://localhost:5678/api/works', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: formData
        })
        .then(response => {
            console.log(`Statut de la réponse: ${response.status}`);
            if (response.ok) {
                return response.json();
            } else {
                return response.json().then(data => {
                    console.error("Erreur lors de l'ajout du projet:", JSON.stringify(data, null, 2));
                    throw new Error(data.error || 'Une erreur est survenue lors de l\'ajout du projet.');
                });
            }
        })
        .then(data => {
            successMessageDiv.innerHTML = 'Projet ajouté avec succès !';
            successMessageDiv.style.display = 'block';

            
            document.getElementById('photo-form').reset();
            document.getElementById('photo-preview-container').style.display = 'none';

            
            const mainGallery = document.querySelector('.main-gallery');
            const figure = document.createElement('figure');
            figure.setAttribute('data-id', data.id);

            const img = document.createElement('img');
            img.src = data.imageUrl; 
            img.alt = data.title;

            const caption = document.createElement('figcaption');
            caption.textContent = data.title;

            figure.appendChild(img);
            figure.appendChild(caption);
            mainGallery.appendChild(figure);

            
            const modalGallery = document.querySelector('.modal-gallery');
            const modalFigure = figure.cloneNode(true); 

            
            const deleteButton = document.createElement('button');
            deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
            deleteButton.addEventListener('click', (event) => {
                event.stopPropagation();
                deleteProject(data.id);
            });

            modalFigure.appendChild(deleteButton);
            modalGallery.appendChild(modalFigure);

            
            document.getElementById('back-to-gallery').click();
        })
        .catch(error => {
            console.error("Erreur lors de l'ajout du projet:", error.message || JSON.stringify(error, null, 2));
            errorMessageDiv.innerHTML = error.message || 'Une erreur est survenue lors de l\'ajout du projet.';
            errorMessageDiv.style.display = 'block';
        });
    });
});