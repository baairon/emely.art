import React, { useState, useEffect } from "react";
import "./App.css";

const pieces = [
  { src: "/artwork/cat1.jpg", title: "Little Loaf",  medium: "Procreate / Digital Art", date: "01/10/2025", category: "Digital" },
  { src: "/artwork/cat2.jpg", title: "Sunshine Gatito", medium: "Procreate / Digital Art", date: "02/11/2025", category: "Digital" },
  { src: "/artwork/buba1.jpg", title: "Percy",          medium: "Procreate / Digital Art", date: "03/14/2025", category: "Digital" },
  { src: "/artwork/buba2.jpg", title: "Honest Reaction", medium: "Procreate / Digital Art", date: "03/14/2025", category: "Digital" },
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
        View Gallery
      </button>
    </div>
  );
}

export default function App() {
  const [view, setView] = useState("home");
  const [category, setCategory] = useState("All");
  const [selectedImage, setSelectedImage] = useState(null);
  const cats = ["All", "Digital", "Pencil", "Colored Pencil"];

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

            <div className="grid fade">
              {pieces
                .filter(p => category === "All" || p.category === category)
                .map(p => (
                  <article
                    className="card"
                    key={p.title}
                    onClick={() => setSelectedImage(p.src)}
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
        © 2025 Emely R. All Rights Reserved.
        </p>
      </footer>

      {selectedImage && (
        <div className="image-modal">
          <div
            className="image-modal__overlay"
            onClick={() => setSelectedImage(null)}
          />
          <div className="image-modal__content">
            <button
              className="image-modal__close"
              onClick={() => setSelectedImage(null)}
              aria-label="Close"
            >×</button>
            <img src={selectedImage} alt="" />
          </div>
        </div>
      )}
    </>
  );
}