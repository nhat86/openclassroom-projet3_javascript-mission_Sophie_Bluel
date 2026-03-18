export async function getCategories() {
    const response = await fetch("http://localhost:5678/api/categories");
    const categories = await response.json();
    return categories;
}
export async function displayCategories() {
    const categories = await getCategories();   
    categories.forEach(category => {
        const categoriesFilter = document.querySelector('.categories-filter');
        const button = document.createElement('button');
        button.classList.add('button-category-filter');
        button.textContent = category.name;
        button.dataset.categoryId = category.id;
        categoriesFilter.appendChild(button);
    });
}
export async function filterWorksByCategory(button) {
    const categoryId = button.dataset.categoryId;
    const response = await fetch("http://localhost:5678/api/works");
    const works = await response.json();
    const filteredWorks = categoryId === 'all' ? works : works.filter(work => work.categoryId === parseInt(categoryId));
    const gallery = document.querySelector('.gallery');
    gallery.innerHTML = '';
    filteredWorks.forEach(work => {
        const figure = document.createElement('figure');
        const img = document.createElement('img');
        img.src = work.imageUrl;
        img.alt = work.title;
        figure.appendChild(img);
        const titre = document.createElement('figcaption');
        titre.textContent = work.title;
        figure.appendChild(titre);  
        gallery.appendChild(figure);
    });
}
