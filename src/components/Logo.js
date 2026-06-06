import { useRef, useCallback } from 'react';
import './Logo.css';

const Logo = ({ visible, onBounds }) => {
  const imgRef = useRef(null);

  const measureBounds = useCallback(() => {
    const img = imgRef.current;
    if (!img || !onBounds) return;
    try {
      const W = img.naturalWidth;
      const H = img.naturalHeight;
      const canvas = document.createElement('canvas');
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const { data } = ctx.getImageData(0, 0, W, H);

      // Find leftmost non-transparent column
      let left = W;
      for (let x = 0; x < W && left === W; x++) {
        for (let y = 0; y < H; y++) {
          if (data[(y * W + x) * 4 + 3] > 10) { left = x; break; }
        }
      }

      // Find rightmost non-transparent column
      let right = -1;
      for (let x = W - 1; x >= 0 && right === -1; x--) {
        for (let y = 0; y < H; y++) {
          if (data[(y * W + x) * 4 + 3] > 10) { right = x; break; }
        }
      }

      onBounds({
        leftPct:  +(left / W * 100).toFixed(3),
        rightPct: +((W - right - 1) / W * 100).toFixed(3),
      });
    } catch (_) {
      // canvas security error — fall back to full container width
    }
  }, [onBounds]);

  return (
    <div className={`logo ${visible ? 'logo--visible' : ''}`}>
      <img
        ref={imgRef}
        src={process.env.PUBLIC_URL + '/N4Y_logo.png'}
        alt="N4Y – Nonjudgmental 4 You"
        className="logo__img"
        onLoad={measureBounds}
      />
    </div>
  );
};

export default Logo;
