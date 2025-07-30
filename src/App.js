import React, { useState } from "react";
import "./App.css";

export default function App() {
  const [view, setView] = useState("home");
  const [category, setCategory] = useState("All");

  const pieces = [
    {
      src: "/artwork/cat1.jpg",
      title: "Little Loaf",
      medium: "Procreate / Digital Art",
      date: "01/10/2025",
      category: "Digital",
    },
    {
      src: "/artwork/cat2.jpg",
      title: "Sunshine Gatito",
      medium: "Procreate / Digital Art",
      date: "02/11/2025",
      category: "Digital",
    },
  {
      src: "/artwork/buba1.jpg",          // ← new piece
      title: "Buba",
      medium: "Procreate / Digital Art",
      date: "03/14/2025",
      category: "Digital",
    },
    {
      src: "/artwork/buba2.jpg",          // ← new piece
      title: "My Honest Reaction",
      medium: "Procreate / Digital Art",
      date: "03/14/2025",
      category: "Digital",
    },
  ];

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
            <h1 className="logo">
              EMELY.<span className="logo__light">ART</span>
            </h1>
            <p className="tagline">Art Portfolio — 2025</p>

            <button
              className="cta"
              type="button"
              aria-label="View gallery"
              onClick={() => setView("gallery")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="4" y1="12" x2="20" y2="12" />
                <polyline points="13 5 20 12 13 19" />
              </svg>
            </button>
          </section>
        )}

        {view === "gallery" && (
          <section className="gallery fade">
            <h2 className="visually-hidden">Gallery</h2>

            <span className="divider" aria-hidden="true" />

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
            <h2>About</h2>
            <p>Short bio or statement goes here.</p>
          </section>
        )}
      </main>

      {/* ─────────── footer ─────────── */}
      <footer className="site-footer fade">
        <span className="divider" aria-hidden="true"></span>
        <p className="footer-text">© 2025 Emely Recinos. All rights reserved.</p>
      </footer>
    </>
  );
}
