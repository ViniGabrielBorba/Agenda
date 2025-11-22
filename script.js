document.addEventListener('DOMContentLoaded', function() {
    const btnClick = document.getElementById('btnClick');
    const messageContainer = document.getElementById('messageContainer');
    
    btnClick.addEventListener('click', function() {
        // Esconde o botão
        btnClick.style.display = 'none';
        
        // Mostra a mensagem e os elementos
        messageContainer.classList.remove('hidden');
        
        // Adiciona animação extra ao girasol
        const sunflower = document.querySelector('.sunflower');
        sunflower.style.animation = 'fadeInScale 1.5s ease-out, sway 3s ease-in-out infinite';
    });
});

