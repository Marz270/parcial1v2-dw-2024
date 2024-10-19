import { auth } from "../validations/auth.js";

const username = auth.getUsername();

function createNavbar() {
    const navbarHTML = `
        <nav>
            <ul>
                <li><a href="/">Lista completa de temas</a></li>
                <li><a href="/userItemList/index.html">Tu lista de temas</a></li>
                <li id="username">${username}</li>
                <li id="logout-button" style="display: none;">
                    <a href="#" id="logout-link">Logout</a>
                </li>
            </ul>
        </nav>
    `;

    // Inserta la navbar en el elemento con id "navbar"
    document.getElementById('navbar').innerHTML = navbarHTML;

    document.getElementById('logout-link').addEventListener('click', handleLogout);

    // Verifica si el usuario está autenticado
    if (auth.isAuthenticated()) {
        console.log("esto funciona");
        document.getElementById("logout-button").style.display = "block";
    }
}

async function handleLogout() {
    // Llama al método de logout
    auth.logout();
    // Oculta el botón de logout
    document.getElementById("logout-button").style.display = "none";
    // Redirige a la página de inicio o a la página de login
    window.location.href = "/"; // Cambia a la ruta deseada
}

// Inicializa la navbar al cargar el script
document.addEventListener("DOMContentLoaded", createNavbar);
