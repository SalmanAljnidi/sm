
const questions = [];
for (let i = 1; i <= 10; i++) {
  for (let j = 1; j <= 10; j++) {
    questions.push({ q: `${i} × ${j}`, answer: i * j });
  }
}
let used = [], score = 0, timer, seconds = 15;

const questionEl = document.getElementById('question');
const choicesEl = document.getElementById('choices');
const timerEl = document.getElementById('timer');
const scoreEl = document.getElementById('correctCount');
const startBtn = document.getElementById('startBtn');
const quizContainer = document.getElementById('quizContainer');
const resultEl = document.getElementById('result');
const restartBtn = document.getElementById('restartBtn');

const correctSound = document.getElementById('correctSound');
const wrongSound = document.getElementById('wrongSound');
const timeoutSound = document.getElementById('timeoutSound');

function arabicNumber(num) {
  return num.toString().replace(/[0-9]/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
}

function startGame() {
  startBtn.classList.add('hidden');
  quizContainer.classList.remove('hidden');
  score = 0;
  used = [];
  scoreEl.textContent = arabicNumber(score);
  // تهيئة تشغيل الصوت — تشغيل ثم إيقاف سريع لتفادي التأخير لاحقًا
correctSound.play().then(() => correctSound.pause()).catch(() => {});
wrongSound.play().then(() => wrongSound.pause()).catch(() => {});
timeoutSound.play().then(() => timeoutSound.pause()).catch(() => {});
  nextQuestion();
}

function nextQuestion() {
  if (used.length === questions.length) return endGame();
  let index;
  do {
    index = Math.floor(Math.random() * questions.length);
  } while (used.includes(index));
  used.push(index);
  const q = questions[index];
  questionEl.textContent = arabicNumber(q.q.replace(/×/g, "×"));
  choicesEl.innerHTML = '';
  let correct = q.answer;
  let answers = [correct];
  while (answers.length < 4) {
    let rand = Math.floor(Math.random() * 100) + 1;
    if (!answers.includes(rand)) answers.push(rand);
  }
  answers.sort(() => Math.random() - 0.5);
  answers.forEach(ans => {
  const btn = document.createElement('button');
  btn.textContent = arabicNumber(ans);
  btn.onclick = () => {
    if (ans === correct) {
      correctSound.currentTime = 0;
      correctSound.play();
    } else {
      wrongSound.currentTime = 0;
      wrongSound.play();
    }
    checkAnswer(ans === correct);
  };
  choicesEl.appendChild(btn);
});
  seconds = 15;
  timerEl.textContent = arabicNumber(seconds);
  clearInterval(timer);
  timer = setInterval(() => {
    seconds--;
    timerEl.textContent = arabicNumber(seconds);
    if (seconds === 0) {
      clearInterval(timer);
      timeoutSound.play();
      checkAnswer(false);
    }
  }, 1000);
}

function checkAnswer(correct) {
  clearInterval(timer);
  if (correct) {
    score++;
    scoreEl.textContent = arabicNumber(score);
    setTimeout(nextQuestion, 1000);
  } else {
    endGame();
  }
}

function endGame() {
  quizContainer.classList.add('hidden');
  resultEl.classList.remove('hidden');
  restartBtn.classList.remove('hidden');
  resultEl.textContent = `أحسنت! وصلت إلى ${arabicNumber(score)} إجابة صحيحة.`;
}

startBtn.onclick = startGame;
restartBtn.onclick = () => location.reload();
