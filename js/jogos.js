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
    question: "Qual a capital do Brasil?",
    answers: [
      { text: "Rio de Janeiro", correct: false },
      { text: "São Paulo", correct: false },
      { text: "Brasília", correct: true },
      { text: "Salvador", correct: false },
    ],
    correctFeedback: "Muito bem! Brasília é a capital do Brasil.",
    wrongFeedback: "Resposta errada! A capital do Brasil é Brasília.",
  },
  {
    question: "Qual a cor do céu em um dia claro?",
    answers: [
      { text: "Vermelho", correct: false },
      { text: "Verde", correct: false },
      { text: "Azul", correct: true },
      { text: "Amarelo", correct: false },
    ],
    correctFeedback: "Certo! O céu é geralmente azul em dias claros.",
    wrongFeedback: "Errado! A cor certa é azul.",
  },
];
shuffleArray(questions); // Embaralha as perguntas

function startQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  nextButton.innerText = "Próxima Pergunta";
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
  resetState();
  questionContainer.innerText = `Você acertou ${score} de ${questions.length} perguntas!`;
  resultsContainer.innerText = `Sua pontuação: ${Math.round(
    (score / questions.length) * 100
  )}%`;
  resultsContainer.style.display = "block";
  retryButton.style.display = "block"; // Exibe o botão de refazer quiz
} // Exibe os resultados

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
}); // Finaliza o quiz

retryButton.addEventListener("click", restartQuiz);

startQuiz(); // Inicia o quiz