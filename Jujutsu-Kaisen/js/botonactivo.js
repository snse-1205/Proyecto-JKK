window.onload = function() {
    const token = localStorage.getItem('token');
    const imgElement = document.getElementById('login-status-img');
    if (!token) {
        imgElement.src = '../img/circulodesactivo.png'; 
    } else {
        imgElement.src = '../img/circuloactivo.png';
    }
}
