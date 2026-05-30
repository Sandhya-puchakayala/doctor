import { useRef, useState } from 'react';
import './IntroVideo.css';

const INTRO_URL = process.env.PUBLIC_URL + '/firstvideo1.mp4';

const IntroVideo = ({ onComplete }) => {
  const [fading, setFading] = useState(false);
  const videoRef = useRef(null);

  const finish = () => {
    if (fading) return;
    setFading(true);
    setTimeout(onComplete, 800);
  };

  return (
    <div className={`intro${fading ? ' intro--fade' : ''}`}>
      <video
        ref={videoRef}
        className="intro__video"
        src={INTRO_URL}
        autoPlay
        playsInline
        onEnded={finish}
      />
    </div>
  );
};

export default IntroVideo;
