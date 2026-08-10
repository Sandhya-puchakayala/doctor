import { useRef, useState, useEffect } from 'react';
import Navbar from './Navbar';
import Logo from './Logo';
import CardCarousel from './CardCarousel';
import './Page2.css';

const DESKTOP_VIDEO = process.env.PUBLIC_URL + '/doc_web_video.mp4';
const MOBILE_VIDEO  = process.env.PUBLIC_URL + '/doc_mobile_video.mp4';

/* public/"my past.png" — the space has to stay percent-encoded in the URL */
const SECOND_IMAGE = process.env.PUBLIC_URL + '/my%20past.png';

/* Matches the 768px breakpoint in Page2.css. A <source media=""> won't work
   here — Chrome ignores it on <video> — so the clip is picked in JS.
   Resolved once on mount: it's a ~2s transition, so re-picking on resize
   would only ever restart it mid-play. */
const pickTransitionVideo = () =>
  window.matchMedia('(max-width: 768px)').matches ? MOBILE_VIDEO : DESKTOP_VIDEO;

/**
 * Page 2 — plays a short (~2s) transition video, then reveals the
 * second-page image as a full-cover background (desktop + mobile).
 */
const Page2 = () => {
  const [fading, setFading]     = useState(false);   // start fading the video out
  const [videoGone, setVideoGone] = useState(false); // unmount video after fade
  const [videoSrc] = useState(pickTransitionVideo);  // desktop vs mobile clip
  const videoRef = useRef(null);
  const doneRef  = useRef(false);

  const finish = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    setFading(true);
    setTimeout(() => setVideoGone(true), 700); // matches CSS fade duration
  };

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    /* Safety net: if the video never ends / fails to load, reveal image anyway */
    const maxWait = setTimeout(finish, 5000);

    vid.play().catch(() => {
      /* autoplay blocked — skip straight to the image */
      clearTimeout(maxWait);
      finish();
    });

    return () => clearTimeout(maxWait);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="page2">
      {/* Base layer: second-page image, always present underneath */}
      <div
        className="page2__bg"
        style={{ backgroundImage: `url(${SECOND_IMAGE})` }}
      />

      {/* Navbar — same as the hero page, fades in with the image */}
      <Navbar visible={videoGone} />

      {/* Logo — same as the hero page, fades in with the image; links home */}
      <div className="page2__left-col">
        <Logo visible={videoGone} to="/" />
      </div>

      {/* 3D card carousel over the image */}
      <CardCarousel visible={videoGone} />

      {/* Transition video on top; fades out to reveal the image */}
      {!videoGone && (
        <video
          ref={videoRef}
          className={`page2__video ${fading ? 'page2__video--fade' : ''}`}
          src={videoSrc}
          muted
          playsInline
          autoPlay
          preload="auto"
          onEnded={finish}
          onError={finish}
        />
      )}
    </div>
  );
};

export default Page2;
