const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const thumbnails = document.querySelectorAll('.thumbnail');
    const closeBtn = document.querySelector('.close');

    // Ao clicar nas miniaturas, abre a lightbox com a imagem ampliada
    thumbnails.forEach((thumbnail) => {
      thumbnail.addEventListener('click', () => {
        lightbox.classList.add('active');
        lightboxImg.src = thumbnail.src;
      });
    });
    
    // Ao clicar no botão de fechar, fecha a lightbox
    closeBtn.addEventListener('click', () => {
      lightbox.classList.remove('active');
    });

    // Ao clicar fora da imagem na lightbox, também fecha a lightbox
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        lightbox.classList.remove('active');
      }
    });