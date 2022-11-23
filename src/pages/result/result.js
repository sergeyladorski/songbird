import '../../assets/styles/result.scss';
import { constants } from '../../assets/utils/constants';
import { switchLang, translateNav } from '../../assets/utils/switch-lang';

const maxScore = 30;

const resultInfo = document.querySelector('.result__info');
const resultButton = document.querySelector('.result__link');
const totalScore = Number(localStorage.getItem('totalScore'));
const langButton = document.querySelector('.language-button');

function translateRes() {
  const lang = localStorage.getItem('lang') || 'en';

  if (totalScore === maxScore) {
    resultInfo.textContent = `${constants.endMessage.win[lang]} ${maxScore}`;
    resultButton.textContent = `${constants.resBtn.play[lang]}`;
  } else {
    resultInfo.textContent = `${constants.endMessage.result[lang]} ${totalScore} ${constants.endMessage.outOf[lang]} ${maxScore}`;
    resultButton.textContent = `${constants.resBtn.try[lang]}`;
  };
};

function translateResPage() {
  langButton.textContent = (localStorage.getItem('lang') || 'en').toUpperCase();
  translateNav();
  translateRes();
};

langButton.addEventListener('click', () => {
  switchLang();
  translateResPage();
})

translateResPage();