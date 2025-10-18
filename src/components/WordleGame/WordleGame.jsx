import { useState, useEffect } from 'react';
import Grid from 'components/Grid';
import Keyboard from 'components/Keyboard';
import {
  isWordValid,
  getGuessStatusesWithSolution,
  getStatusesWithSolution,
  findFirstUnusedRevealWithSolution,
  addStatsForCompletedGame,
} from 'lib/words';
import {
  ALERT_DELAY,
  MAX_CHALLENGES,
  MAX_WORD_LENGTH,
} from 'constants/settings';
import styles from './WordleGame.module.scss';

function WordleGame({ solution, gameId, showAlert, stats, setStats, onGameWon }) {
  const [currentGuess, setCurrentGuess] = useState('');
  const [guesses, setGuesses] = useState([]);
  const [isJiggling, setIsJiggling] = useState(false);
  const [isGameWon, setIsGameWon] = useState(false);
  const [isGameLost, setIsGameLost] = useState(false);

  // Check game winning or losing
  useEffect(() => {
    if (guesses.includes(solution.toUpperCase())) {
      setIsGameWon(true);
      setTimeout(() => showAlert(`Game ${gameId}: Well done!`, 'success'), ALERT_DELAY);
      if (onGameWon) {
        setTimeout(() => onGameWon(gameId), ALERT_DELAY + 100);
      }
    } else if (guesses.length === MAX_CHALLENGES) {
      setIsGameLost(true);
      setTimeout(
        () => showAlert(`Game ${gameId}: The word was ${solution}`, 'error', true),
        ALERT_DELAY
      );
    }
    // eslint-disable-next-line
  }, [guesses]);

  const handleKeyDown = letter =>
    currentGuess.length < MAX_WORD_LENGTH &&
    !isGameWon &&
    setCurrentGuess(currentGuess + letter);

  const handleDelete = () =>
    setCurrentGuess(currentGuess.slice(0, currentGuess.length - 1));

  const handleEnter = () => {
    if (isGameWon || isGameLost) return;

    if (currentGuess.length < MAX_WORD_LENGTH) {
      setIsJiggling(true);
      return showAlert('Not enough letters', 'error');
    }

    if (!isWordValid(currentGuess)) {
      setIsJiggling(true);
      return showAlert('Not in word list', 'error');
    }

    // Hard mode check removed for simplicity - can be added back if needed
    // const firstMissingReveal = findFirstUnusedRevealWithSolution(currentGuess, guesses, solution);
    // if (firstMissingReveal) {
    //   setIsJiggling(true);
    //   return showAlert(firstMissingReveal, 'error');
    // }

    if (currentGuess === solution.toUpperCase()) {
      setStats(addStatsForCompletedGame(stats, guesses.length));
    } else if (guesses.length + 1 === MAX_CHALLENGES) {
      setStats(addStatsForCompletedGame(stats, guesses.length + 1));
    }

    setGuesses([...guesses, currentGuess]);
    setCurrentGuess('');
  };

  return (
    <div className={styles.wordleGame}>
      <div className={styles.gameTitle}>Game {gameId}</div>
      <Grid
        currentGuess={currentGuess}
        guesses={guesses}
        isJiggling={isJiggling}
        setIsJiggling={setIsJiggling}
        solution={solution}
      />
      <Keyboard
        onEnter={handleEnter}
        onDelete={handleDelete}
        onKeyDown={handleKeyDown}
        guesses={guesses}
        solution={solution}
        disablePhysicalKeyboard={true}
      />
    </div>
  );
}

export default WordleGame;

