import { useState, useEffect, useRef } from 'react';
import Navbar from './Navbar';
import Logo from './Logo';
import './HeroSection.css';

const VIDEO_URL =
  'https://res.cloudinary.com/dawgv7mq0/video/upload/v1779905129/doctor_new_bg_x1k3o9.mp4';

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

      {/* ── Optional: bottom tagline / scroll cue ── */}
      <div className={`hero__tagline ${navVisible ? 'hero__tagline--visible' : ''}`}>
        <span>Scroll to explore</span>
        <div className="hero__scroll-line" />
      </div>
    </section>
  );
};

export default HeroSection;
