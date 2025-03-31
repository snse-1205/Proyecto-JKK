let actualPage = 1;

function buscarPorNombre() {
    const nombre = document.getElementById('nombreBusqueda').value;
    const url = nombre
        ? `http://localhost:3000/buscarPorNombreFicha?nombre=${nombre}&page=${actualPage}`
        : `http://localhost:3000/FichasPersonajes?page=${actualPage}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            mostrarDatos(data.data, data.page, data.totalPages);
        })
        .catch(err => console.error('Error al buscar fichas por nombre:', err));
}

function filtrarPorTecnica() {
    const tecnicaNombre = document.getElementById('tecnicaSpinner').value;

    if (!tecnicaNombre) {
        fetch(`http://localhost:3000/FichasPersonajes?page=${actualPage}`)
            .then(response => response.json())
            .then(data => {
                mostrarDatos(data.data, data.page, data.totalPages);
            })
            .catch(err => console.error('Error al cargar todas las fichas:', err));
        return;
    }

    fetch(`http://localhost:3000/buscarFichasPorTecnicaMalditaNombre?nombre=${encodeURIComponent(tecnicaNombre)}&page=${actualPage}`)
        .then(response => response.json())
        .then(data => {
            mostrarDatos(data.data, data.page, data.totalPages);
        })
        .catch(err => console.error('Error al filtrar por técnica maldita:', err));
}

function mostrarDatos(fichas, currentPage, totalPages) {
    const tableBody = document.querySelector('#tablaFichas tbody');
    tableBody.innerHTML = '';

    fichas.forEach(ficha => {
        const row = tableBody.insertRow();
        const idCell = row.insertCell();
        idCell.textContent = ficha._id || 'N/A';
        idCell.style.display = 'none';
        row.insertCell().textContent = ficha.nombre || 'Sin nombre';
        row.insertCell().textContent = ficha.descripcion || 'Sin descripción';
        row.insertCell().textContent = ficha.genero || 'N/A';
        row.insertCell().textContent = ficha.edad || 'N/A';
        row.insertCell().textContent = ficha.estado || 'N/A';

        row.insertCell().textContent = ficha.tecnicaMaldita
            ? ficha.tecnicaMaldita.tecnicaMaldita
            : 'Sin tecnica';

        const fotoCell = row.insertCell();
        if (ficha.foto && ficha.foto.ruta && ficha.foto.nombre) {
            const img = document.createElement('img');
            const fullPath = `../../BackEnd-JJK/Archivos/${ficha.foto.nombre}`;
            img.src = fullPath;
            img.alt = ficha.nombre || 'Sin nombre';
            img.classList.add('foto-dinamica');
            fotoCell.appendChild(img);
        } else {
            fotoCell.textContent = 'Sin foto';
        }

        const actionCell = row.insertCell();

        const editButton = document.createElement('button');
        editButton.textContent = 'Editar';
        editButton.classList.add('editButton');
        editButton.onclick = () => cargarFormularioActualizar(ficha);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Eliminar';
        deleteButton.classList.add('deleteButton');
        deleteButton.onclick = () => confirmarEliminacion(ficha._id);

        actionCell.appendChild(editButton);
        actionCell.appendChild(deleteButton);
    });

    actualizarPaginacion(currentPage, totalPages);
}

function actualizarPaginacion(currentPage, totalPages) {
    const paginationElement = document.getElementById('pagination');
    paginationElement.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.onclick = () => cargarPagina(i);
        if (i === currentPage) {
            pageButton.disabled = true;
        }
        paginationElement.appendChild(pageButton);
    }

    const previousButton = document.getElementById('previousButton');
    const nextButton = document.getElementById('nextButton');
    previousButton.disabled = currentPage <= 1;
    nextButton.disabled = currentPage >= totalPages;
}

function cargarPagina(page) {
    actualPage = page;
    buscarPorNombre();
    filtrarPorTecnica();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function cargarFormularioActualizar(ficha) {
    document.getElementById('modalFormulario').style.display = 'block';
    document.getElementById('modalFormulario').scrollIntoView({ behavior: 'smooth', block: 'start' });
    document.getElementById('id').value = ficha._id;
    document.getElementById('nombre').value = ficha.nombre;
    document.getElementById('descripcion').value = ficha.descripcion;
    document.getElementById('genero').value = ficha.genero;
    document.getElementById('edad').value = ficha.edad;
    document.getElementById('estado').value = ficha.estado;

    // Manejo de la técnica maldita
    const tecnicaSelect = document.getElementById('MalitoSpinnerFunciona');
    tecnicaSelect.value = ""; // Reiniciar el valor del select
    if (ficha.tecnicaMaldita && ficha.tecnicaMaldita.tecnicaMaldita) {
        const tecnicaMalditaNombre = ficha.tecnicaMaldita.tecnicaMaldita;
        console.log(tecnicaMalditaNombre);

        let optionFound = false;
        for (let option of tecnicaSelect.options) {
            if (option.value === tecnicaMalditaNombre) {
                option.selected = true;
                optionFound = true;
                break;
            }
        }
        if (!optionFound) {
            console.error('No se encontró la técnica maldita en las opciones');
        }
    } else {
        tecnicaSelect.value = "Seleccione Tecnica"; // Valor predeterminado
    }

    // Manejo de la imagen
    const fotoContainer = document.getElementById('image-container');
    fotoContainer.innerHTML = '';

    if (ficha.foto && ficha.foto.nombre) {
        const img = document.createElement('img');
        img.src = `../../BackEnd-JJK/Archivos/${ficha.foto.nombre}`;
        img.alt = ficha.nombre || 'Vista previa';
        img.style.maxWidth = '200px';
        img.style.border = '1px solid #ddd';
        fotoContainer.appendChild(img);
    } else {
        fotoContainer.textContent = 'No hay imagen disponible';
    }

    document.getElementById('expansionDominio').checked = ficha.expansionDominio || false;
}


function abrirFormulario() {
    const formulario = document.getElementById('modalFormulario');
    formulario.style.display = 'block';

    document.getElementById('modalFormulario').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function cerrarFormulario() {
    document.getElementById('modalFormulario').style.display = 'none';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function guardarFicha(event) {
    event.preventDefault();

    const id = document.getElementById('id').value; // ID de la ficha a actualizar
    const nombre = document.getElementById('nombre').value;
    const descripcion = document.getElementById('descripcion').value;
    const genero = document.getElementById('genero').value;
    const edad = document.getElementById('edad').value;
    const estado = document.getElementById('estado').value;
    const tecnicaMaldita = document.getElementById('tecnicaMalditaID').value;
    const fotoInput = document.getElementById('foto');
    const expansionDominio = document.getElementById('expansionDominio').checked;

    let fotoNombre = "";

    if (id) {
        const fichaExistenteResponse = await fetch(`http://localhost:3000/FichasPersonajes/${id}`);
        if (!fichaExistenteResponse.ok) {
            alert("Error al recuperar la ficha existente");
            return;
        }
        const fichaExistente = await fichaExistenteResponse.json();
        fotoNombre = fichaExistente.foto || "";
    }

    if (fotoInput.files.length > 0) {
        console.log("Archivo detectado. Subiendo imagen...");
        const formData = new FormData();
        formData.append("Avatar", fotoInput.files[0]);

        try {
            const fotoResponse = await fetch("http://localhost:3000/upload", {
                method: "POST",
                body: formData
            });

            if (!fotoResponse.ok) {
                throw new Error("Error al subir la foto");
            }

            const fotoData = await fotoResponse.json();
            console.log("Imagen subida:", fotoData);
            fotoNombre = fotoData._id; // Sobrescribir con la nueva foto si se subió
        } catch (error) {
            console.error("Error al subir la imagen:", error);
            alert("No se pudo subir la imagen");
            return;
        }
    }

    console.log("Datos para la ficha:", {
        nombre,
        descripcion,
        genero,
        edad,
        estado,
        tecnicaMaldita,
        foto: fotoNombre,
        expansionDominio
    });

    const fichaData = {
        nombre: nombre,
        descripcion: descripcion,
        genero: genero,
        edad: edad,
        estado: estado,
        tecnicaMaldita: tecnicaMaldita || null,
        foto: fotoNombre,
        expansionDominio: expansionDominio
    };

    if (id) {
        console.log("Actualizando ficha con ID:", id);
        actualizarFicha(id, fichaData);
    } else {
        console.log("Creando nueva ficha...");
        crearFicha(fichaData);
    }
}


async function crearFicha(fichaData) {
    try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        if (!token) {
            confirmarToken();
        } else {
            const response = await fetch('http://localhost:3000/FichasPersonajes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'id': userId
                },
                body: JSON.stringify(fichaData)
            });

            if (!response.ok) {
                if (response.status === 401) {
                    alert('No estás autorizado para crear esta ficha');
                }
                throw new Error('Error al crear ficha');
            }

            const data = await response.json();
            console.log("Ficha creada:", data);

            if (data._id) {
                alert('Ficha creada exitosamente');
                cargarPagina(actualPage);
                cerrarFormulario();
            } else {
                alert('Error al crear ficha');
            }
        }
    } catch (error) {
        console.error('Error al crear ficha:', error);
    }
}

async function actualizarFicha(id, fichaData) {
    try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        if (!token) {
            confirmarToken();
        } else {
            const response = await fetch(`http://localhost:3000/FichasPersonajes/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'id': userId
                },
                body: JSON.stringify(fichaData)
            });

            if (!response.ok) {
                if (response.status === 401) {
                    alert('No estás autorizado para actualizar esta ficha');
                }
                throw new Error('Error al crear ficha');
            }

            const data = await response.json();
            console.log("Ficha actualizada:", data);

            if (data._id) {
                alert('Ficha actualizada exitosamente');
                cargarPagina(actualPage);
                cerrarFormulario();
            } else {
                alert('Error al actualizar ficha');
            }
        }
    } catch (error) {
        console.error('Error al actualizar ficha:', error);
    }
}

function obtenerIDTecnica() {
    const nombreTecnica = document.getElementById('MalitoSpinnerFunciona').value;
    console.log('Técnica seleccionada:', nombreTecnica);

    if (!nombreTecnica) {
        console.error('No se seleccionó ninguna técnica.');
        return;
    }

    const url = `http://localhost:3000/buscarTecnicaPorNombre?nombre=${encodeURIComponent(nombreTecnica)}`;
    console.log('URL a la que se hace la solicitud:', url);

    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log('Respuesta de la API:', data);
            if (data && data.data && data.data.length > 0) {
                const tecnicaID = data.data[0]._id;
                console.log('ID de la técnica maldita:', tecnicaID);
                document.getElementById('tecnicaMalditaID').value = tecnicaID;
            } else {
                console.error('No se encontró la técnica maldita en la respuesta.');
            }
        })
        .catch(error => {
            console.error('Error al obtener la técnica maldita:', error);
        });
}


function confirmarEliminacion(id) {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    if (!token) {
        confirmarToken();
    } else {
        if (confirm('Estas seguro de que deseas eliminar esta ficha?')) {

            fetch(`http://localhost:3000/FichasPersonajes/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'id': userId
                }
            })
                .then(response => {
                    if (!response.ok) {
                        if (response.status === 401) {
                            alert('No estás autorizado para eliminar esta ficha');
                        }
                        throw new Error('Error al eliminar ficha');
                    }
                    return response.json();
                })
                .then(() => cargarPagina(actualPage))
                .catch(err => console.error('Error al eliminar ficha:', err));
        }
    }
}

function confirmarToken() {
    if (confirm('No se ha hecho realizado el inicio de sesion.')) {
        window.location.href = '../pages/login.html';
    }
}

function confirmarUsuario() {
    if (confirm('Usuario no autorizado')) {
        window.location.href = '../pages/login.html';
    }
}

function previewImage(event) {
    const file = event.target.files[0];
    const imageContainer = document.getElementById("image-container");

    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            imageContainer.innerHTML = `<img src="${e.target.result}" style="width: 200px; height: auto;" alt="Vista previa">`;
        };
        reader.readAsDataURL(file);
    } else {
        imageContainer.innerHTML = "";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    cargarPagina(actualPage);
    const form = document.getElementById("formFicha");
    const imageContainer = document.getElementById("image-container");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const formData = new FormData(form);

        const fileInput = document.getElementById("foto");
        if (fileInput.files.length > 0) {
            const fileData = new FormData();
            fileData.append("Avatar", fileInput.files[0]);

            try {
                const response = await fetch("http://localhost:3000/upload", {
                    method: "POST",
                    body: fileData,
                });

                if (!response.ok) {
                    throw new Error("Error al subir el archivo.");
                }

                const data = await response.json();
                console.log("Imagen subida:", data._id);

                document.getElementById("fotoid").value = data._id;
            } catch (error) {
                console.error("Error al subir la imagen:", error);
            }
        } 
    });
});
