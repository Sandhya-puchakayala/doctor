import { useState, useEffect, useRef } from 'react';
import Navbar from './Navbar';
import Logo from './Logo';
import './HeroSection.css';

const VIDEO_URL = process.env.PUBLIC_URL + '/doc_bg_1.mp4';

/**
 * Animation sequence (all delays measured from page mount):
 *   0 ms  – video starts playing (browser auto-play)
 *   800 ms – hero image slides up from below
 *   1 600 ms – logo fades/unblurs in
 *   2 200 ms – navbar slides down from top
 */
const HeroSection = () => {
  const [imgVisible, setImgVisible]     = useState(false);
  const [logoVisible, setLogoVisible]   = useState(false);
  const [navVisible, setNavVisible]     = useState(false);
  const [videoReady, setVideoReady]     = useState(false);

  const videoRef = useRef(null);

  /* Kick off the animation chain once the video can play */
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    const startSequence = () => {
      setVideoReady(true);

      const t1 = setTimeout(() => setImgVisible(true),   800);
      const t2 = setTimeout(() => setLogoVisible(true),  1600);
      const t3 = setTimeout(() => setNavVisible(true),   2200);

      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    };

    /* If already ready (cached) fire immediately; else wait for canplaythrough */
    if (vid.readyState >= 3) {
      return startSequence();
    }

    vid.addEventListener('canplaythrough', startSequence, { once: true });
    return () => vid.removeEventListener('canplaythrough', startSequence);
  }, []);

  return (
    <section className="hero">
      {/* ── Background video ── */}
      <div className={`hero__video-wrap ${videoReady ? 'hero__video-wrap--ready' : ''}`}>
        <video
          ref={videoRef}
          className="hero__video"
          src={VIDEO_URL}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
        {/* dark gradient overlay so text stays readable */}
        <div className="hero__overlay" />
      </div>

      {/* ── Left: logo ── */}
      <Logo visible={logoVisible} />

      {/* ── Top-right: navbar ── */}
      <Navbar visible={navVisible} />

      {/* ── Right: hero image slides up ── */}
      <div className={`hero__image-wrap ${imgVisible ? 'hero__image-wrap--visible' : ''}`}>
        <img
          src="https://res.cloudinary.com/dawgv7mq0/image/upload/v1779905504/doctor_new_image_new_1_nzwivj.png"
          alt="Doctor hero"
          className="hero__image"
        />
        {/* subtle vignette at the bottom of the image so it blends with video */}
        <div className="hero__image-fade" />
      </div>

      {/* ── Scroll cue button below logo ── */}
      <div className={`hero__tagline ${navVisible ? 'hero__tagline--visible' : ''}`}>
        <span className="hero__tagline-icon">
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
            <circle cx="7.5" cy="7.5" r="6.5" stroke="rgba(255,255,255,0.7)" strokeWidth="1"/>
            <path d="M7.5 4.5v6M4.5 8l3 2.5 3-2.5" stroke="rgba(255,255,255,0.7)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
        <span className="hero__tagline-text">Scroll to Explore</span>
        <span className="hero__tagline-arrow">↗</span>
      </div>
    </section>
  );
};

export default HeroSection;
