// App.js
import React, { useState, useEffect } from "react";
import "./App.css";

const pieces = [
  { src: "/artwork/cat1.jpg", title: "Little Loaf",  medium: "Procreate / Digital Art", date: "01/10/2025", category: "Digital" },
  { src: "/artwork/cat2.jpg", title: "Sunshine Gatito", medium: "Procreate / Digital Art", date: "02/11/2025", category: "Digital" },
  { src: "/artwork/buba1.jpg", title: "Buba",          medium: "Procreate / Digital Art", date: "03/14/2025", category: "Digital" },
  { src: "/artwork/buba2.jpg", title: "My Honest Reaction", medium: "Procreate / Digital Art", date: "03/14/2025", category: "Digital" },
];

function Slideshow({ slides, interval = 5000 }) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % slides.length), interval);
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
    </div>
  );
}

export default function App() {
  const [view, setView] = useState("home");
  const [category, setCategory] = useState("All");
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
            <Slideshow slides={pieces} />

          </section>
        )}

        {view === "gallery" && (
          <section className="gallery fade">
            <h2 className="visually-hidden">Gallery</h2>

            <div className="filter-wrap">
              <div className="filter">
                {cats.map((c) => (
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

            <div key={category} className="grid fade">
              {pieces
                .filter((p) => category === "All" || p.category === category)
                .map((p) => (
                  <article className="card" key={p.title}>
                    <figure>
                      <img
                        src={p.src}
                        alt={p.title}
                        className="card__img"
                        loading="lazy"
                        onLoad={(e) => e.currentTarget.classList.add("is-loaded")}
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
            <p>Short bio or statement goes here.</p>
          </section>
        )}
      </main>

      <footer className="site-footer fade">
        <span className="divider" aria-hidden="true"></span>
        <p className="footer-text">© 2025 Emely Recinos. All rights reserved.</p>
      </footer>
    </>
  );
}
