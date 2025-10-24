import React, { useState, useEffect } from "react";
import "./App.css";

const pieces = [
  { src: "/artwork/cat1.jpg", title: "Little Loaf",  medium: "Procreate / Digital Art", date: "01/10/2025", category: "Digital" },
  { src: "/artwork/cat2.jpg", title: "Sunshine Gatito", medium: "Procreate / Digital Art", date: "02/11/2025", category: "Digital" },
  { src: "/artwork/buba1.jpg", title: "Percy",          medium: "Procreate / Digital Art", date: "03/14/2025", category: "Digital" },
  { src: "/artwork/buba2.jpg", title: "Honest Reaction", medium: "Procreate / Digital Art", date: "03/14/2025", category: "Digital" },
  { src: "/artwork/uc.jpg", title: "Unit Circle", medium: "Acrylic on Canvas / Painting", date: "10/23/2025", category: "Painting"}
];

function Slideshow({ slides, interval = 5000, onViewClick }) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIdx(i => (i + 1) % slides.length), interval);
    return () => clearInterval(id);
  }, [slides.length, interval]);

  return (
    <div className="slideshow">
      {slides.map((s, i) => (
        <figure
          key={s.src}
          className={`slideshow__slide ${i === idx ? "is-active" : ""}`}
          style={{ backgroundImage: `url(${s.src})` }}
          aria-label={s.title}
        />
      ))}

      {/* Centered CTA button */}
      <button
        type="button"
        className="slideshow__cta"
        onClick={onViewClick}
      >
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '.5rem' }}>
          View Artworks
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="1.05em" height="1.05em" aria-hidden="true">
            <path fillRule="evenodd" d="M16.72 7.72a.75.75 0 0 1 1.06 0l3.75 3.75a.75.75 0 0 1 0 1.06l-3.75 3.75a.75.75 0 1 1-1.06-1.06l2.47-2.47H3a.75.75 0 0 1 0-1.5h16.19l-2.47-2.47a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
          </svg>
        </span>
      </button>
    </div>
  );
}

export default function App() {
  const [view, setView] = useState("home");
  const [category, setCategory] = useState("All");
  const [selectedIndex, setSelectedIndex] = useState(null);
  const cats = ["All", "Digital", "Painting", "Pencil"];
  const filteredPieces = pieces.filter(p => category === "All" || p.category === category);

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
        {view === "home" && (
          <section className="home fade">
            <Slideshow
              slides={pieces}
              onViewClick={() => setView("gallery")}
            />
          </section>
        )}

        {view === "gallery" && (
          <section className="gallery fade">
            <h2 className="visually-hidden">Gallery</h2>

            <div className="filter-wrap">
              <div className="filter">
                {cats.map(c => (
                  <button
                    key={c}
                    type="button"
                    className={`filter__btn ${category === c ? "is-active" : ""}`}
                    onClick={() => setCategory(c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
              <span className="filter-fade" aria-hidden="true" />
            </div>

            {filteredPieces.length > 0 ? (
              <div className="grid fade">
                {filteredPieces.map((p, idx) => (
                  <article
                    className="card"
                    key={p.title}
                    onClick={() => setSelectedIndex(idx)}
                  >
                    <figure>
                      <img
                        src={p.src}
                        alt={p.title}
                        className="card__img"
                        loading="lazy"
                        onLoad={e => e.currentTarget.classList.add("is-loaded")}
                      />
                    </figure>
                    <header className="card__body">
                      <h3 className="card__title">{p.title}</h3>
                      <p className="card__meta">{p.medium}</p>
                      <time className="card__date">{p.date}</time>
                    </header>
                  </article>
                ))}
              </div>
            ) : null}
          </section>
        )}

        {view === "about" && (
          <section className="about fade">
            <p>
      I’m Emely, an artist born and raised in the U.S. I’ve always loved drawing for as long as I can remember. I used to color, even if it was just scribbles when my toddler brain couldn’t understand shapes yet.
    </p>
    <p>
      Thanks to my mom who is from El Salvador and my dad who is from Guatemala, I get the opportunity to visit these two countries with a beautiful artistic culture every now and then. Each time I travel there, I get exposed to a lot of street murals of all sorts of themes, colors, styles, etc. All the way from the city to our hometown, keeping me inspired.
    </p>
    <p>
      I mostly specialize in realistic portraits because it’s my favorite. Sometimes I take pictures of what to draw—like my dog or some flowers outside when there’s good sunlight. I listen to music while drawing to make the experience more relaxing, and I like to gift them too, especially to my mom; she loves them. My drawings can express a deep meaning or just be for fun depending on how I feel at the time, but I always care about visual quality.
    </p>
    <p>
      Art is something that will always be in me wherever I go. I’ll never be able to see myself not doing art, and if I’m not doing it, I’ll only be planning my next piece.
    </p>
          </section>
        )}
      </main>

      <footer className="site-footer fade">
        <span className="divider" aria-hidden="true"></span>
      <p className="footer-text">
        © 2025 Emely Recinos. <a href="https://bairon.dev" target="_blank" rel="noopener noreferrer">Built with ♡ by Ale.</a>
        </p>
      </footer>

      {selectedIndex !== null && (
        <div className="image-modal">
          <div
            className="image-modal__overlay"
            onClick={() => setSelectedIndex(null)}
          />
          <div className="image-modal__content">
            <button
              className="image-modal__nav image-modal__nav--left"
              onClick={(e) => { e.stopPropagation(); setSelectedIndex((selectedIndex + filteredPieces.length - 1) % filteredPieces.length); }}
              aria-label="Previous artwork"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" width="1em" height="1em" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
              </svg>
            </button>
            <button
              className="image-modal__close"
              onClick={() => setSelectedIndex(null)}
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" width="1em" height="1em" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
            <img key={filteredPieces[selectedIndex]?.src} src={filteredPieces[selectedIndex]?.src} alt="" />
            <button
              className="image-modal__nav image-modal__nav--right"
              onClick={(e) => { e.stopPropagation(); setSelectedIndex((selectedIndex + 1) % filteredPieces.length); }}
              aria-label="Next artwork"
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


