document.addEventListener("DOMContentLoaded", () => {
    const mobileMenu = document.getElementById('mobile-menu');
    const navList = document.querySelector('nav ul');

    if (mobileMenu && navList) {
        mobileMenu.addEventListener('click', () => {
            navList.classList.toggle('active'); 
        });
    }
    
    console.log("Sitio web del Mariachi Michoacán cargado exitosamente.");
});
