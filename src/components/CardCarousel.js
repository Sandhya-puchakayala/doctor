import { useState, useEffect } from 'react';
import ContactForm from './ContactForm';
import './CardCarousel.css';

/* Brain / bulb glyph shown in the top-left of every card */
const CardIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"
       strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M9 3a4 4 0 0 0-3.4 6.1A4 4 0 0 0 7 16.5V19a2 2 0 0 0 2 2h.5" />
    <path d="M15 3a4 4 0 0 1 3.4 6.1A4 4 0 0 1 17 16.5V19a2 2 0 0 1-2 2h-.5" />
    <line x1="12" y1="3" x2="12" y2="21" />
  </svg>
);

const CARDS = [
  { title: ['Mind', 'Care'], accent: 1, image: 'depression.jpeg',
    items: ['Depression', 'Anxiety Disorders', 'OCD', 'Panic Attacks', 'Insomnia'] },
  { title: ['Inner', 'Healing'], accent: 1, image: 'healing.jpeg',
    items: ['Psychosis Disorders', 'Trauma & PTSD', 'Personality Disorders', 'Emotional Behavioral Disorder', 'Brain Fog'] },
  { title: ['Mental', 'Strength'], accent: 1,
    items: ['Bipolar Disorder', 'Mood Disorder', 'Addiction Disorder', 'Eating Disorder', 'Borderline Personality Disorder'] },
  { title: ['Life', 'Balance'], accent: 1,
    items: ['ADHD & Hyperactivity', 'Child Psychology', 'Teens & Adolescence Disorders', 'Psychometric Assessment', 'Procrastination'] },
  { title: ['Emotional', 'Health'], accent: 1,
    items: ['Cognitive Behavioral Therapy (CBT)', 'Behavioral Therapy (BT)', 'Cognitive Therapy (CT)', 'Dialectical Behaviour Therapy (DBT)', 'Compatibility Psychology Test (CPT)'] },
  { title: ['Relationship', 'Health'], accent: 1,
    items: ['Relationship Therapy & Breakups', 'Couple Therapy & Intimacy Counselling', 'Sexual Issues', 'LGBTQIA+', 'Hypersexuality Disorder'] },
  { title: ['Better', 'You'], accent: 1,
    items: ['Grief & Loss', 'Geriatric Therapy', 'Psychodynamic Therapy', 'Mindfulness Therapy', 'Existential Therapy'] },
  { title: ['Life', 'Support'], accent: 1,
    items: ['Pre- & Post-Marital Therapy', 'Prepartum Depression', 'Postpartum Depression', 'Fear-Free Therapy & Phobias', 'Compassion Focused Therapy (CFT)'] },
  { title: ['Calm', 'Mind'], accent: 1, image: 'claim mind.jpeg',
    items: ['Stress Management Therapy', 'Anger Management Therapy', 'Parent–Child Interaction Therapy', 'Solution Focused Brief Therapy', 'Group Therapy'] },
  { title: ['Career', 'Mind'], accent: 1,
    items: ['Career Counselling & Learning Issues', 'Time-Management Therapy', 'Decision-Making Therapy', 'Goal Setting & Achievement', 'Corporate Psychology Services'] },
];

/* Diseases whose artwork in public/ is NOT named after the item (see
   diseaseImage below). The Emotional Health exports dropped the "(CBT)"-style
   suffix and carry a few spelling slips — THERAPAY / CONGNITIVE / CAMPATIBILITY
   — so they are mapped by hand instead of renaming the files on disk. Verified
   against the poster artwork, so CBT and CT are not transposed. */
const IMAGE_OVERRIDES = {
  'Cognitive Behavioral Therapy (CBT)':  'COGNITIVE BEHAVIORAL THERAPAY.png',
  'Behavioral Therapy (BT)':             'BEHAVIORAL THERAPY.png',
  'Cognitive Therapy (CT)':              'CONGNITIVE THERAPY.png',
  'Dialectical Behaviour Therapy (DBT)': 'DIALECTICAL BEHAVIOUR THERAPY.png',
  'Compatibility Psychology Test (CPT)': 'CAMPATIBILITY PSYCHOLOGY TEST.png',
  /* "INTEMACY" is a typo in the exported filename, not in the card label */
  'Couple Therapy & Intimacy Counselling': 'COUPLE THERAPY & INTEMACY COUNSELLING.png',
  /* filename spaces the en-dash and drops "INTERACTION"; both dashes are U+2013 */
  'Parent–Child Interaction Therapy': 'PARENT – CHILD THERAPY.png',
  /* "GREF" is a typo in the filename, which also spells out "AND" for "&" */
  'Grief & Loss': 'GREF AND LOSS.png',
  /* "MARRITAL" is a typo in the filename, which also spaces the dash differently */
  'Pre- & Post-Marital Therapy': 'PRE-&POST MARRITAL THERAPY.png',
  /* Despite the "PRE & POST" filename this poster reads "PRENATAL DEPRESSION",
     so it is mapped to the prepartum item only. Postpartum Depression has no
     artwork of its own yet and deliberately stays unmapped rather than showing
     a prenatal poster under the wrong heading. */
  'Prepartum Depression': 'PRE & POST PARTUM DEPRESSION.png',
  'Fear-Free Therapy & Phobias': 'FEAR FREE THERAPY & PHOBIAS.png',
  /* lower-case on disk — kept verbatim because Vercel serves case-sensitively */
  'Compassion Focused Therapy (CFT)': 'Compassion focused therapy.png',

  /* Career Mind: two filenames describe the wrong poster, so these are mapped
     from the artwork rather than the name. "CORPORATE.png" is the career/
     learning poster (block letters spelling CAREER) and "GOAL SETTING.png" is
     the time poster (hourglass, "you need more clarity") — the real goal-setting
     art is the "(2)" file. Do not re-derive these from the filenames. */
  'Career Counselling & Learning Issues': 'CORPORATE.png',
  'Time-Management Therapy':              'GOAL SETTING.png',
  'Decision-Making Therapy':              'DECISION - MAKING.png',
  'Goal Setting & Achievement':           'GOAL SETTING (2).png',
  'Corporate Psychology Services':        'CORPORATE PSYCHOLOGY.png',
};

const N = CARDS.length;

/* Category labels ("Mind Care", "Inner Healing", …) shared with the contact form */
export const CATEGORIES = CARDS.map((c) => c.title.join(' '));

const CardCarousel = ({ visible }) => {
  const [active, setActive] = useState(0); // start on Slide 1 – Mind Care
  const [vw, setVw] = useState(typeof window !== 'undefined' ? window.innerWidth : 1280);
  const [paused, setPaused] = useState(false);
  const [lightbox, setLightbox] = useState(null); // { image, category } or null
  const [formVisible, setFormVisible] = useState(false); // form fades in after a delay

  useEffect(() => {
    const onResize = () => setVw(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  /* When a card image opens, reveal the contact form over it after ~2s */
  useEffect(() => {
    if (!lightbox) { setFormVisible(false); return; }
    setFormVisible(false);
    const t = setTimeout(() => setFormVisible(true), 2000);
    return () => clearTimeout(t);
  }, [lightbox]);

  /* Auto-advance one card at a time, looping forever (paused while a card is open) */
  useEffect(() => {
    if (!visible || paused || lightbox) return;
    const id = setInterval(() => setActive((a) => (a + 1) % N), 2600);
    return () => clearInterval(id);
  }, [visible, paused, lightbox]);

  /* Close the fullscreen image with Escape */
  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e) => { if (e.key === 'Escape') setLightbox(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox]);

  const imgSrc = (file) => `${process.env.PUBLIC_URL}/${encodeURIComponent(file)}`;

  /* Per-disease artwork lives in public/ under the uppercased item name, e.g.
     "Panic Attacks" -> public/"PANIC ATTACKS.png". Deriving the filename means
     a new disease image only has to be dropped into the folder, never wired up
     here; IMAGE_OVERRIDES covers the files that don't follow that pattern.
     Items with no image yet fall back to the card's own picture. */
  const diseaseImage = (item) =>
    IMAGE_OVERRIDES[item] || `${item.toUpperCase()}.png`;

  const openDisease = (card, item) => {
    const file = diseaseImage(item);
    const category = card.title.join(' ');
    const probe = new Image();
    probe.onload = () => setLightbox({ image: file, category });
    probe.onerror = () => {
      if (card.image) setLightbox({ image: card.image, category });
    };
    probe.src = imgSrc(file);
  };

  const onCardClick = (i) => {
    if (i === active) {
      // clicking the front card opens its image fullscreen (if it has one)
      if (CARDS[i].image)
        setLightbox({ image: CARDS[i].image, category: CARDS[i].title.join(' ') });
    } else {
      setActive(i); // clicking a side card brings it to the front
    }
  };

  const onItemClick = (e, i, card, item) => {
    /* On a side card, let the click bubble so the card just comes to the front */
    if (i !== active) return;
    e.stopPropagation();
    openDisease(card, item);
  };

  /* responsive geometry */
  const spacing = vw < 600 ? 110 : vw < 1024 ? 170 : 235;
  const depth   = vw < 600 ? 90  : vw < 1024 ? 140 : 190;
  const angle   = 34;

  return (
    <div
      className={`cc ${visible ? 'cc--visible' : ''}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="cc__stage">
        {CARDS.map((card, i) => {
          /* shortest circular distance so cards loop endlessly */
          let offset = i - active;
          if (offset >  N / 2) offset -= N;
          if (offset < -N / 2) offset += N;
          const abs = Math.abs(offset);
          /* keep the wrap-around (back) cards hidden so the loop has no visible jump */
          const hidden = abs > 2;
          const style = {
            transform:
              `translate(-50%, -50%)` +
              ` translateX(${offset * spacing}px)` +
              ` translateZ(${-abs * depth}px)` +
              ` rotateY(${offset * -angle}deg)` +
              ` scale(${1 - abs * 0.06})`,
            zIndex: 100 - abs,
            opacity: hidden ? 0 : 1,
            pointerEvents: hidden ? 'none' : 'auto',
            backgroundImage:
              `linear-gradient(180deg,` +
              ` rgba(2, 10, 40, 0.10) 0%,` +
              ` rgba(2, 10, 40, 0.25) 45%,` +
              ` rgba(2, 8, 30, 0.55) 100%),` +
              ` url(${process.env.PUBLIC_URL}/cards_bg.jpeg)`,
          };
          return (
            <div
              key={i}
              className={`cc__card ${offset === 0 ? 'cc__card--active' : ''} ${offset === 0 && card.image ? 'cc__card--clickable' : ''}`}
              style={style}
              onClick={() => onCardClick(i)}
            >
              <div className="cc__card-icon"><CardIcon /></div>

              <h3 className="cc__card-title">
                {card.title.map((line, j) => (
                  <span key={j} className={j === card.accent ? 'cc__accent' : ''}>{line}</span>
                ))}
              </h3>

              <ul className="cc__card-list">
                {card.items.map((it) => (
                  <li key={it}>
                    {/* a real button so it is keyboard- and screen-reader-reachable */}
                    <button
                      type="button"
                      className="cc__card-item"
                      onClick={(e) => onItemClick(e, i, card, it)}
                    >
                      {it}
                    </button>
                  </li>
                ))}
              </ul>

              <span className="cc__card-glow" />
            </div>
          );
        })}
      </div>

      {/* Opened card: full image, then the contact form fades in over it after ~2s */}
      {lightbox && (
        <div className="cc__lightbox">
          {/* the card image fills the whole screen */}
          <div
            className="cc__lightbox-bg"
            style={{ backgroundImage: `url(${imgSrc(lightbox.image)})` }}
          />

          {/* contact form overlaid on the image; appears after the delay */}
          <div
            className={`cc__lightbox-form ${formVisible ? 'cc__lightbox-form--show' : ''}`}
          >
            <ContactForm category={lightbox.category} />
          </div>

          <button
            className="cc__lightbox-close"
            onClick={() => setLightbox(null)}
            aria-label="Close"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
};

export default CardCarousel;
