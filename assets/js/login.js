const loginForm = document.querySelector('.login-form');
loginForm.addEventListener('submit', async function(event) {
    event.preventDefault();
    const email = document.querySelector('#username').value;
    const password = document.querySelector('#password').value;
    try {

    const response = await fetch("http://localhost:5678/api/users/login", {

      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        email: email,
        password: password
      })

    });

    const data = await response.json();
    if (response.ok) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("isLoggedIn", "true");
      window.location.href = "index.html";
    } else {
      alert("Erreur dans l’identifiant ou le mot de passe");
    }
    } catch (error) {

    console.error("Erreur:", error);

  }
});