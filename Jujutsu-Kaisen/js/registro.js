const form = document.querySelector('form');
const emailInput = document.querySelector('#email');
const passInput = document.querySelector('#pass');
const MensajeContenedor = document.querySelector('#mensaje');

async function obtenerRolId(nombreRol) {
    try {
        const response = await fetch(`http://localhost:3000/NombreporId`);
        if (!response.ok) {
            throw new Error('No se pudo obtener el rol');
        }
        const data = await response.json();
        return data.id;  
    } catch (error) {
        console.error('Error al obtener el rol:', error);
        return null;
    }
}

form.addEventListener('submit', async e => {
    e.preventDefault();
    
    const email = emailInput.value;
    const password = passInput.value;
    const rolUser = await obtenerRolId('user'); 

    if (!rolUser) {
        MensajeContenedor.textContent = "Rol no encontrado";
        return; 
    }

    fetch('http://localhost:3000/signup', {
        method: 'POST',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify({email, password, rolUser})
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('La respuesta no fue correcta');
        }
        return response.json();
    })
    .then(data => {
        localStorage.setItem('token', data.token);
        window.location.href = '../pages/login.html';
    })
    .catch(err => {
        console.log(err);
        MensajeContenedor.textContent = "Credenciales invalidas";
    });
})