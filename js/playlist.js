let input = document.getElementById("headshell");
let audio = document.getElementById("player");
let playlist = document.getElementById("playlist");
let audioSource = document.getElementById("audio-source");
let vinyl = document.querySelector(".vinyl");

input.addEventListener("click", function () {
  if (audio.paused) {
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
  vinyl.style.animation = "none";
  headshell.checked = false;
  vinyl.offsetHeight; // Força um reflow
  vinyl.style.animation = null;
}

// Lógica para mostrar/esconder o popup
document.addEventListener("DOMContentLoaded", function () {
  const tooltip = document.getElementById("playTooltip");
  const playButton = document.querySelector(".headshell");

  // Veriável para determinar se deve mostrar o popup (apenas para teste, pode remover depois)
  localStorage.removeItem("playlistVisited");

  // Mostrar o tooltip se for a primeira visita
  if (!localStorage.getItem("playlistVisited")) {
    tooltip.style.display = "block";

    // Esconder o tooltip após 10 segundos
    setTimeout(function () {
      tooltip.style.display = "none";
    }, 10000);
  } else {
    // Garantir que está escondido para visitantes que retornam
    tooltip.style.display = "none";
  }

  // Esconder o tooltip ao clicar no botão de play
  playButton.addEventListener("click", function () {
    tooltip.style.display = "none";
    localStorage.setItem("playlistVisited", "true");
  });

  // Esconder o tooltip após 10 segundos
  setTimeout(function () {
    tooltip.style.display = "none";
  }, 10000);
});
