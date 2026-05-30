import { useRef, useState, useEffect } from 'react';
import './IntroVideo.css';

const INTRO_URL = process.env.PUBLIC_URL + '/firstvideo1.mp4';

const IntroVideo = ({ onComplete }) => {
  const [fading, setFading] = useState(false);
  const videoRef = useRef(null);
  const doneRef = useRef(false);

  const finish = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    setFading(true);
    setTimeout(onComplete, 800);
  };

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    /* Safety net: if video never ends (slow network / very long clip), skip after 15s */
    const maxWait = setTimeout(finish, 15000);

    vid.play().catch(() => {
      /* Autoplay blocked — skip intro immediately */
      clearTimeout(maxWait);
      finish();
    });

    return () => clearTimeout(maxWait);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={`intro${fading ? ' intro--fade' : ''}`}>
      <video
        ref={videoRef}
        className="intro__video"
        src={INTRO_URL}
        muted
        playsInline
        onEnded={finish}
        onError={finish}
      />
    </div>
  );
};

export default IntroVideo;
