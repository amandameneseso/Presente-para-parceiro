// Selecionando elementos do DOM
const dias = document.getElementById('dias');
const horas = document.getElementById('horas');
const minutos = document.getElementById('minutos');
const segundos = document.getElementById('segundos');

// Data de início
const inicio = new Date('2024-07-04T17:00:00'); // Data de inicio

// Função para atualizar o temporizador
function updateTimer() {
    const now = new Date();
    const diff = now - inicio; // Diferença em milissegundos

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const m = Math.floor((diff / (1000 * 60)) % 60);
    const s = Math.floor((diff / (1000)) % 60);

    dias.textContent = d;
    horas.textContent = h;
    minutos.textContent = m;
    segundos.textContent = s;
}

updateTimer();
setInterval(updateTimer, 1000); // Atualiza a cada segundo