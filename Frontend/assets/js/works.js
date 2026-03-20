const API_URL = "http://localhost:5678/api/works";

// --- API ---
async function fetchWorks() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Erreur API");
        return await response.json();
    } catch (error) {
        console.error("Erreur lors du fetch des works :", error);
        return [];
    }
}

export async function deleteWork(workId) {
    try {
        const response = await fetch(`${API_URL}/${workId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        });

        if (!response.ok) throw new Error("Erreur suppression");
    } catch (error) {
        console.error("Erreur suppression :", error);
    }
}

// --- UI ---
function createDeleteButton(workId, figure) {
    const button = document.createElement("button");
    button.type = "button";
    button.classList.add("button-supprimer");

    const icon = document.createElement("img");
    icon.src = "./assets/icons/btn_supprimer.png";

    button.appendChild(icon);

    button.addEventListener("click", async (e) => {
        e.preventDefault();
        e.stopPropagation();

        await deleteWork(workId);

        // Mise à jour dynamique de la galerie sans rechargement de page
        await displayWorks();
        await displayWorksModal();

        // Supprimer le visuel immédiatement (fallback si displayWorksModal est lent)
        figure.remove();
    });

    return button;
}

function renderGallery(selector, works, withCaption = true, withDeleteButton = false) {
    const container = document.querySelector(selector);
    container.innerHTML = "";

    const fragment = document.createDocumentFragment();

    works.forEach(work => {
        const figure = document.createElement("figure");

        const img = document.createElement("img");
        img.src = work.imageUrl;
        img.alt = work.title;
        figure.appendChild(img);

        if (withCaption) {
            const caption = document.createElement("figcaption");
            caption.textContent = work.title;
            figure.appendChild(caption);
        }

        if (withDeleteButton) {
            const button = createDeleteButton(work.id, figure);
            figure.appendChild(button);
        }

        fragment.appendChild(figure);
    });

    container.appendChild(fragment);
}

// --- PUBLIC FUNCTIONS ---
export async function displayWorks() {
    const works = await fetchWorks();
    renderGallery(".gallery", works);
}

export async function displayWorksModal() {
    const works = await fetchWorks();
    renderGallery(".gallery-modal", works, false, true);
}