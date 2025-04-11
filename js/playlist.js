let input = document.getElementById('headshell');
        let audio = document.getElementById('player');
        let playlist = document.getElementById('playlist');
        let audioSource = document.getElementById('audio-source');
        let vinyl = document.querySelector('.vinyl');

        input.addEventListener('click', function() {
            if(audio.paused) {
                audio.play();
                // input.innerHTML = "Pause";
            } else {
                audio.pause();
                // input.innerHTML = "Play";
            }
        });

        function audioVolume(amount) {
        let changevolume = document.getElementsByTagName("audio")[0];
        changevolume.volume = amount;
        }

        // Trocar de faixa ao selecionar uma nova música
        function changeTrack() {
            let selectedTrack = playlist.value; // Obtém o valor da faixa selecionada
            audioSource.src = selectedTrack; // Atualiza o src do áudio
            audio.load(); // Carrega a nova faixa
            // audio.play(); // Reproduz a faixa automaticamente
            
            // Reinicia a animação
            vinyl.style.animation = 'none';
            headshell.checked = false;
            vinyl.offsetHeight; // Força um reflow
            vinyl.style.animation = null;
        }