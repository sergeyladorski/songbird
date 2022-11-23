import { audio, generateRandom, getBirdData, getCurrentTime, getDurationTime, handlePlayButton, highlightActiveQuestion, pauseAudio, playerQuestionBtn, progressBar, questionBirdId, quizBar, updateProgressBar } from "../../assets/js-code/player";
import { birdsData } from "../../assets/utils/birds-data-ru";
import { birdsDataEn } from "../../assets/utils/birds-data-en";
import { audioData } from "../../assets/utils/audio-data";
import { resetQuestionBird } from "../../assets/js-code/question-bird";
import { answerAudio, getAnswerCurrentTime, getAnswerDurationTime, getProgressAnswerBar, handleAnswerPlayButton, pauseAnswerAudio, updateAnswerProgressBar } from "../../assets/js-code/info-player";
import { constants } from "../../assets/utils/constants";
import { quizBarData } from "../../assets/utils/quiz-bar-data";
import { switchLang, translateNav } from "../../assets/utils/switch-lang";


export let question = 0;
export let totalScore = 0;
let isAnswered = false;
let attempts = [];
let lang = 'en';
const quizScore = document.querySelector('.quiz__score');
const infoBox = document.querySelector('.answer__info');
const nextButton = document.querySelector('.next-button');

const answerList = document.querySelector('.answer__list');
const answerTemplate = 'answer-template';
const birdInfoTemplate = 'bird-info-template';
const answerSelector = 'answer__list-item';
const answerInfoSelector = 'answer__bird-info';
let answerButtonList;
const langButton = document.querySelector('.language-button');

function translatequizBar() {
  const lang = localStorage.getItem('lang') || 'en';

  quizBar.forEach(item => {
    item.textContent = quizBarData[Array.from(quizBar).indexOf(item)][lang];
  })

  translateNextButton();

  quizScore.textContent = `${constants.quizScore[lang]}: ${0 || totalScore}`;
};

function translateNextButton() {
  const lang = localStorage.getItem('lang') || 'en';

  if (question < 5) {
    nextButton.textContent = constants.nextButton.next[lang];
  } else {
    nextButton.textContent = constants.nextButton.end[lang];
  }
};
function translateInfoDefault() {
  const lang = localStorage.getItem('lang') || 'en';

  let firstChild = infoBox.firstChild;

  if (firstChild.nodeName === '#text') {
    infoBox.textContent = constants.infoDefault[lang];
  } else {
    showBirdInfo();
  }
};

function handleLangButtonClick() {
  switchLang();
  translatequizBar();
  translateNav();
  isAnswered && translateQuestion();
  showAnswerList();
  translateInfoDefault();
  langButton.textContent = (localStorage.getItem('lang') || 'en').toUpperCase();
};

export function getTemplate(template, selector) {
  const testimonialElement = document
    .querySelector(`.${template}`)
    .content
    .querySelector(`.${selector}`)
    .cloneNode(true);

  return testimonialElement;
};

function showAnswerList() {
  answerList.innerHTML = '';
  const lang = localStorage.getItem('lang') || 'en';

  let birdsList = lang === 'en' ? birdsDataEn[question] : birdsData[question];
  birdsList.forEach(item => {
    const element = getTemplate(answerTemplate, answerSelector);

    const answerButton = element.querySelector('.answer__button');
    answerButton.textContent = item.name;

    answerList.append(element);
  })

  answerButtonList = document.querySelectorAll('.answer__button');

  answerButtonList.forEach(item => {
    item.addEventListener('click', handleAnswerClick);
  })
};

function enableNextButton() {
  nextButton.classList.add('next-button_active');
  nextButton.removeAttribute('disabled');
};

function disableNextButton() {
  if (nextButton.classList.contains('next-button_active')) {
    nextButton.classList.remove('next-button_active');
  }
  nextButton.setAttribute('disabled', 'disbled');
};

async function handleCorrectAnswer(btn) {
  const lang = localStorage.getItem('lang') || 'en';
  const data = lang === 'en' ? birdsDataEn : birdsData;
  isAnswered = true;
  const jingle = new Audio();

  stopAllAudio();
  jingle.src = await audioData.correctAnswerSound;
  await jingle.play();

  btn.classList.add('answer__button_type_correct');

  totalScore += 6 - attempts.length;
  quizScore.textContent = `Score: ${totalScore}`;

  const btnId = Array.from(answerButtonList).indexOf(btn);
  localStorage.setItem('btnCorrectId', btnId);

  const questionBirdImage = document.querySelector('.question__bird-image');
  const questionBirdName = document.querySelector('.question__bird-name');
  questionBirdImage.src = birdsDataEn[question][btnId].image;
  questionBirdName.textContent = data[question][btnId].name;

  enableNextButton();
};

async function handleWrongAnswer(btn) {
  if (!btn.classList.contains('answer__button_type_wrong')) {
    const jingle = new Audio(btn.id);

    jingle.src = await audioData.wrongAnswerSound;
    await jingle.play();
    btn.classList.add('answer__button_type_wrong');
  }
};

function resetBirdInfo() {
  infoBox.innerHTML = '';
  infoBox.textContent = constants.infoDefault[lang];
};

function showBirdInfo() {
  const btnId = localStorage.getItem('answerBtnId');
  const lang = localStorage.getItem('lang') || 'en';

  const answer = lang === 'en' ? birdsDataEn[question][btnId] : birdsData[question][btnId]

  answerAudio.src = answer.audio

  const element = getTemplate(birdInfoTemplate, answerInfoSelector);
  const playerAnswerBtn = element.querySelector('#play-answer');
  const progressAnswerBar = element.querySelector('.player-answer__time-bar');;

  const birdImage = element.querySelector('.answer__bird-image');
  birdImage.src = answer.image;
  birdImage.setAttribute('alt', answer.name);

  const birdName = element.querySelector('.answer__bird-name');
  birdName.textContent = answer.name;

  const birdLatinName = element.querySelector('.answer__bird-latin-name');
  birdLatinName.textContent = answer.species;

  const birdDesc = element.querySelector('.answer__bird-desc');
  birdDesc.textContent = answer.description;

  const birdAudio = new Audio();
  birdAudio.src = answer.species;

  infoBox.innerHTML = '';
  infoBox.append(element)

  // answer player
  playerAnswerBtn.addEventListener('click', () => {
    pauseAudio();
    handleAnswerPlayButton();
  });
  progressAnswerBar.addEventListener('change', updateAnswerProgressBar);
  answerAudio.addEventListener('loadedmetadata', () => {

    getAnswerCurrentTime();
    getAnswerDurationTime();
  });
};

function handleAnswerClick(evt) {
  const answerBtn = evt.target;

  answerButtonList = document.querySelectorAll('.answer__button');
  const answerBtnId = Array.from(answerButtonList).indexOf(answerBtn);
  localStorage.setItem('answerBtnId', answerBtnId);

  if (!isAnswered && !attempts.includes(answerBtnId)) {
    attempts.push(answerBtnId);

    if (answerBtnId === questionBirdId - 1) {
      handleCorrectAnswer(answerBtn);
    } else {
      handleWrongAnswer(answerBtn);
    }
  }

  showBirdInfo();
};

function stopAllAudio() {
  pauseAudio();
  if (getProgressAnswerBar()) pauseAnswerAudio();
};

function handleNextBtnClick() {
  stopAllAudio();
  let answerButtonList = document.querySelectorAll('.answer__button');

  answerButtonList.forEach(item => {
    item.removeEventListener('click', handleAnswerClick);
  })

  if (isAnswered && (question < 5)) {
    question = question + 1;
    attempts = [];
    isAnswered = false;

    renderNewLevel()
  }
  else if (isAnswered) {
    localStorage.setItem('totalScore', totalScore);
    window.location.replace('./result.html');
  }
};

function translateQuestion() {
  const lang = localStorage.getItem('lang') || 'en';
  const btnId = localStorage.getItem('btnCorrectId');
  const data = lang === 'en' ? birdsDataEn : birdsData;
  const questionBirdName = document.querySelector('.question__bird-name');
  questionBirdName.textContent = data[question][btnId].name;
}

function renderNewLevel() {
  langButton.textContent = (localStorage.getItem('lang') || 'en').toUpperCase();
  // reset level info
  resetQuestionBird();
  resetBirdInfo();
  showAnswerList();
  disableNextButton();
  // get question
  highlightActiveQuestion();
  getBirdData(generateRandom(0, 6));
  // get all in one language
  translatequizBar();
  translateNav();
  isAnswered && translateQuestion();
  translateInfoDefault();
};

// Event listeners
playerQuestionBtn.addEventListener('click', () => {
  if (getProgressAnswerBar()) {
    pauseAnswerAudio();
  }
  handlePlayButton();
});
progressBar.addEventListener('change', updateProgressBar);
audio.addEventListener('loadedmetadata', () => {

  getCurrentTime();
  getDurationTime();
});
nextButton.addEventListener('click', handleNextBtnClick);
langButton.addEventListener('click', handleLangButtonClick);

renderNewLevel();