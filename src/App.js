import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import './App.css';
import HeroSection from './components/HeroSection';
import IntroVideo from './components/IntroVideo';
import Page2 from './components/Page2';

/* The intro clip is a one-time reveal per visit — it should not replay
   every time the user navigates back to "/" from the explore page. */
const INTRO_KEY = 'n4y:introPlayed';

const readIntroPlayed = () => {
  try {
    return sessionStorage.getItem(INTRO_KEY) === '1';
  } catch (_) {
    return false; // storage blocked (private mode) — just play the intro
  }
};

const HomePage = () => {
  const navigate = useNavigate();
  const [introDone, setIntroDone] = useState(readIntroPlayed);

  const completeIntro = () => {
    try {
      sessionStorage.setItem(INTRO_KEY, '1');
    } catch (_) {
      /* ignore — the intro simply plays again next time */
    }
    setIntroDone(true);
  };

  return (
    <>
      {!introDone && <IntroVideo onComplete={completeIntro} />}
      <HeroSection
        canAnimate={introDone}
        onExplore={() => navigate('/explore')}
      />
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/explore" element={<Page2 />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
