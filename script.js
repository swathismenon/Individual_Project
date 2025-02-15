const questionContainer = document.getElementById("question-container");
const questionElement = document.getElementById("question");
const answersElement = document.getElementById("answers");
const nextBtn = document.getElementById("next-btn");
const progressText = document.getElementById("progress-text");
const progressBar = document.getElementById("progress");
const resultContainer = document.getElementById("result");
const scoreElement = document.getElementById("score");
const restartBtn = document.getElementById("restart-btn");

let currentQuestionIndex = 0;
let score = 0;
let questions = [];

async function fetchQuestions() {
  try {
    const res = await fetch(
      "https://opentdb.com/api.php?amount=10&type=multiple"
    );
    // handle request error
    if (!res.ok) {
      throw new Error("Failed to fetch questions");
    }
    const data = await res.json();
    questions = data.results.map((q) => ({
      question: q.question,
      answers: [...q.incorrect_answers, q.correct_answer].sort(
        () => Math.random() - 0.5
      ),
      correct: q.correct_answer,
    }));
    startQuiz();
  } catch (error) {
    // console.error for debugging
    console.error(`There was an error fetching the questions: ${error}`);
    // avoid alerts for user experience
  }
}

function startQuiz() {
  // this can be consolidated to a single line
  currentQuestionIndex = score = 0;
  resultContainer.classList.add("hidden");
  questionContainer.classList.remove("hidden");
  nextBtn.classList.add("hidden");
  showQuestion();
}

function showQuestion() {
  resetState();
  const currentQuestion = questions[currentQuestionIndex];
  // textContent is better than innerHTML for security reasons
  questionElement.textContent = currentQuestion.question;
  progressText.textContent = `Question ${currentQuestionIndex + 1} of ${
    questions.length
  }`;
  progressBar.style.width = `${
    ((currentQuestionIndex + 1) / questions.length) * 100
  }%`;

  currentQuestion.answers.forEach((answer) => {
    const li = document.createElement("li");
    li.textContent = answer;
    li.addEventListener("click", () =>
      selectAnswer(li, answer === currentQuestion.correct)
    );
    answersElement.appendChild(li);
  });
}

function resetState() {
  nextBtn.classList.add("hidden");
  // textContent is better than innerHTML for security reasons
  answersElement.textContent = "";
}

function selectAnswer(selectedElement, isCorrect) {
  Array.from(answersElement.children).forEach((child) =>
    child.classList.add("disabled")
  );
  selectedElement.classList.add(isCorrect ? "correct" : "incorrect");

  if (isCorrect) score++;
  nextBtn.classList.remove("hidden");
}

nextBtn.addEventListener("click", () => {
  currentQuestionIndex++;
  // ternary operator is more concise
  currentQuestionIndex < questions.length ? showQuestion() : endQuiz();
});

function endQuiz() {
  questionContainer.classList.add("hidden");
  // is the resultContainer supposed to contain anything?
  resultContainer.classList.remove("hidden");
  scoreElement.textContent = `${score} / ${questions.length}`;
}

restartBtn.addEventListener("click", fetchQuestions);

restartBtn.addEventListener("click", () => {
  fetchQuestions();
  // this can be consolidated to a single line
  score = currentQuestionIndex = 0;
});

fetchQuestions();
