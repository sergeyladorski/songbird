import '../../assets/styles/quiz.scss';
import { birdsDataEn } from '../../assets/utils/birds-data-en';
import { question } from '../../pages/quiz/quiz';

let isPlay = false;
export let audio = new Audio();
const playerCurrentTime = document.querySelector('.player__current-time');
const durationTime = document.querySelector('.player__duration');
export const quizBar = document.querySelectorAll('.quiz-bar__item');

export const playerQuestionBtn = document.querySelector('#play-question');
export const progressBar = document.querySelector('.player__time-bar');
// 
export let questionBirdId;
// 
export function getBirdData(bird) {
  audio.src = birdsDataEn[question][bird].audio;
  questionBirdId = birdsDataEn[question][bird].id
};
// 
export function generateRandom(min, max) {
  const num = Math.floor(Math.random() * max) + min;
  console.log(num)
  return num;
};
// 
export function highlightActiveQuestion() {
  quizBar.forEach(item => {
    if (item.classList.contains('quiz-bar__item__active')) {
      item.classList.remove('quiz-bar__item__active');
    } else if (Array.from(quizBar).indexOf(item) === question) {
      item.classList.add('quiz-bar__item__active');
    }
  })
};

// time
function getMinutes(time) {
  return `${Math.floor(time / 60)}`.padStart(2, '0');
};

function getSeconds(time) {
  return `${Math.floor(time % 60)}`.padStart(2, '0');
};

export function getCurrentTime() {
  const currentTime = audio.currentTime;
  progressBar.value = `${Math.floor(currentTime)}`;

  playerCurrentTime.textContent = `${getMinutes(currentTime)}:${getSeconds(currentTime)}`;
};
export function getDurationTime() {
  const duration = audio.duration;
  progressBar.max = Math.floor(duration);

  durationTime.textContent = `${getMinutes(duration)}:${getSeconds(duration)}`;
};

// time-bar
function changeProgressBar() {
  getCurrentTime();

  setTimeout(changeProgressBar, 1000);
};

export function updateProgressBar() {
  audio.currentTime = progressBar.value;
};
// play - pause -end
function playAudio() {
  isPlay = true;
  audio.currentTime = progressBar.value;
  audio.play();
  playerQuestionBtn.classList.add('pause');
  changeProgressBar();

  audio.addEventListener("ended", handleEndOfAudio);
};
export function pauseAudio() {
  isPlay = false;
  progressBar.value = audio.currentTime;
  audio.pause();
  if (playerQuestionBtn.classList.contains('pause')) {
    playerQuestionBtn.classList.remove('pause');
  }
};
function handleEndOfAudio() {
  handlePlayButton();
  progressBar.value = 0;
  audio.currentTime = progressBar.value;
}

export function handlePlayButton() {
  if (isPlay) {
    pauseAudio();
  } else {
    playAudio();
  }
};
