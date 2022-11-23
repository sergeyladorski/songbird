import questionBirdDefaultImage from '../images/bird-unknown.jpg';
const questionBirdDefaultName = '***';

export function resetQuestionBird() {
  const questionBirdImage = document.querySelector('.question__bird-image');
  const questionBirdName = document.querySelector('.question__bird-name');

  questionBirdImage.src = questionBirdDefaultImage;
  questionBirdName.textContent = questionBirdDefaultName;
};