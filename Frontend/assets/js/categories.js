// Récupération des catégories depuis l'API
export async function getCategories() {
    try {
        const response = await fetch("http://localhost:5678/api/categories");
        if (!response.ok) throw new Error("Erreur API catégories");
        return await response.json();
    } catch (error) {
        console.error("Erreur fetch catégories :", error);
        return [];
    }
}

// Affiche les boutons de filtres dynamiquement
export async function displayCategories() {
    const categories = await getCategories();   
    const categoriesFilter = document.querySelector('.categories-filter');

    const fragment = document.createDocumentFragment();

    categories.forEach(category => {
        const button = document.createElement('button')
        button.classList.add('button-category-filter');
        button.textContent = category.name;
        button.dataset.categoryId = category.id;
        fragment.appendChild(button);
    });

    // Ajouter un bouton "Tous" par défaut
    const allButton = document.createElement('button');
    allButton.classList.add('button-category-filter', 'active');
    allButton.textContent = "Tous";
    allButton.dataset.categoryId = 'all';
    fragment.prepend(allButton);

    categoriesFilter.appendChild(fragment);
}

// Fonction utilitaire pour créer un figure (réutilisable)
function createWorkFigure(work) {
    const figure = document.createElement('figure');

    const img = document.createElement('img');
    img.src = work.imageUrl;
    img.alt = work.title;

    const caption = document.createElement('figcaption');
    caption.textContent = work.title;

    figure.append(img, caption);
    return figure;
}

// Filtrer les travaux par catégorie et afficher dans la galerie
export async function filterWorksByCategory(button) {
    const categoryId = button.dataset.categoryId;

    try {
        const response = await fetch("http://localhost:5678/api/works");
        if (!response.ok) throw new Error("Erreur API travaux");
        const works = await response.json();

        const filteredWorks = categoryId === 'all'
            ? works
            : works.filter(work => work.categoryId === parseInt(categoryId));

        const gallery = document.querySelector('.gallery');
        gallery.innerHTML = '';

        const fragment = document.createDocumentFragment();
        filteredWorks.forEach(work => {
            fragment.appendChild(createWorkFigure(work));
        });

        gallery.appendChild(fragment);
    } catch (error) {
        console.error("Erreur fetch travaux :", error);
    }
}