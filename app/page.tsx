import { Catalog } from "@/components/catalog";
import { animations } from "@/lib/animations";

const Home = () => {
  return (
    <main id="main-content" className="container">
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="status-dot" /> A LITTLE LIBRARY OF BIG IDEAS
          </p>
          <h1 id="hero-title">
            A visual dictionary
            <br />
            of <span>motion.</span>
            <span className="title-arrow" aria-hidden="true">
              ↗
            </span>
          </h1>
          <p className="hero-description">
            You know the movement. Now find the words.
            <br className="desktop-break" /> Explore, play, and turn what you
            see into your next prompt.
          </p>
        </div>
        <div className="hero-specimen" aria-hidden="true">
          <span className="specimen-cross cross-top">+</span>
          <span className="specimen-cross cross-bottom">+</span>
          <div className="specimen-orbit orbit-one" />
          <div className="specimen-orbit orbit-two" />
          <div className="specimen-square square-ghost-one" />
          <div className="specimen-square square-ghost-two" />
          <div className="specimen-square square-main" />
          <span className="specimen-caption">LESS GUESSING. MORE MAKING.</span>
        </div>
      </section>
      <Catalog entries={animations} />
      <section
        id="how-it-works"
        className="how-it-works"
        aria-labelledby="how-title"
      >
        <div>
          <p className="eyebrow">FROM “THAT THING” TO THE RIGHT WORDS</p>
          <h2 id="how-title">See it. Name it. Make it.</h2>
        </div>
        <ol>
          <li>
            <span>01</span>
            <div>
              <h3>Find your motion</h3>
              <p>Browse the collection or search for what you have in mind.</p>
            </div>
          </li>
          <li>
            <span>02</span>
            <div>
              <h3>Get a feel for it</h3>
              <p>Play an effect, slow it down, and see what makes it work.</p>
            </div>
          </li>
          <li>
            <span>03</span>
            <div>
              <h3>Take the words with you</h3>
              <p>Copy a ready-to-use prompt and make it your own.</p>
            </div>
          </li>
        </ol>
      </section>
    </main>
  );
};
export default Home;
