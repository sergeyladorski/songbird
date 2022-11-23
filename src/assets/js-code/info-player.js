export const answerAudio = new Audio();
let isPlay = false;

// time
function getMinutes(time) {
  return `${Math.floor(time / 60)}`.padStart(2, '0');
};

function getSeconds(time) {
  return `${Math.floor(time % 60)}`.padStart(2, '0');
};

export async function getAnswerCurrentTime() {
  const progressAnswerBar = getProgressAnswerBar();
  const playerCurrentTime = document.querySelector('.player-answer__current-time');

  const currentTime = answerAudio.currentTime;
  progressAnswerBar && (progressAnswerBar.value = `${Math.floor(currentTime)}`);

  playerCurrentTime && (playerCurrentTime.textContent = `${getMinutes(currentTime)}:${getSeconds(currentTime)}`);
};

export function getAnswerDurationTime() {
  const progressAnswerBar = getProgressAnswerBar();
  const durationTime = document.querySelector('.player-answer__duration');
  const duration = answerAudio.duration;
  progressAnswerBar.max = Math.floor(duration);

  durationTime.textContent = `${getMinutes(duration)}:${getSeconds(duration)}`;
};

// time-bar
function changeAnswerProgressBar() {
  getAnswerCurrentTime();

  setTimeout(changeAnswerProgressBar, 1000);
};

export function updateAnswerProgressBar() {
  const progressAnswerBar = getProgressAnswerBar();

  answerAudio.currentTime = progressAnswerBar.value;
};

// play - pause -end
function playAnswerAudio() {
  const progressAnswerBar = getProgressAnswerBar();
  const playerAnswerBtn = getPlayerAnswerBtn();

  isPlay = true;
  answerAudio.currentTime = progressAnswerBar.value;
  answerAudio.play();
  playerAnswerBtn.classList.add('pause');
  changeAnswerProgressBar();

  answerAudio.addEventListener("ended", handleAnswerEndOfAudio);
};

export function pauseAnswerAudio() {
  const progressAnswerBar = getProgressAnswerBar();
  const playerAnswerBtn = getPlayerAnswerBtn();

  isPlay = false;
  progressAnswerBar.value = answerAudio.currentTime;
  answerAudio.pause();
  if (playerAnswerBtn.classList.contains('pause')) {
    playerAnswerBtn.classList.remove('pause');
  }
};
function handleAnswerEndOfAudio() {
  const progressAnswerBar = getProgressAnswerBar();

  handleAnswerPlayButton();
  progressAnswerBar.value = 0;
  answerAudio.currentTime = 0;
}

export function handleAnswerPlayButton() {
  if (isPlay) {
    pauseAnswerAudio();
  } else {
    playAnswerAudio();
  }
};

export function getProgressAnswerBar() {
  return document.querySelector('.player-answer__time-bar');
};

export function getPlayerAnswerBtn() {
  return document.querySelector('#play-answer');
};
