import { auth } from "../validations/auth.js";

const API_URL = 'http://localhost/back';
const commentList = document.getElementById("comments-section");

function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

const themeId = getQueryParam('id');
const user_id = auth.getId();
const id_creador = getQueryParam('id_creador');
console.log(id_creador);

document.addEventListener('DOMContentLoaded', () => {
  if (!auth.isAuthenticated()) {
    window.location.href = '../index.html';
  } else {
    
    if (themeId) {
      fetchCommentData();
    } else {
      console.error('ID de tema no proporcionado');
      alert('Error: ID de tema no proporcionado');
      window.location.href = '../itemList/index.html';
    }
  }


/*
  document.getElementById('eliminarBtn').addEventListener('click', deleteComment);
  document.getElementById('editarBtn').addEventListener('click', editPerson);
*/

});

async function fetchCommentData() {
    try{
        const response = await fetch(`${API_URL}/usuarios/${user_id}/temas/${themeId}/comentarios`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth.token}`,
              },
        });

        if(response.ok) {
            const comentarios = await response.json();
            renderCommentsList(comentarios);
        } else {
            handleFetchError(response);
          }
    } catch (error) {
          console.error('Error al obtener los comentarios:', error);
          alert('Error al obtener los comentarios');
        }
        
    }


function renderCommentsList(comentarios) {
    comentarios.forEach((comentario) => {
        const comment = createComment(comentario);
        commentList.appendChild(comment);
    });
}

function createComment(comment) {
    const comentario = document.createElement('div');
    comentario.classList.add("comment");
    comentario.innerHTML = `
    <p class="comment-text">${comment.descripcion}</p>
    <button id="eliminarBtn>Eliminar</button>"`
    return comentario;
}    


async function deleteComment() {
  const confirmDelete = confirm("¿Seguro que desea eliminar este comentario?");
  if (!confirmDelete) return;
  try {
    // Si el id de la persona no es el mismo que el del usuario autenticado, no permitir la eliminación
    const userId = auth.getId();
    console.log('User ID:', userId);
    console.log('Person ID:', id_creador);
    if (String(userId) !== String(id_creador)) {
      alert('No tienes permisos para eliminar este comentario');
      return;
    }

/// http://localhost/back/usuarios/2/temas/3/comentarios/17
    const response = await fetch(`${API_URL}/usuarios/${userId}/temas/${themeId}/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth.token}`,
      },
    });

    if (response.ok) {
      alert('Persona eliminada con éxito');

      // Eliminamos al token del local storage
      auth.logout();

      // Redirigimos al usuario a la página de login
      window.location.href = '/';
    } else {
      handleFetchError(response);
    }
  } catch (error) {
    console.error('Error al eliminar la persona:', error);
    alert('Error al eliminar la persona');
  }
}

/*

async function editPerson(){
  const userId = auth.getId();
    console.log('User ID:', userId);
    console.log('Person ID:', taskId);
    if (String(userId) !== String(taskId)) {
      alert('No tienes permisos para editar esta persona');
      return;
    }
    window.location.href = `../editForm/index.html?id=${taskId}`;
}
*/

function handleFetchError(response) {
  if (response.status === 401) {
    alert('Sesión expirada. Por favor, vuelva a iniciar sesión.');
    auth.logout();
    window.location.href = '../login/index.html';
  } else if (response.status === 403) {
    alert('No tiene permiso para realizar esta acción.');
  } else {
    alert('Error al procesar la solicitud.');
  }
}