const finishButton = document.getElementById("finish-button");
const feedbackContainer = document.getElementById("feedback");
const startButton = document.getElementById("start-button");
const quizContainer = document.querySelector(".quiz-container");

startButton.addEventListener("click", () => {
  startButton.style.display = "none";
  quizContainer.style.display = "block";
  startQuiz();
}); // Adiciona um evento de clique ao botão de iniciar, retirando display: none e colocando display: block

const questionContainer = document.getElementById("question-container");
const answerButtonsContainer = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-button");
const retryButton = document.getElementById("retry-button");
const resultsContainer = document.getElementById("results-container");

let currentQuestionIndex = 0; // Armazena o índice da pergunta atual
let score = 0; // Armazena a pontuação
let questions = []; // Armazena as perguntas

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

questions = [
  {
    question: "Onde foi nosso primeiro encontro?",
    answers: [
      { text: "No mercadinho", correct: false },
      { text: "Na lanchonete da esquina", correct: false },
      {
        text: "No cinema vendo aquele filme que ninguém entendeu nada",
        correct: true,
      },
      { text: "Num piquenique romântico no parque", correct: false },
    ],
    correctFeedback:
      "Acertou! Quem diria que um combo de pipoca e nervosismo renderia esse romance?",
    wrongFeedback:
      "Errrooou :( Mas valeu a tentativa, tenta de novo na próxima!",
  },
  {
    question: "Qual é a minha comida favorita?",
    answers: [
      { text: "Sushi", correct: false },
      { text: "Pizza", correct: false },
      { text: "Macarronada de sardinha da sua mãe", correct: true },
      { text: "Batata frita", correct: false },
    ],
    correctFeedback:
      "Quem precisa de um jantar chique quando existe macarrão com sardinha?!",
    wrongFeedback: "Errado! Mas relaxa, a macarronada te perdoa...",
  },
  {
    question: "Qual é o meu filme favorito?",
    answers: [
      { text: "Forrest Gump", correct: false },
      { text: "Shrek", correct: false },
      { text: "Titanic", correct: false },
      { text: "Irmão Urso", correct: true },
    ],
    correctFeedback: "Acertou! E sorte sua que eu não esqueço tudo todo dia.",
    wrongFeedback: "Errado! Mas valeu a tentativa, tenta de novo na próxima!",
  },
  {
    question: "Quando começamos a namorar?",
    answers: [
      { text: "25/11/2023", correct: false },
      { text: "14/06/2022", correct: false },
      { text: "04/07/2024", correct: true },
      { text: "18/09/2024", correct: false },
    ],
    correctFeedback: "Acertou! Esse dia foi incrivelmente especial...",
    wrongFeedback: "Errado. Alguém vai dormir no sofá hoje!",
  },
  {
    question: "Quem é o mais bagunceiro?",
    answers: [
      { text: "Eu (o(a) amorzinho(a) que fez esse site)", correct: false },
      { text: "Você", correct: true },
      { text: "O gato", correct: false },
      { text: "O universo conspira contra nós", correct: false },
    ],
    correctFeedback: "Boa :) Isso já é meio caminho pra arrumar a bagunça.",
    wrongFeedback: "Negar não ajuda... a toalha no sofá te entregou.",
  },
  {
    question: "Quem faz mais drama?",
    answers: [
      { text: "Eu (o(a) amorzinho(a) que fez esse site)", correct: true },
      { text: "Você", correct: false },
      { text: "Os dois", correct: false },
      { text: "O wi-fi quando cai", correct: false },
    ],
    correctFeedback:
      "Acertou! Infelizmente (ou felizmente) o Oscar de melhor drama vai para mim.",
    wrongFeedback:
      "Nããão, que injustiça! O drama é meu superpoder (ou defeito, dependendo do dia).",
  },
  {
    question: "O que você acha que eu mais gosto em você?",
    answers: [
      { text: "Sua personalidade", correct: false },
      { text: "Sua aparência", correct: false },
      { text: "Seu cuidado comigo", correct: false },
      { text: "Todas essas coisas e muito mais...", correct: true },
    ],
    correctFeedback: "Isso mesmo, namolado!",
    wrongFeedback: "Errado! Mas valeu a tentativa, tenta de novo na próxima!",
  },
];
shuffleArray(questions); // Embaralha as perguntas

function startQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  nextButton.innerText = "Próxima";
  showQuestion();
} // Inicia o quiz

function showQuestion() {
  resetState(); // Garante que o estado seja resetado antes de mostrar uma nova pergunta
  const currentQuestion = questions[currentQuestionIndex];
  const questionNumber = currentQuestionIndex + 1;
  questionContainer.innerText = `${questionNumber}. ${currentQuestion.question}`;

  currentQuestion.answers.forEach((answer) => {
    const button = document.createElement("button");
    button.innerText = answer.text;
    button.classList.add("btn");
    if (answer.correct) {
      button.dataset.correct = answer.correct;
    }
    button.addEventListener("click", selectAnswer);
    answerButtonsContainer.appendChild(button);
  });
} // Exibe a pergunta

function resetState() {
  clearStatusClass(document.body);
  nextButton.style.display = "none";
  retryButton.style.display = "none"; // Esconde o botão de refazer quiz
  resultsContainer.style.display = "none";
  while (answerButtonsContainer.firstChild) {
    answerButtonsContainer.removeChild(answerButtonsContainer.firstChild);
  }
  feedbackContainer.innerText = "";
  finishButton.style.display = "none";
} // Limpa o estado

function selectAnswer(e) {
  const selectedButton = e.target;
  const correct = selectedButton.dataset.correct;
  setStatusClass(document.body, correct);
  Array.from(answerButtonsContainer.children).forEach((button) => {
    setStatusClass(button, button.dataset.correct);
    button.disabled = true;
  });
  if (correct) {
    score++;
  }
  if (questions.length > currentQuestionIndex + 1) {
    nextButton.style.display = "block";
  } else {
    finishButton.style.display = "block";
  }
  const currentQuestion = questions[currentQuestionIndex];
  feedbackContainer.innerText = correct
    ? currentQuestion.correctFeedback
    : currentQuestion.wrongFeedback;
} // Seleciona a resposta

function setStatusClass(element, correct) {
  clearStatusClass(element);
  if (correct) {
    element.classList.add("correct");
  } else {
    element.classList.add("wrong");
  }
} // Define o estilo das respostas

function clearStatusClass(element) {
  element.classList.remove("correct");
  element.classList.remove("wrong");
} // Limpa o estilo das respostas

function showResults() {
  resetState(); // Limpa a interface atual da pergunta/respostas
  const scorePercentage = Math.round((score / questions.length) * 100); // Calcula a pontuação percentual
  let resultImageUrl = ""; // Variável para armazenar o URL da imagem

  // Define a imagem com base na pontuação
  if (scorePercentage >= 70) {
    // pontuação maior ou igual a 70
    resultImageUrl = "imagens/rabbit.gif";
  } else if (scorePercentage >= 60) {
    // pontuação entre 60 e 69
    resultImageUrl = "imagens/rabbit2.gif";
  } else if (scorePercentage >= 30) {
    // pontuação entre 30 e 59
    resultImageUrl = "imagens/50e74.gif";
  } else {
    // pontuação menor que 30
    resultImageUrl = "imagens/rabbittriste.gif";
  }
  questionContainer.innerHTML = `<p style="text-align: center">Você acertou ${score} de ${questions.length} perguntas!</p>`; // contagem de acertos
  resultsContainer.innerHTML = `
        <p>Sua pontuação: ${scorePercentage}%</p>
        <img src="${resultImageUrl}" style="max-width: 100%; height: auto; margin-top: 20px;">
    `;

  resultsContainer.style.display = "block"; // Exibe o container de resultados
  retryButton.style.display = "block"; // Exibe o botão de refazer quiz

  if (scorePercentage >=50 && typeof confetti === "function") {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  } // Adiciona efeito de confetes se a pontuação for maior ou igual a 50
}

function nextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    showResults();
  }
} // Passa para a próxima pergunta

function restartQuiz() {
  startQuiz(); // Reinicia o quiz
  retryButton.style.display = "none"; // Esconde o botão de refazer
}

nextButton.addEventListener("click", nextQuestion);

finishButton.addEventListener("click", () => {
  showResults();
  finishButton.style.display = "none";
});
//   confetti({
//     particleCount: 100, // Número de confetes
//     spread: 70, // Espalhamento dos confetes
//     origin: { y: 0.6 }, // Ponto de origem (opcional, ajusta a altura)
//   }); // Adiciona efeito de confetes (canvas-confetti)
// }); // Finaliza o quiz

retryButton.addEventListener("click", restartQuiz);

startQuiz(); // Inicia o quiz

document.getElementById("jogo1-link").addEventListener("click", function (e) {
  e.preventDefault();
  document.getElementById("jogo1-container").style.display = "block";
  document.getElementById("jogo2-container").style.display = "none";
  document.getElementById("jogo3-container").style.display = "none";
}); // Adiciona um evento de clique ao link do jogo 1 que oculta os outros jogos

document.getElementById("jogo2-link").addEventListener("click", function (e) {
  e.preventDefault();
  document.getElementById("jogo1-container").style.display = "none";
  document.getElementById("jogo2-container").style.display = "block";
  document.getElementById("jogo3-container").style.display = "none";
}); // Adiciona um evento de clique ao link do jogo 2 que oculta os outros jogos

document.getElementById("jogo3-link").addEventListener("click", function (e) {
  e.preventDefault();
  document.getElementById("jogo1-container").style.display = "none";
  document.getElementById("jogo2-container").style.display = "none";
  document.getElementById("jogo3-container").style.display = "block";
}); // Adiciona um evento de clique ao link do jogo 3 que oculta os outros jogos

document.getElementById("jogo1-link").addEventListener("click", function () {
  document.getElementById("mensagem-inicial").style.display = "none";
  // document.getElementById('start-button').style.display = 'block';
}); // oculta a mensagem inicial quando o jogo 1 é clicado

document.getElementById("jogo2-link").addEventListener("click", function () {
  document.getElementById("mensagem-inicial").style.display = "none";
}); // oculta a mensagem inicial quando o jogo 2 é clicado

document.getElementById("jogo3-link").addEventListener("click", function () {
  document.getElementById("mensagem-inicial").style.display = "none";
}); // oculta a mensagem inicial quando o jogo 3 é clicado
