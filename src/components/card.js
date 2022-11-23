export class Card {
  constructor(id, card, song, template, selector) {
    this.id = id;
    this.card = card;
    this.template = template;
    this.selector = selector;
    this.name = card.name;
    this.latinName = card.species;
    this.image = card.image;
    this.audio = card.audio;
    this.desc = card.description;

    this._isPlay = false;
    this.currentTime = 0;
  }

  _getTemplate() {
    const element = document
      .querySelector(`.${this.template}`)
      .content
      .querySelector(`.${this.selector}`)
      .cloneNode(true);

    return element;
  };

  generateCard() {
    this._element = this._getTemplate();
    this._element.setAttribute('id', `card${this.id}`)

    this.birdImage = this._element.querySelector('.bird-card__image');
    this.birdName = this._element.querySelector('.bird-card__name');
    this.birdLatinName = this._element.querySelector('.bird-card__latin-name');
    this.birdDesc = this._element.querySelector('.bird-card__desc');
    this.cardAudio = this._element.querySelector('.player-card__audio');
    this.playerCardBtn = this._element.querySelector('#play-card');
    this.progressCardBar = this._element.querySelector('.player-card__time-bar');
    this.playerCurrentTime = this._element.querySelector('.player-card__current-time');
    this.durationTime = this._element.querySelector('.player-card__duration');

    this.birdName.textContent = this.name;
    this.birdLatinName.textContent = this.latinName;
    this.birdImage.src = this.image;
    this.birdImage.setAttribute('alt', this.name);
    this.cardAudio.src = this.audio;
    this.birdDesc.textContent = this.desc;

    this._setEventListeners();

    return this._element
  }

  // time
  _getMinutes(time) {
    return `${Math.floor(time / 60)}`.padStart(2, '0');
  };

  _getSeconds(time) {
    return `${Math.floor(time % 60)}`.padStart(2, '0');
  };

  _getCardDurationTime() {
    const duration = this.cardAudio.duration;
    this.progressCardBar.max = Math.floor(duration);

    this.durationTime.textContent = `${this._getMinutes(duration)}:${this._getSeconds(duration)}`;
  };

  _getCardCurrentTime() {
    this.currentTime = this.cardAudio.currentTime;

    this.progressCardBar && (this.progressCardBar.value = `${Math.floor(this.currentTime)}`);

    this.playerCurrentTime && (this.playerCurrentTime.textContent = `${this._getMinutes(this.currentTime)}:${this._getSeconds(this.currentTime)}`);
  };

  _updateCardProgressBar() {
    this.progressCardBar && (this.cardAudio.currentTime = this.progressCardBar.value);
  };

  // time-bar
  _changeCardProgressBar() {
    this._getCardCurrentTime();

    setTimeout(this._changeCardProgressBar, 1000);
  };

  // play - pause -end
  playCardAudio() {
    this.cardAudio.currentTime = this.progressCardBar.value;
    this.cardAudio.play();
    this.playerCardBtn.classList.add('pause');
    this._changeCardProgressBar();

    this.cardAudio.addEventListener("ended", this._handleCardEndOfAudio);
  };

  pauseCardAudio() {
    this.progressCardBar.value = this.cardAudio.currentTime;

    this.cardAudio.pause();
    this._element.querySelector('.player-card__audio').pause()

    if (this.playerCardBtn.classList.contains('pause')) {
      this.playerCardBtn.classList.remove('pause');
    }
  };

  _handleCardEndOfAudio() {
    this.handleCardPlayButton();
    this.progressCardBar.value = 0;
    this.cardAudio.currentTime = 0;
  }

  handleCardPlayButton() {
    if (this._isPlay) {
      this.pauseCardAudio();
    } else {
      this.playCardAudio();
    }

    this._isPlay = !this._isPlay;
  };

  _setEventListeners() {
    this.playerCardBtn.addEventListener('click', () => {
      this.handleCardPlayButton();
      this.cardAudio.play();
    });

    this.progressCardBar.addEventListener('change', this._updateCardProgressBar);
    this.cardAudio.addEventListener('loadedmetadata', () => {

      this._getCardCurrentTime();
      this._getCardDurationTime();
    });
  }
}
