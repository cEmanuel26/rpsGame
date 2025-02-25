const choices = ['rock', 'paper', 'scissors'];
const choicesArray = [
  '/images/fist.png',
  '/images/handgesture.png',
  '/images/scissors.png',
];

const elements = {
  rock: document.querySelector('.rock'),
  paper: document.querySelector('.paper'),
  scissors: document.querySelector('.scissors'),
  gameChoices: document.querySelectorAll('.playCards'),
  humanScoreDom: document.querySelector('.humanScore'),
  computerScoreDom: document.querySelector('.computerScore'),
  computerHandDom: document.querySelector('.computerRandomHand'),
  separatorDom: document.querySelector('.separator'),
};

let scores = {
  human: 0,
  computer: 0,
};
console.log(elements.gameChoices);

function getComputerChoice() {
  return choices[Math.floor(Math.random() * choices.length)];
}

function getHumanChoice(callback) {
  elements.gameChoices.forEach((card) => {
    card.addEventListener('click', (el) => {
      const target = el.target.closest('.playCards > *');
      if (!target) return;
      const userSelection = choices.find((choice) =>
        el.target.classList.contains(choice)
      );
      callback(userSelection);
    });
  });
}

function animateComputerHand() {
  let index = 0;
  const interval = setInterval(() => {
    elements.computerHandDom.style.backgroundImage = `url(${choicesArray[index]})`;
    index = (index + 1) % choicesArray.length;
  }, 60);

  setTimeout(() => {
    clearInterval(interval);
    elements.computerHandDom.style.backgroundImage = ``;
  }, 2000);
}

function updateScores(winner) {
  if (winner === 'human') {
    scores.human++;
    elements.humanScoreDom.innerHTML = scores.human;
  } else if (winner === 'computer') {
    scores.computer++;
    elements.computerScoreDom.innerHTML = scores.computer;
  }
}

function flashResult(userSelection, computerSelection, winner) {
  const userElement = elements[userSelection];
  const computerElement = elements.computerHandDom;

  if (winner === 'human') {
    userElement.classList.add('flashGreen');
    computerElement.classList.add('flashRed');
  } else if (winner === 'computer') {
    userElement.classList.add('flashRed');
    computerElement.classList.add('flashGreen');
  } else {
    userElement.classList.add('flashGreen');
    computerElement.classList.add('flashGreen');
  }

  setTimeout(() => {
    userElement.classList.remove('flashGreen', 'flashRed');
    computerElement.classList.remove('flashGreen', 'flashRed');
  }, 1500);
}

function determineWinner(userSelection, computerSelection) {
  if (userSelection === computerSelection) return 'draw';
  if (
    (userSelection === 'rock' && computerSelection === 'scissors') ||
    (userSelection === 'paper' && computerSelection === 'rock') ||
    (userSelection === 'scissors' && computerSelection === 'paper')
  ) {
    return 'human';
  }
  return 'computer';
}

function disableChoices() {
  elements.gameChoices.forEach((card) => {
    card.style.pointerEvents = 'none';
  });
}

function enableChoices() {
  elements.gameChoices.forEach((card) => {
    card.style.pointerEvents = 'auto';
  });
}

getHumanChoice((userSelection) => {
  disableChoices();
  hideOtherChoices(userSelection);

  const computerSelection = getComputerChoice();

  animateComputerHand();

  if (computerSelection) {
    elements.computerHandDom.classList.add(`${computerSelection}`, 'card');
    elements.separatorDom.classList.remove('hidden');
  }

  setTimeout(() => {
    elements.computerHandDom.classList.remove(`${computerSelection}`, 'card');
    elements.separatorDom.classList.add('hidden');
    enableChoices();
    showAllChoices(userSelection);
  }, 3500);

  setTimeout(() => {
    const winner = determineWinner(userSelection, computerSelection);
    updateScores(winner);
    flashResult(userSelection, computerSelection, winner);
  }, 2000);
});
function hideOtherChoices(selectedChoice) {
  elements.gameChoices.forEach((card) => {
    const child = card.querySelector(`.${selectedChoice}`);
    const hiddenChildren = Array.from(card.children).filter(
      (child) => !child.classList.contains(selectedChoice)
    );

    if (child) {
      card.dataset.hiddenChildren = JSON.stringify(
        hiddenChildren.map((child) => child.outerHTML)
      );
      hiddenChildren.forEach((child) => card.removeChild(child));
    }
  });
}

function showAllChoices() {
  elements.gameChoices.forEach((card) => {
    const hiddenChildren = JSON.parse(card.dataset.hiddenChildren || '[]');
    hiddenChildren.forEach((childHTML) => {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = childHTML;
      const childElement = tempDiv.firstChild;
      card.appendChild(childElement);
    });
    delete card.dataset.hiddenChildren;
  });
}
