"use strict";

const MAX_ATTEMPTS = 5;
const MIN_NUMBER = 1;
const MAX_NUMBER = 100;

const roundNumber = document.querySelector("#round-number");
const attemptsLeftText = document.querySelector("#attempts-left");
const hintText = document.querySelector("#hint-text");
const guessForm = document.querySelector("#guess-form");
const guessInput = document.querySelector("#guess-input");
const newRoundButton = document.querySelector("#new-round-button");
const gameStatus = document.querySelector("#game-status");

let secretNumber = null;
let attemptsLeft = MAX_ATTEMPTS;
let roundCount = 0;
let roundFinished = false;

function chooseNumber(excludedNumber = null) {
  const availableCount = MAX_NUMBER - MIN_NUMBER + 1 - (excludedNumber === null ? 0 : 1);
  const randomIndex = Math.floor(Math.random() * availableCount);
  const candidate = MIN_NUMBER + randomIndex;
  return excludedNumber !== null && candidate >= excludedNumber
    ? candidate + 1
    : candidate;
}

function updateAttempts() {
  attemptsLeftText.textContent = String(attemptsLeft);
}

function setStatus(message) {
  gameStatus.textContent = message;
}

function startNewRound(shouldFocus = true) {
  secretNumber = chooseNumber(secretNumber);
  attemptsLeft = MAX_ATTEMPTS;
  roundCount += 1;
  roundFinished = false;

  roundNumber.textContent = String(roundCount);
  attemptsLeftText.textContent = String(attemptsLeft);
  hintText.textContent = `Adivinhe um número inteiro entre ${MIN_NUMBER} e ${MAX_NUMBER}.`;
  guessInput.value = "";
  setStatus("Nova rodada iniciada. Digite um número entre 1 e 100.");
  if (shouldFocus) {
    guessInput.focus();
  }
}

function finishRound(message) {
  roundFinished = true;
  setStatus(message);
}

function handleGuess(event) {
  event.preventDefault();

  if (roundFinished) {
    setStatus("Esta rodada terminou. Inicie uma nova rodada para jogar novamente.");
    return;
  }

  const guess = Number(guessInput.value);

  if (guessInput.value.trim() === "") {
    setStatus("Digite um número antes de validar seu palpite.");
    guessInput.focus();
    return;
  }

  if (!Number.isInteger(guess) || guess < MIN_NUMBER || guess > MAX_NUMBER) {
    setStatus(`Digite um número inteiro entre ${MIN_NUMBER} e ${MAX_NUMBER}.`);
    guessInput.focus();
    return;
  }

  if (guess === secretNumber) {
    finishRound(`Número correto: ${secretNumber}. Você venceu a rodada!`);
    return;
  }

  attemptsLeft -= 1;
  updateAttempts();
  guessInput.value = "";

  if (attemptsLeft === 0) {
    finishRound(
      `Fim da rodada. O número era ${secretNumber}. ` +
      "Inicie uma nova rodada para continuar."
    );
    return;
  }

  const direction = guess < secretNumber ? "Tente um número maior." : "Tente um número menor.";
  setStatus(`Ainda não. ${direction} Restam ${attemptsLeft} tentativas.`);
  guessInput.focus();
}

guessForm.addEventListener("submit", handleGuess);
newRoundButton.addEventListener("click", () => startNewRound(true));
startNewRound(false);
