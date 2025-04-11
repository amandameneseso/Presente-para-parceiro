const click = document.querySelector('.click');
        const giftBox = document.querySelector('.gift-box');
        const shadow = document.querySelector('.shadow');
        const container = document.querySelector('.container');
        const stars = document.querySelectorAll('.box-star');
        const clickSound = new Audio('musicas/efeito-sonoro-presente.wav');

        click.addEventListener('click', () => {
            if (!click.classList.contains('active')) {
                // Tocar o som ao clicar
                clickSound.currentTime = 0; 
                clickSound.play();
                setTimeout(() => {
                    clickSound.pause();
                }, 1500); // Interrompe o áudio após 1.5 segundo

                // Adicionar classes para animar
                click.classList.add('active');
                giftBox.classList.add('active');
                shadow.classList.add('active');
                container.classList.add('active');
                stars.forEach(star => {
                    star.classList.add('active');
                });

                // Acionar o setTimeout após iniciar as animações
                setTimeout(() => {
                document.body.classList.add('fade-out');
                setTimeout(() => {
                    window.location.href = 'home.html';
                    }, 500); // Tempo correspondente à animação de fade-out
                }, 1500); // Espera a animação do presente terminar
            }
        });