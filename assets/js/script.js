import { displayWorks,displayWorksModal, deleteWork } from "./works.js"; 
import { getCategories, displayCategories, filterWorksByCategory} from "./categories.js"; 
// gallery et categories filters
await displayCategories();
displayWorks();
displayWorksModal();
const categoryButtons = document.querySelectorAll('.button-category-filter');
categoryButtons.forEach(button => {
    button.addEventListener('click', () => {    
        categoryButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        filterWorksByCategory(button);
    });
}); 
// modal modifier gallery
const body=document.querySelector('body');
const button_modifier = document.querySelector('.button-modifier');
const button_fermer1 = document.querySelector('.button-fermer1');
const button_fermer2 = document.querySelector('.button-fermer2');
const modal1 = document.querySelector('.modal1');
const modal2 = document.querySelector('.modal2');
button_modifier.addEventListener('click', () => {
    modal1.style.display = 'block';
    body.style.background = "rgba(0, 0, 0, 0.3)";
});
button_fermer1.addEventListener('click', () => {
    modal1.style.display = 'none';
    body.style.background = 'white';
});
button_fermer2.addEventListener('click', () => {
    modal2.style.display = 'none';
    body.style.background = 'white';
});
// modal ajouter une photo
const button_ajouter = document.querySelector('.button-ajoute-photo');
const modal_ajouter = document.querySelector('.modal2');
const button_retour = document.querySelector('.retourne-modal1');

button_ajouter.addEventListener('click', () => {
    modal1.style.display = 'none';
    modal_ajouter.style.display = 'block';  
});

button_retour.addEventListener('click', () => {
    modal2.style.display = 'none';
    modal1.style.display = 'block';
});

// affiche liste des categories dans le select du modal ajouter une photo
const selectCategory = document.querySelector('#select-category');
const categories = await getCategories();
categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category.id;
    option.textContent = category.name;
    selectCategory.appendChild(option);
});

// gestion du formulaire d'ajout de photo
const form = document.querySelector('.form-ajouter-photo');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const fileInput = document.querySelector('#photo');
    if (!fileInput.files[0]) {
        alert("Choisissez un fichier !");
        return;
    }

    const formData = new FormData();
    formData.append('image', fileInput.files[0]);
    formData.append('title', document.querySelector('#title').value);
    formData.append('category', parseInt(document.querySelector('#select-category').value));

    try {
        const response = await fetch('http://localhost:5678/api/works', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: formData
        });

        if (!response.ok) {
            console.error("HTTP Error:", response.status);
            const errorData = await response.text(); 
            console.error("Server Response:", errorData);
            return;
        }


    } catch (error) {
        console.error("Fetch Error:", error);
    }
});
// affiche img preview
const input = document.getElementById("photo");
const preview = document.getElementById("preview");

input.addEventListener("change", function () {
    const file = this.files[0];

    if (file) {
        const reader = new FileReader();

        reader.addEventListener("load", function () {
            preview.src = reader.result;
            preview.style.width="50%"
        });

        reader.readAsDataURL(file);

    }
});
// navbar login
const isLoggedIn = localStorage.getItem("isLoggedIn");

const login = document.querySelector(".login");

if (isLoggedIn === "true") {
  login.textContent = "logout";
} else {
  login.textContent = "login";
}
login.addEventListener("click", () => {
  if (localStorage.getItem("isLoggedIn") === "true") {
    localStorage.removeItem("isLoggedIn");
    window.location.reload();
  } else {
    window.location.href = "/Portfolio-architecte-sophie-bluel/FrontEnd/login.html";
  }
});
// action apres login
const cat_filter=document.querySelector(".categories-filter");
if (isLoggedIn === "true") {
  button_modifier.style.display="block";
  cat_filter.style.display="none";
}
// button valide image
const submitBtn = document.querySelector('.form-ajouter-photo input[type="submit"]');
submitBtn.disabled = true;
function checkFormValidity() {
    const title = document.querySelector('#title').value.trim();
    const file = document.querySelector('#photo').files[0];
    const category = document.querySelector('#select-category').value;

    if (title && file && category) {
        submitBtn.disabled = false;
    } else {
        submitBtn.disabled = true;
    }
}
document.querySelector('#title').addEventListener('input', checkFormValidity);
document.querySelector('#photo').addEventListener('change', checkFormValidity);
document.querySelector('#select-category').addEventListener('change', checkFormValidity);