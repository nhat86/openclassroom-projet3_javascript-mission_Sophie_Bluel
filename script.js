import { displayWorks, displayWorksModal } from "./works.js"; 
import { getCategories, displayCategories, filterWorksByCategory } from "./categories.js"; 

// ----------------------------
// INITIALISATION GALERIE
// ----------------------------
await displayCategories();
await displayWorks();
await displayWorksModal();

// ----------------------------
// FILTRE PAR CATEGORIE
// ----------------------------
const categoryButtons = document.querySelectorAll('.button-category-filter');
categoryButtons.forEach(button => {
    button.addEventListener('click', () => {    
        categoryButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        filterWorksByCategory(button);
    });
});

// ----------------------------
// MODAL
// ----------------------------
const body = document.querySelector('body');
const modal1 = document.querySelector('.modal1');
const modal2 = document.querySelector('.modal2');

const modalToggles = [
    { btn: '.button-modifier', show: modal1 },
    { btn: '.button-fermer1', hide: modal1 },
    { btn: '.button-fermer2', hide: modal2 }
];

modalToggles.forEach(({ btn, show, hide }) => {
    document.querySelector(btn).addEventListener('click', () => {
        if (show) show.style.display = 'block';
        if (hide) hide.style.display = 'none';
        body.style.background = show ? "rgba(0,0,0,0.3)" : 'white';
    });
});

// ----------------------------
// MODAL AJOUT PHOTO
// ----------------------------
const buttonAjouter = document.querySelector('.button-ajoute-photo');
const buttonRetour = document.querySelector('.retourne-modal1');

buttonAjouter.addEventListener('click', () => {
    modal1.style.display = 'none';
    modal2.style.display = 'block';
});

buttonRetour.addEventListener('click', () => {
    modal2.style.display = 'none';
    modal1.style.display = 'block';
});

// ----------------------------
// SELECT CATEGORIES DANS MODAL
// ----------------------------
const selectCategory = document.querySelector('#select-category');
const categories = await getCategories();
categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category.id;
    option.textContent = category.name;
    selectCategory.appendChild(option);
});

// ----------------------------
// FORMULAIRE AJOUT PHOTO
// ----------------------------
const form = document.querySelector('.form-ajouter-photo');
const submitBtn = form.querySelector('input[type="submit"]');
submitBtn.disabled = true;

function checkFormValidity() {
    const title = form.querySelector('#title').value.trim();
    const file = form.querySelector('#photo').files[0];
    const category = form.querySelector('#select-category').value;
    submitBtn.disabled = !(title && file && category);
}

['#title', '#photo', '#select-category'].forEach(id => {
    form.querySelector(id).addEventListener('input', checkFormValidity);
    form.querySelector(id).addEventListener('change', checkFormValidity);
});

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fileInput = form.querySelector('#photo');
    if (!fileInput.files[0]) return alert("Choisissez un fichier !");

    const formData = new FormData();
    formData.append('image', fileInput.files[0]);
    formData.append('title', form.querySelector('#title').value);
    formData.append('category', parseInt(selectCategory.value));

    try {
        const response = await fetch('http://localhost:5678/api/works', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error("Erreur HTTP:", response.status, errorData);
            return;
        }

        // Mise à jour dynamique sans rafraîchir la page
        await displayWorks();
        await displayWorksModal();

        // Garder le modal d'ajout ouvert
        modal2.style.display = 'none';
        modal1.style.display = 'block';
        body.style.background = "rgba(0,0,0,0.3)";

        // Réinitialiser l'aperçu image
        preview.src = "./assets/icons/picture-ajoute.png";
        preview.style.width = "";

        form.reset();
        submitBtn.disabled = true;

    } catch (error) {
        console.error("Erreur fetch:", error);
    }
});

// ----------------------------
// PREVIEW IMAGE
// ----------------------------
const input = document.getElementById("photo");
const preview = document.getElementById("preview");

input.addEventListener("change", () => {
    const file = input.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
        preview.src = reader.result;
        preview.style.width = "30%";
    };
    reader.readAsDataURL(file);
});

// ----------------------------
// NAVBAR LOGIN / LOGOUT
// ----------------------------
const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
const login = document.querySelector(".login");

login.textContent = isLoggedIn ? "logout" : "login";
login.addEventListener("click", () => {
    if (isLoggedIn) {
        localStorage.removeItem("token");
        localStorage.removeItem("isLoggedIn");
        window.location.reload();
    } else {
        window.location.href = "/FrontEnd/login.html";
    }
});

// ----------------------------
// ACTIONS POST LOGIN
// ----------------------------
const cat_filter = document.querySelector(".categories-filter");
if (isLoggedIn) {
    document.querySelector('.button-modifier').style.display = "block";
    cat_filter.style.display = "none";
}


// ----------------------------
// BARRE NOIRE EN HAUT DE LA PAGE (MODE CONNECTE)
// ----------------------------
function afficherBandeauAdmin() {
    const token = localStorage.getItem("token");
    let bandeau = document.getElementById("bandeau-admin");
    console.log(token);
    console.log(bandeau);
    if (token && !bandeau) {
        bandeau = document.createElement("div");
        bandeau.id = "bandeau-admin";
        bandeau.classList.add("bandeau-admin");
        bandeau.innerHTML = `
            <p><img src="assets/icons/Vector.png" alt="connecté">Mode édition</p>
        `;

        document.body.prepend(bandeau);
    }
    if (!token && bandeau) {
        bandeau.remove();
    }
}

afficherBandeauAdmin();