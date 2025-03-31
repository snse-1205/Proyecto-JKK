const form = document.querySelector('form');
const emailInput = document.querySelector('#email');
const passInput = document.querySelector('#pass');
const MensajeContenedor = document.querySelector('#mensaje');
const cancelarSesionBtn = document.querySelector('#cancelarSesion');

form.addEventListener('submit', e => {
    e.preventDefault();
    const email = emailInput.value;
    const password = passInput.value;
    console.log(email)
    console.log(password)

    fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, password })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('La respuesta no fue correcta');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            localStorage.setItem('token', data.token);
            localStorage.setItem('userId', data.user._id);
            localStorage.setItem('rolUser', data.user.rolUser[0]);
            window.location.href = '../pages/index.html';
        })
        .catch(error => {
            console.error('Error en el inicio de sesión:', error);
            alert('Error al iniciar sesión. Verifique sus credenciales.');
        });

})

cancelarSesionBtn.addEventListener('click', () => {
    localStorage.clear();
    window.location.href = '../pages/index.html'; 
});
