const loginForm = document.querySelector('.login-form');

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const emailInput = document.querySelector('#username');
    const passwordInput = document.querySelector('#password');

    const email = emailInput.value.trim();//supprime les espaces au début et à la fin
    const password = passwordInput.value.trim();

    // Vérification simple
    if (!email || !password) {
        alert("Veuillez remplir tous les champs");
        return;
    }

    try {
        const response = await fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            throw new Error("Identifiants incorrects");
        }

        const data = await response.json();

        // Sauvegarde session
        localStorage.setItem("token", data.token);
        localStorage.setItem("isLoggedIn", "true");

        // Redirection
        window.location.href = "index.html";

    } catch (error) {
        console.error("Erreur login :", error);
        alert("Erreur dans l’identifiant ou le mot de passe");
    }
});