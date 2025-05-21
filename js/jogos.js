// Seleção de elementos do DOM
const finishButton = document.getElementById("finish-button");
const feedbackContainer = document.getElementById("feedback");
const startButton = document.getElementById("start-button");
const quizContainer = document.querySelector(".quiz-container"); // Container principal do quiz

// Evento de clique para o botão de iniciar o quiz
startButton.addEventListener("click", () => {
  startButton.style.display = "none"; // Esconde o botão de iniciar
  quizContainer.style.display = "block"; // Exibe o container do quiz
  startQuiz(); // Inicia o quiz
});

// Mais seleções de elementos do DOM
const questionContainer = document.getElementById("question-container");
const answerButtonsContainer = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-button");
const retryButton = document.getElementById("retry-button");
const resultsContainer = document.getElementById("results-container");

// Variáveis de estado do quiz
let currentQuestionIndex = 0; // Armazena o índice da pergunta atual
let score = 0; // Armazena a pontuação
let questions = []; // Armazena as perguntas

/**
 * Embaralha os elementos de um array.
 * @param {Array} array - O array a ser embaralhado.
 */
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Definição das perguntas do quiz
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

/**
 * Inicia o quiz, resetando a pontuação e o índice da pergunta.
 */
function startQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  nextButton.innerText = "Próxima";
  showQuestion();
}

/**
 * Exibe a pergunta atual na interface do quiz.
 */
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
}

/**
 * Limpa o estado da interface do quiz.
 */
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
}

/**
 * Lida com a seleção de uma resposta pelo usuário.
 * @param {Event} e - O objeto de evento do clique.
 */
function selectAnswer(e) {
  const selectedButton = e.target;
  const correct = selectedButton.dataset.correct;
  setStatusClass(document.body, correct);
  Array.from(answerButtonsContainer.children).forEach((button) => {
    setStatusClass(button, button.dataset.correct);
    button.disabled = true; // Desabilita todos os botões após a seleção
  });
  if (correct) {
    score++;
  }
  if (questions.length > currentQuestionIndex + 1) {
    nextButton.style.display = "block"; // Exibe o botão "Próxima"
  } else {
    finishButton.style.display = "block"; // Exibe o botão "Finalizar quiz"
  }
  const currentQuestion = questions[currentQuestionIndex];
  feedbackContainer.innerText = correct
    ? currentQuestion.correctFeedback
    : currentQuestion.wrongFeedback;
}

/**
 * Adiciona ou remove classes de estilo para indicar correção.
 * @param {HTMLElement} element - O elemento HTML a ser estilizado.
 * @param {boolean} correct - True se a resposta estiver correta, false caso contrário.
 */
function setStatusClass(element, correct) {
  clearStatusClass(element);
  if (correct) {
    element.classList.add("correct");
  } else {
    element.classList.add("wrong");
  }
}

/**
 * Remove as classes de estilo de correção de um elemento.
 * @param {HTMLElement} element - O elemento HTML.
 */
function clearStatusClass(element) {
  element.classList.remove("correct");
  element.classList.remove("wrong");
}

/**
 * Exibe os resultados finais do quiz.
 */
function showResults() {
  resetState(); // Limpa a interface atual da pergunta/respostas
  const scorePercentage = Math.round((score / questions.length) * 100); // Calcula a pontuação percentual
  let resultImageUrl = ""; // Variável para armazenar o URL da imagem

  // Define a imagem com base na pontuação
  if (scorePercentage >= 70) {
    resultImageUrl = "imagens/rabbit.gif";
  } else if (scorePercentage >= 60) {
    resultImageUrl = "imagens/rabbit2.gif";
  } else if (scorePercentage >= 30) {
    resultImageUrl = "imagens/50e74.gif";
  } else {
    resultImageUrl = "imagens/rabbittriste.gif";
  }
  questionContainer.innerHTML = `<p style="text-align: center">Você acertou ${score} de ${questions.length} perguntas!</p>`; // contagem de acertos
  resultsContainer.innerHTML = `
        <p>Sua pontuação: ${scorePercentage}%</p>
        <img src="${resultImageUrl}" style="max-width: 100%; height: auto; margin-top: 20px;">
    `;

  resultsContainer.style.display = "block"; // Exibe o container de resultados
  retryButton.style.display = "block"; // Exibe o botão de refazer quiz

  // Adiciona efeito de confetes se a pontuação for maior ou igual a 50
  if (scorePercentage >= 50 && typeof confetti === "function") {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  }
}

/**
 * Avança para a próxima pergunta ou exibe os resultados se todas as perguntas foram respondidas.
 */
function nextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    showResults();
  }
}

/**
 * Reinicia o quiz.
 */
function restartQuiz() {
  startQuiz(); // Reinicia o quiz
  retryButton.style.display = "none"; // Esconde o botão de refazer
}

// Ouvintes de eventos para os botões de navegação e controle do quiz
nextButton.addEventListener("click", nextQuestion);

finishButton.addEventListener("click", () => {
  showResults();
  finishButton.style.display = "none";
});

retryButton.addEventListener("click", restartQuiz);

// Evento de clique para o link "Quiz" na navegação
document.getElementById("jogo1-link").addEventListener("click", function (e) {
  e.preventDefault(); // Previne o comportamento padrão do link
  document.getElementById("jogo1-container").style.display = "block"; // Exibe o container do jogo
  startButton.style.display = "block"; // Garante que o botão de iniciar esteja visível
  quizContainer.style.display = "none"; // Garante que o quizContainer esteja oculto até o início
  resetState(); // Reseta o estado do quiz para garantir que ele comece limpo
});