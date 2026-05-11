import { useEffect, useMemo, useRef, useState } from "react";
import type { MouseEvent } from "react";
import { motion } from "framer-motion";

type Piece = { src: string; alt: string };
type View = "home" | "gallery" | "about";

const artworkFiles = import.meta.glob("./artwork/*.{jpg,jpeg,png,webp}", {
  eager: true,
  import: "default",
}) as Record<string, string>;

const pieces: Piece[] = Object.entries(artworkFiles)
  .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
  .map(([path, src]) => {
    const name = path.split("/").pop()!.replace(/\.\w+$/, "");
    return { src, alt: `Artwork ${name}` };
  });

function shuffledDelays(count: number): number[] {
  const order = Array.from({ length: count }, (_, i) => i);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  const step = 0.12;
  const delays = new Array<number>(count);
  for (let i = 0; i < count; i++) delays[order[i]] = i * step;
  return delays;
}

function Slideshow({
  slides,
  interval = 5000,
  onViewClick,
}: {
  slides: Piece[];
  interval?: number;
  onViewClick: () => void;
}) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const id = window.setInterval(
      () => setIdx((i) => (i + 1) % slides.length),
      interval,
    );
    return () => window.clearInterval(id);
  }, [slides.length, interval]);

  return (
    <div className="slideshow">
      {slides.map((s, i) => (
        <div
          key={s.src}
          className={`slideshow__slide ${i === idx ? "is-active" : ""}`}
          style={{ backgroundImage: `url(${s.src})` }}
          role="img"
          aria-label={s.alt}
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

function GalleryView({
  pieces,
  onSelect,
  visible,
}: {
  pieces: Piece[];
  onSelect: (idx: number, el: HTMLElement) => void;
  visible: boolean;
}) {
  const delays = useMemo(() => shuffledDelays(pieces.length), [pieces.length]);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);

  useEffect(() => {
    if (visible && !hasBeenVisible) setHasBeenVisible(true);
  }, [visible, hasBeenVisible]);

  return (
    <section className="gallery">
      <div className="grid">
        {pieces.map((p, idx) => (
          <motion.button
            type="button"
            className="grid__item"
            key={p.src}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={
              hasBeenVisible
                ? { opacity: 1, scale: 1 }
                : { opacity: 0, scale: 0.97 }
            }
            transition={{
              duration: 0.6,
              delay: hasBeenVisible ? delays[idx] : 0,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            onClick={(e: MouseEvent<HTMLButtonElement>) =>
              onSelect(idx, e.currentTarget)
            }
            aria-label={`Open ${p.alt}`}
          >
            <img
              src={p.src}
              alt={p.alt}
              loading="lazy"
              decoding="async"
              onLoad={(e) => e.currentTarget.classList.add("is-loaded")}
            />
          </motion.button>
        ))}
      </div>
    </section>
  );
}

function NavLink({
  label,
  view,
  setView,
}: {
  label: string;
  view: View;
  setView: (v: View) => void;
}) {
  const target = label.toLowerCase() as View;
  const active = view === target;
  return (
    <button
      type="button"
      className={`nav__link ${active ? "is-active" : ""}`}
      aria-current={active ? "page" : undefined}
      onClick={() => setView(target)}
    >
      {label}
    </button>
  );
}

function Modal({
  pieces,
  selectedIndex,
  setSelectedIndex,
  openerRef,
}: {
  pieces: Piece[];
  selectedIndex: number;
  setSelectedIndex: (i: number | null) => void;
  openerRef: React.MutableRefObject<HTMLElement | null>;
}) {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const close = () => setSelectedIndex(null);
  const prev = () =>
    setSelectedIndex((selectedIndex + pieces.length - 1) % pieces.length);
  const next = () => setSelectedIndex((selectedIndex + 1) % pieces.length);

  useEffect(() => {
    dialogRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      openerRef.current?.focus();
    };
  }, [selectedIndex]);

  const current = pieces[selectedIndex];
  return (
    <div
      className="image-modal"
      role="dialog"
      aria-modal="true"
      aria-label={current.alt}
      ref={dialogRef}
      tabIndex={-1}
    >
      <div className="image-modal__overlay" onClick={close} />
      <div className="image-modal__content">
        <button
          className="image-modal__nav image-modal__nav--left"
          onClick={(e) => {
            e.stopPropagation();
            prev();
          }}
          aria-label="Previous"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            width="1em"
            height="1em"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5 8.25 12l7.5-7.5"
            />
          </svg>
        </button>
        <button
          className="image-modal__close"
          onClick={close}
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            width="1em"
            height="1em"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
        </button>
        <img key={current.src} src={current.src} alt={current.alt} />
        <button
          className="image-modal__nav image-modal__nav--right"
          onClick={(e) => {
            e.stopPropagation();
            next();
          }}
          aria-label="Next"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            width="1em"
            height="1em"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m8.25 4.5 7.5 7.5-7.5 7.5"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [view, setView] = useState<View>("home");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  const handleSelect = (i: number, el: HTMLElement) => {
    openerRef.current = el;
    setSelectedIndex(i);
  };

  return (
    <>
      <style>{styles}</style>
      <header className="site-header">
        <nav className="nav" aria-label="Primary">
          <NavLink label="Home" view={view} setView={setView} />
          <NavLink label="Gallery" view={view} setView={setView} />
          <NavLink label="About" view={view} setView={setView} />
        </nav>
      </header>

      <main>
        <section
          className="home"
          style={{ display: view === "home" ? "" : "none" }}
        >
          <Slideshow
            slides={pieces}
            onViewClick={() => setView("gallery")}
          />
        </section>

        <div style={{ display: view === "gallery" ? "" : "none" }}>
          <GalleryView
            pieces={pieces}
            onSelect={handleSelect}
            visible={view === "gallery"}
          />
        </div>

        <section
          className="about"
          style={{ display: view === "about" ? "" : "none" }}
        >
          <p>
            I'm Emely, an artist born and raised in the U.S. I've always loved
            drawing for as long as I can remember. I used to color, even if it
            was just scribbles when my toddler brain couldn't understand shapes
            yet.
          </p>
          <p>
            Thanks to my mom who is from El Salvador and my dad who is from
            Guatemala, I get the opportunity to visit these two countries with a
            beautiful artistic culture every now and then. Each time I travel
            there, I get exposed to a lot of street murals of all sorts of
            themes, colors, styles, etc. All the way from the city to our
            hometown, keeping me inspired.
          </p>
          <p>
            I mostly specialize in realistic portraits because it's my favorite.
            Sometimes I take pictures of what to draw, like my dog or some
            flowers outside when there's good sunlight. I listen to music while
            drawing to make the experience more relaxing, and I like to gift
            them too, especially to my mom; she loves them. My drawings can
            express a deep meaning or just be for fun depending on how I feel at
            the time, but I always care about visual quality.
          </p>
          <p>
            Art is something that will always be in me wherever I go. I'll never
            be able to see myself not doing art, and if I'm not doing it, I'll
            only be planning my next piece.
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
            &copy; {new Date().getFullYear()} Emely Recinos Monjaras.{" "}
            <a
              href="https://bairon.dev"
              target="_blank"
              rel="noopener noreferrer"
            >
              Built with &#9825; by Ale.
            </a>
          </p>
        </motion.footer>
      )}

      {selectedIndex !== null && (
        <Modal
          pieces={pieces}
          selectedIndex={selectedIndex}
          setSelectedIndex={setSelectedIndex}
          openerRef={openerRef}
        />
      )}
    </>
  );
}

const styles = `
@import url("https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&display=swap");

:root {
  --bg: #000;
  --text: #f0f0f0;
  --text-muted: rgba(255, 255, 255, .45);
  --gap: clamp(0.4rem, 1.5vw, 0.75rem);
  --header-h: 2.82rem;
  font-family: "Cormorant Garamond", Georgia, serif;
  font-weight: 300;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; }

html, body {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

html::-webkit-scrollbar,
body::-webkit-scrollbar {
  display: none;
  width: 0;
  height: 0;
}

body {
  background: var(--bg);
  color: var(--text);
  overflow-x: hidden;
  -webkit-text-size-adjust: 100%;
}

@keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
.fade { animation: fadeIn .35s ease; }

.site-header {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: #000;
  padding: 0.5rem 0;
  height: var(--header-h);
}

.nav { display: flex; justify-content: center; gap: 0.25rem; }

.nav__link {
  padding: 0.4rem 1.2rem;
  background: none;
  color: var(--text-muted);
  border: none;
  cursor: pointer;
  white-space: nowrap;
  font-family: inherit;
  font-weight: 400;
  font-size: 0.85rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  position: relative;
  transition: color .2s;
}

.nav__link.is-active { color: var(--text); }

.nav__link::after {
  content: "";
  position: absolute;
  left: 50%;
  bottom: 0;
  width: 0;
  height: 1px;
  background: rgba(255, 255, 255, .3);
  transition: width .25s ease, left .25s ease;
}

.nav__link.is-active::after,
.nav__link:hover::after { width: 50%; left: 25%; }

.nav__link:hover { color: var(--text); }

@media (max-width: 599px) {
  :root { --header-h: 2.7rem; }
  .nav__link { padding: 0.4rem 0.9rem; font-size: 0.75rem; }
}

.home { padding: 0; }

.slideshow {
  position: relative;
  width: 100%;
  height: calc(100dvh - var(--header-h, 0px));
  overflow: hidden;
}

.slideshow__slide {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  opacity: 0;
  transition: opacity 1.2s ease;
  will-change: opacity;
}

.slideshow__slide.is-active { opacity: 1; }

.slideshow__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.15) 0%,
    rgba(0, 0, 0, 0.45) 50%,
    rgba(0, 0, 0, 0.8) 100%
  );
  pointer-events: none;
  z-index: 1;
}

.slideshow__content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 2;
  padding: 0 clamp(1.5rem, 5vw, 4rem) clamp(3rem, 8vh, 5rem);
}

.slideshow__title {
  font-size: clamp(1.4rem, 3vw + 0.5rem, 2.5rem);
  font-weight: 600;
  line-height: 1.1;
  letter-spacing: 0.04em;
  color: #fff;
  margin-bottom: 0.5rem;
}

.slideshow__sub {
  font-size: clamp(0.95rem, 1.2vw + 0.5rem, 1.3rem);
  font-weight: 300;
  font-style: italic;
  color: rgba(255, 255, 255, .6);
  letter-spacing: 0.02em;
  margin-bottom: 1.75rem;
}

.slideshow__cta {
  background: none;
  color: #fff;
  border: 1px solid rgba(255, 255, 255, .3);
  padding: 0.65rem 2.25rem;
  font-family: inherit;
  font-size: 0.8rem;
  font-weight: 400;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  cursor: pointer;
  transition: border-color .3s, background .3s, letter-spacing .3s;
}

@media (hover: hover) {
  .slideshow__cta:hover {
    border-color: rgba(255, 255, 255, .7);
    background: rgba(255, 255, 255, .08);
    letter-spacing: 0.2em;
  }
}

@media (max-width: 599px) {
  .slideshow__title { font-size: clamp(1.8rem, 8vw, 2.5rem); }
  .slideshow__sub { font-size: 0.9rem; margin-bottom: 1.25rem; }
  .slideshow__content { padding: 0 1.25rem calc(env(safe-area-inset-bottom, 0px) + 2rem); }
  .slideshow__cta { padding: 0.55rem 1.75rem; font-size: 0.75rem; }
}

.gallery { padding: var(--gap); }

.grid { columns: 2; column-gap: var(--gap); }

.grid__item {
  break-inside: avoid;
  margin-bottom: var(--gap);
  cursor: pointer;
  overflow: hidden;
  display: block;
  width: 100%;
  background: none;
  border: 0;
  padding: 0;
  font: inherit;
  color: inherit;
  text-align: inherit;
}

.grid__item img {
  width: 100%;
  height: auto;
  display: block;
  opacity: 0;
  transition: opacity .4s ease-in-out, transform .3s ease;
}

.grid__item img.is-loaded { opacity: 1; }

.grid__item:hover img { transform: scale(1.02); }

@media (max-width: 599px) { .grid { columns: 2; } }
@media (min-width: 600px) { .grid { columns: 2; } }
@media (min-width: 900px) { .grid { columns: 3; } }

.about {
  max-width: 55ch;
  margin: 0 auto;
  padding: 4rem 1.5rem 3rem;
}

.about p {
  font-size: 1.05rem;
  font-weight: 300;
  line-height: 1.75;
  margin-bottom: 1.5em;
  color: rgba(255, 255, 255, .65);
}

@media (max-width: 599px) {
  .about { padding: 2rem 1.25rem 1.5rem; }
  .about p { font-size: 0.95rem; line-height: 1.65; }
}

.site-footer {
  padding: 1.5rem 1rem 1rem;
  text-align: center;
  font-size: 0.75rem;
  color: var(--text-muted);
  letter-spacing: 0.05em;
}

.footer-text a { color: inherit; text-decoration: none; }

.image-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.image-modal__overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.95);
}

.image-modal__content {
  position: relative;
  z-index: 1;
  max-width: 100vw;
  max-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-modal__nav {
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: rgba(255, 255, 255, .5);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 998;
  transition: color .2s;
  padding: 1rem;
  -webkit-tap-highlight-color: transparent;
}

.image-modal__nav:hover { color: rgba(255, 255, 255, .9); }

.image-modal__nav--left  { left: 0.25rem; }
.image-modal__nav--right { right: 0.25rem; }

.image-modal__nav svg { width: 1.35rem; height: 1.35rem; }

@media (max-width: 599px) {
  .image-modal__nav svg { width: 1.1rem; height: 1.1rem; }
  .image-modal__content img { max-width: 96vw; max-height: 85vh; }
}

.image-modal__content img {
  max-width: 100vw;
  max-height: 100vh;
  object-fit: contain;
}

@keyframes modalFadeIn { from { opacity: 0 } to { opacity: 1 } }

.image-modal,
.image-modal__overlay { animation: modalFadeIn .25s ease; }

@keyframes modalImageIn {
  from { opacity: 0; transform: scale(.995) }
  to   { opacity: 1; transform: scale(1) }
}

.image-modal__content img {
  opacity: 0;
  transform: scale(.995);
  animation: modalImageIn .28s ease forwards;
}

.image-modal__close svg { width: 1.35rem; height: 1.35rem; }

.image-modal__close {
  position: fixed;
  top: calc(env(safe-area-inset-top, 0px) + 0.5rem);
  right: calc(env(safe-area-inset-right, 0px) + 0.5rem);
  width: 3.25rem;
  height: 3.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: rgba(255, 255, 255, .6);
  font-size: clamp(1.75rem, 3vw, 3rem);
  line-height: 1;
  cursor: pointer;
  z-index: 999;
  touch-action: manipulation;
  transition: color .2s;
}

.image-modal__close:hover { color: rgba(255, 255, 255, 1); }

.visually-hidden {
  position: absolute;
  inset: 0;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
}
`;
