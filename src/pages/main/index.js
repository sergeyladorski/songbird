import '../../assets/styles/main.scss';
import { constants } from '../../assets/utils/constants';
import { switchLang, translateNav } from '../../assets/utils/switch-lang';
const introInfo = document.querySelector('.intro__info');
const introLink = document.querySelector('.intro__link');

function showIntro() {
  const lang = localStorage.getItem('lang') || 'en';

  introInfo.textContent = constants.introInfo[lang];
  introLink.textContent = constants.introLink[lang];
};

const langButton = document.querySelector('.language-button');

function translateMainPage() {
  langButton.textContent = (localStorage.getItem('lang') || 'en').toUpperCase();
  translateNav();
  showIntro();
};

langButton.addEventListener('click', () => {
  switchLang();
  translateMainPage()
});

translateMainPage();
