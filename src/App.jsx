import { useState, useEffect } from 'react';
import Header from 'components/Header';
import WordleGame from 'components/WordleGame';
import Alert from 'components/Alert';
import InfoModal from 'components/InfoModal';
import SettingModal from 'components/SettingModal';
import StatsModal from 'components/StatsModal';
import CompletionModal from 'components/CompletionModal';
import useLocalStorage from 'hooks/useLocalStorage';
import useAlert from 'hooks/useAlert';
import {
  MAX_CHALLENGES,
} from 'constants/settings';
import styles from './App.module.scss';
import 'styles/_transitionStyles.scss';

function App() {
  // Hardcoded solutions for demonstration
  const SOLUTION_1 = 'woman';
  const SOLUTION_2 = 'amigo';
  
  const [theme, setTheme] = useLocalStorage('theme', 'dark');
  const [highContrast, setHighContrast] = useLocalStorage(
    'high-contrast',
    false
  );
  const [hardMode, setHardMode] = useLocalStorage('hard-mode', false);
  const [stats, setStats] = useLocalStorage('gameStats', {
    winDistribution: Array.from(new Array(MAX_CHALLENGES), () => 0),
    gamesFailed: 0,
    currentStreak: 0,
    bestStreak: 0,
    totalGames: 0,
    successRate: 0,
  });
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isCompletionModalOpen, setIsCompletionModalOpen] = useState(false);
  const [isHardMode, setIsHardMode] = useState(hardMode);
  const [isDarkMode, setIsDarkMode] = useState(theme === 'dark');
  const [isHighContrastMode, setIsHighContrastMode] = useState(highContrast);
  const [gamesWon, setGamesWon] = useState({ game1: false, game2: false });
  const { showAlert } = useAlert();

  // Show welcome modal
  useEffect(() => {
    setTimeout(() => setIsInfoModalOpen(true), 1000);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (isDarkMode) document.body.setAttribute('data-theme', 'dark');
    else document.body.removeAttribute('data-theme');

    if (isHighContrastMode)
      document.body.setAttribute('data-mode', 'high-contrast');
    else document.body.removeAttribute('data-mode');
  }, [isDarkMode, isHighContrastMode]);

  const handleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    setTheme(isDarkMode ? 'light' : 'dark');
  };

  const handleHighContrastMode = () => {
    setIsHighContrastMode(!isHighContrastMode);
    setHighContrast(!isHighContrastMode);
  };

  const handleHardMode = () => {
    setIsHardMode(!isHardMode);
    setHardMode(!isHardMode);
  };

  const handleGameWon = (gameId) => {
    setGamesWon(prev => {
      const updated = { ...prev, [`game${gameId}`]: true };
      // Check if both games are now won
      if (updated.game1 && updated.game2) {
        setTimeout(() => setIsCompletionModalOpen(true), 1000);
      }
      return updated;
    });
  };

  const handlePlayAgain = () => {
    setIsCompletionModalOpen(false);
    window.location.reload();
  };

  const handleShare = () => {
    const message = `I completed both Wordle games! 🎉\nGame 1: ${SOLUTION_1.toUpperCase()}\nGame 2: ${SOLUTION_2.toUpperCase()}`;
    navigator.clipboard.writeText(message);
    showAlert('Results copied to clipboard!', 'success');
  };

  return (
    <div className={styles.container}>
      <Header
        setIsInfoModalOpen={setIsInfoModalOpen}
        setIsStatsModalOpen={setIsStatsModalOpen}
        setIsSettingsModalOpen={setIsSettingsModalOpen}
      />
      <Alert />
      <div className={styles.gamesContainer}>
        <WordleGame 
          solution={SOLUTION_1}
          gameId={1}
          showAlert={showAlert}
          stats={stats}
          setStats={setStats}
          onGameWon={handleGameWon}
        />
        <div className={styles.divider}></div>
        <WordleGame 
          solution={SOLUTION_2}
          gameId={2}
          showAlert={showAlert}
          stats={stats}
          setStats={setStats}
          onGameWon={handleGameWon}
        />
      </div>
      <InfoModal
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
      />
      <SettingModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        isHardMode={isHardMode}
        isDarkMode={isDarkMode}
        isHighContrastMode={isHighContrastMode}
        setIsHardMode={handleHardMode}
        setIsDarkMode={handleDarkMode}
        setIsHighContrastMode={handleHighContrastMode}
      />
      <StatsModal
        isOpen={isStatsModalOpen}
        onClose={() => setIsStatsModalOpen(false)}
        gameStats={stats}
        numberOfGuessesMade={0}
        isGameWon={false}
        isGameLost={false}
        isHardMode={isHardMode}
        guesses={[]}
        showAlert={showAlert}
      />
      <CompletionModal
        isOpen={isCompletionModalOpen}
        onClose={() => setIsCompletionModalOpen(false)}
        onPlayAgain={handlePlayAgain}
        onShare={handleShare}
      />
    </div>
  );
}

export default App;
