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
