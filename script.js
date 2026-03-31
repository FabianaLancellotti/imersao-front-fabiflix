alert("Bem-vindo ao Fabiflix! Selecione um perfil para continuar.");

document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // Verifica se existe uma preferência salva no localStorage
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'light') {
        body.classList.add('light-mode');
        themeToggle.checked = true;
    }

    themeToggle.addEventListener('change', (e) => {
        if (e.target.checked) {
            body.classList.add('light-mode');
        } else {
            body.classList.remove('light-mode');
        }

        // Salva a preferência
        const isLightMode = body.classList.contains('light-mode');
        localStorage.setItem('theme', isLightMode ? 'light' : 'dark');
    });

    // Lógica para salvar o perfil selecionado antes de navegar
    const profileLinks = document.querySelectorAll('.profile');
    profileLinks.forEach(link => {
        link.addEventListener('click', () => {
            const name = link.getAttribute('data-name');
            const img = link.getAttribute('data-img');
            localStorage.setItem('perfilAtivoNome', name);
            localStorage.setItem('perfilAtivoImagem', img);
        });
    });
});