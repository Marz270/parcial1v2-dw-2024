import { auth } from "../validations/auth.js";

const API_URL = "http://localhost/back";
const themeList = document.getElementById("themeList");

document.addEventListener("DOMContentLoaded", () => {
  if (!auth.isAuthenticated()) {
    window.location.href = "../index.html";
  } else {
    initializePage();
  }
});

async function initializePage() {
  await getTaskListUser();
}

async function getTaskListUser() {
  try {
    const user_id = auth.getId();
    const response = await fetch(`${API_URL}/usuarios/${user_id}/temas/`, {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch tasks list");
    }
    const data = await response.json();
    renderThemeList(data);
  } catch (error) {
    console.error("Error al obtener el listado de tareas:", error);
    alert(
      "Error al cargar la lista de tareas. Por favor, intente de nuevo más tarde."
    );
  }
}

function renderThemeList(themes) {
  themes.forEach((theme) => {
    const card = createTaskCard(theme);
    themeList.appendChild(card);
  });
}

function createTaskCard(theme) {
  const card = document.createElement("div");
  card.classList.add("card");
  card.innerHTML = `
        <div class="cookie-card">
            <span class="title">${theme.titulo}</span>
                <p class="description">Duración: ${theme.descripcion}.</p>
                <p class="description">Creador: ${theme.creador}</p>
                <div class="actions">
                    <button class="pref">
                        Ver comentarios
                    </button>
                    <button class="accept">
                        Editar tarea
                    </button>
                </div>
        </div>
            `;
  card.querySelector(".pref").addEventListener("click", () => {
    window.location.href = `../viewItem/index.html?id=${theme.id_tema}`;
  });

  return card;
}
