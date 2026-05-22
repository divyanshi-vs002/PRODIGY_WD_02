const minutesEl = document.querySelector("#minutes");
const secondsEl = document.querySelector("#seconds");
const centisecondsEl = document.querySelector("#centiseconds");
const startPauseBtn = document.querySelector("#startPauseBtn");
const resetBtn = document.querySelector("#resetBtn");
const lapBtn = document.querySelector("#lapBtn");
const lapsList = document.querySelector("#lapsList");
const lapCount = document.querySelector("#lapCount");
const statusText = document.querySelector("#statusText");
const progressCircle = document.querySelector(".progress");

const circumference = 2 * Math.PI * 138;
let startTime = 0;
let elapsedTime = 0;
let animationFrameId = null;
let lapNumber = 0;
let isRunning = false;

progressCircle.style.strokeDasharray = `${circumference}`;
progressCircle.style.strokeDashoffset = `${circumference}`;

function pad(value) {
  return String(value).padStart(2, "0");
}

function formatTime(milliseconds) {
  const totalCentiseconds = Math.floor(milliseconds / 10);
  const centiseconds = totalCentiseconds % 100;
  const totalSeconds = Math.floor(totalCentiseconds / 100);
  const seconds = totalSeconds % 60;
  const minutes = Math.floor(totalSeconds / 60);

  return {
    minutes: pad(minutes),
    seconds: pad(seconds),
    centiseconds: pad(centiseconds),
    display: `${pad(minutes)}:${pad(seconds)}.${pad(centiseconds)}`
  };
}

function updateTimer(milliseconds) {
  const time = formatTime(milliseconds);
  minutesEl.textContent = time.minutes;
  secondsEl.textContent = time.seconds;
  centisecondsEl.textContent = time.centiseconds;

  const minuteProgress = (milliseconds % 60000) / 60000;
  progressCircle.style.strokeDashoffset = `${circumference * (1 - minuteProgress)}`;
}

function tick(now) {
  elapsedTime = now - startTime;
  updateTimer(elapsedTime);
  animationFrameId = requestAnimationFrame(tick);
}

function startTimer() {
  isRunning = true;
  startTime = performance.now() - elapsedTime;
  animationFrameId = requestAnimationFrame(tick);
  startPauseBtn.textContent = "Pause";
  statusText.textContent = "Timing in progress";
  document.body.classList.add("running");
}

function pauseTimer() {
  isRunning = false;
  cancelAnimationFrame(animationFrameId);
  startPauseBtn.textContent = "Resume";
  statusText.textContent = "Paused";
  document.body.classList.remove("running");
}

function resetTimer() {
  isRunning = false;
  cancelAnimationFrame(animationFrameId);
  elapsedTime = 0;
  lapNumber = 0;
  updateTimer(0);
  startPauseBtn.textContent = "Start";
  statusText.textContent = "Ready when you are";
  lapCount.textContent = "0";
  lapsList.innerHTML = '<li class="empty-state">Start the timer and capture your first lap.</li>';
  document.body.classList.remove("running");
}

function addLap() {
  if (!isRunning && elapsedTime === 0) {
    statusText.textContent = "Start first, then save laps";
    return;
  }

  const emptyState = lapsList.querySelector(".empty-state");
  if (emptyState) {
    emptyState.remove();
  }

  lapNumber += 1;
  const item = document.createElement("li");
  item.innerHTML = `
    <span class="lap-index">${lapNumber}</span>
    <span class="lap-time">${formatTime(elapsedTime).display}</span>
  `;
  lapsList.prepend(item);
  lapCount.textContent = lapNumber;
  statusText.textContent = `Lap ${lapNumber} saved`;
}

startPauseBtn.addEventListener("click", () => {
  if (isRunning) {
    pauseTimer();
  } else {
    startTimer();
  }
});

resetBtn.addEventListener("click", resetTimer);
lapBtn.addEventListener("click", addLap);
updateTimer(0);
