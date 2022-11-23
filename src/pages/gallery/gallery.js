import '../../assets/styles/gallery.scss';
import { switchLang, translateNav } from '../../assets/utils/switch-lang';
const langButton = document.querySelector('.language-button');
import { birdsDataEn } from '../../assets/utils/birds-data-en';
import { birdsData } from '../../assets/utils/birds-data-ru';
import { Card } from '../../components/card';
const gallery = document.querySelector('.gallery__list');
const cardTemplateSelector = 'bird-card-template';
const cardSelector = 'bird-card';

const birdAudio = new Audio()


const createCard = (id, data) => {
  const card = new Card(id, data, birdAudio, cardTemplateSelector, cardSelector);

  return card;
};


const renderCards = () => {
  gallery.innerHTML = '';

  const lang = localStorage.getItem('lang');
  const data = lang === 'en' ? birdsDataEn : birdsData;
  for (let i = 0; i < data.length; i++) {

    for (let j = 0; j < data[i].length; j++) {

      const id = `${i}${j}`
      const card = createCard(id, data[i][j])
      const newCard = card.generateCard();
      gallery.append(newCard);
    }
  }
};

function translateGalleryPage() {
  langButton.textContent = (localStorage.getItem('lang') || 'en').toUpperCase();
  translateNav();
  renderCards();
};

langButton.addEventListener('click', () => {
  switchLang();
  translateGalleryPage()
});

translateGalleryPage();
renderCards();
