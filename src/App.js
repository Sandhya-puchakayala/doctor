import React, { useState } from 'react';
import './App.css';
import HeroSection from './components/HeroSection';
import IntroVideo from './components/IntroVideo';

function App() {
  const [introDone, setIntroDone] = useState(false);

  return (
    <div className="App">
      {!introDone && <IntroVideo onComplete={() => setIntroDone(true)} />}
      <HeroSection canAnimate={introDone} />
    </div>
  );
}

export default App;
