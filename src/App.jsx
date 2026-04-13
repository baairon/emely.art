import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import "./App.css";

function shuffledDelays(count) {
  const order = Array.from({ length: count }, (_, i) => i);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  const step = 0.12;
  const delays = new Array(count);
  for (let i = 0; i < count; i++) delays[order[i]] = i * step;
  return delays;
}

const artworkFiles = import.meta.glob("./artwork/*.{jpg,jpeg,png,webp}", {
  eager: true,
  import: "default",
});

const pieces = Object.entries(artworkFiles)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([path, src]) => {
    const name = path.split("/").pop().replace(/\.\w+$/, "");
    return { src, alt: `Artwork ${name}` };
  });

function Slideshow({ slides, interval = 5000, onViewClick }) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIdx(i => (i + 1) % slides.length), interval);
    return () => clearInterval(id);
  }, [slides.length, interval]);

  return (
    <div className="slideshow">
      {slides.map((s, i) => (
        <div
          key={s.src}
          className={`slideshow__slide ${i === idx ? "is-active" : ""}`}
          style={{ backgroundImage: `url(${s.src})` }}
        />
      ))}
      <div className="slideshow__overlay" />
      <div className="slideshow__content">
        <h1 className="slideshow__title">Emely Recinos Monjaras</h1>
        <p className="slideshow__sub">Art Portfolio</p>
        <button type="button" className="slideshow__cta" onClick={onViewClick}>
          View Gallery
        </button>
      </div>
    </div>
  );
}

function GalleryView({ pieces, onSelect, visible }) {
  const delays = useMemo(() => shuffledDelays(pieces.length), [pieces.length]);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);

  useEffect(() => {
    if (visible && !hasBeenVisible) setHasBeenVisible(true);
  }, [visible, hasBeenVisible]);

  return (
    <section className="gallery">
      <div className="grid">
        {pieces.map((p, idx) => (
          <motion.div
            className="grid__item"
            key={p.src}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={hasBeenVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.97 }}
            transition={{
              duration: 0.6,
              delay: hasBeenVisible ? delays[idx] : 0,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            onClick={() => onSelect(idx)}
          >
            <img
              src={p.src}
              alt={p.alt}
              loading="lazy"
              onLoad={e => e.currentTarget.classList.add("is-loaded")}
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default function App() {
  const [view, setView] = useState("home");
  const [selectedIndex, setSelectedIndex] = useState(null);

  const NavLink = ({ label }) => (
    <button
      type="button"
      className={`nav__link ${view === label.toLowerCase() ? "is-active" : ""}`}
      onClick={() => setView(label.toLowerCase())}
    >
      {label}
    </button>
  );

  return (
    <>
      <header className="site-header">
        <nav className="nav" aria-label="Primary">
          <NavLink label="Home" />
          <NavLink label="Gallery" />
          <NavLink label="About" />
        </nav>
      </header>

      <main>
        <section className="home" style={{ display: view === "home" ? "" : "none" }}>
          <Slideshow slides={pieces} onViewClick={() => setView("gallery")} />
        </section>

        <div style={{ display: view === "gallery" ? "" : "none" }}>
          <GalleryView pieces={pieces} onSelect={setSelectedIndex} visible={view === "gallery"} />
        </div>

        <section className="about" style={{ display: view === "about" ? "" : "none" }}>
          <p>
            I'm Emely, an artist born and raised in the U.S. I've always loved drawing for as long as I can remember. I used to color, even if it was just scribbles when my toddler brain couldn't understand shapes yet.
          </p>
          <p>
            Thanks to my mom who is from El Salvador and my dad who is from Guatemala, I get the opportunity to visit these two countries with a beautiful artistic culture every now and then. Each time I travel there, I get exposed to a lot of street murals of all sorts of themes, colors, styles, etc. All the way from the city to our hometown, keeping me inspired.
          </p>
          <p>
            I mostly specialize in realistic portraits because it's my favorite. Sometimes I take pictures of what to draw, like my dog or some flowers outside when there's good sunlight. I listen to music while drawing to make the experience more relaxing, and I like to gift them too, especially to my mom; she loves them. My drawings can express a deep meaning or just be for fun depending on how I feel at the time, but I always care about visual quality.
          </p>
          <p>
            Art is something that will always be in me wherever I go. I'll never be able to see myself not doing art, and if I'm not doing it, I'll only be planning my next piece.
          </p>
        </section>
      </main>

      {view !== "home" && (
        <motion.footer
          key={view}
          className="site-footer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: view === "gallery" ? 1.4 : 0 }}
        >
          <p className="footer-text">
            &copy; 2025 Emely Recinos Monjaras. <a href="https://bairon.dev" target="_blank" rel="noopener noreferrer">Built with ♡ by Ale.</a>
          </p>
        </motion.footer>
      )}

      {selectedIndex !== null && (
        <div className="image-modal">
          <div className="image-modal__overlay" onClick={() => setSelectedIndex(null)} />
          <div className="image-modal__content">
            <button
              className="image-modal__nav image-modal__nav--left"
              onClick={(e) => { e.stopPropagation(); setSelectedIndex((selectedIndex + pieces.length - 1) % pieces.length); }}
              aria-label="Previous"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" width="1em" height="1em" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
              </svg>
            </button>
            <button className="image-modal__close" onClick={() => setSelectedIndex(null)} aria-label="Close">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" width="1em" height="1em" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
            <img key={pieces[selectedIndex]?.src} src={pieces[selectedIndex]?.src} alt="" />
            <button
              className="image-modal__nav image-modal__nav--right"
              onClick={(e) => { e.stopPropagation(); setSelectedIndex((selectedIndex + 1) % pieces.length); }}
              aria-label="Next"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" width="1em" height="1em" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
