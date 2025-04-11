const card = document.querySelector('.card');
      const valentines = document.querySelector('.valentines');

      valentines.addEventListener('click', () => {
        card.classList.toggle('open'); // Alterna a classe "open" da carta

        if (card.classList.contains('open')) {
          valentines.style.animation = 'none'; // Remove a animação quando a carta é aberta
        } else {
          valentines.style.animation = 'up 3s linear infinite'; // Restaura a animação quando a carta é fechada
        }
      });