export async function displayWorks() {
    const gallery=document.querySelector('.gallery');
    const response = await fetch("http://localhost:5678/api/works");
    const works = await response.json()

    gallery.innerHTML = '';
    works.forEach(work => {
        const figure = document.createElement('figure');
        const img = document.createElement('img');
        img.src = work.imageUrl;
        figure.appendChild(img);
        img.alt = work.title;
        const titre = document.createElement('figcaption');
        titre.textContent = work.title;
        figure.appendChild(titre);
        gallery.appendChild(figure);
    });
}
export async function displayWorksModal() {    
    const gallery=document.querySelector('.gallery-modal');
    const response = await fetch("http://localhost:5678/api/works");
    const works = await response.json()
    gallery.innerHTML = '';
    works.forEach(work => {
        const figure = document.createElement('figure');
        const img = document.createElement('img');
        img.src = work.imageUrl;
        figure.appendChild(img);
        const buttonSupprimer = document.createElement('button');
        buttonSupprimer.type="button";
        buttonSupprimer.classList.add('button-supprimer');
        const imgSupprimer = document.createElement('img');
        imgSupprimer.src = './assets/icons/btn_supprimer.png';
        buttonSupprimer.appendChild(imgSupprimer);
        gallery.appendChild(figure);
        figure.appendChild(buttonSupprimer);
        // button supprimer image 
        buttonSupprimer.addEventListener('click', async (event) => {
            event.preventDefault();
            event.stopPropagation();
            await deleteWork(work.id);
            figure.remove();
        });
    });
}

export async function deleteWork(workId) {
    await fetch(`http://localhost:5678/api/works/${workId}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
    });
}