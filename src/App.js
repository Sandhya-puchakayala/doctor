import React, { useState } from 'react';
import './App.css';
import HeroSection from './components/HeroSection';
import IntroVideo from './components/IntroVideo';
import Page2 from './components/Page2';

function App() {
  const [introDone, setIntroDone] = useState(false);
  const [page, setPage] = useState('home'); // 'home' | 'explore'

  return (
    <div className="App">
      {page === 'home' && (
        <>
          {!introDone && <IntroVideo onComplete={() => setIntroDone(true)} />}
          <HeroSection
            canAnimate={introDone}
            onExplore={() => setPage('explore')}
          />
        </>
      )}

      {page === 'explore' && <Page2 />}
    </div>
  );
}

export default App;
