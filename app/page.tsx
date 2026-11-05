import Link from "next/link";
import { Catalog } from "@/components/catalog";
import { DemoPlayer } from "@/components/demo-player";
import { Icon } from "@/components/icon";
import { animations, categories } from "@/lib/animations";

const Home = () => {
  const featured = animations.find((entry) => entry.id === "stagger");
  return (
    <main id="main-content" className="container">
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <h1 id="hero-title">
            A visual
            <br />
            dictionary
            <br /> of <span>motion.</span>
          </h1>
          <p className="hero-description">
            Find the words for the movement in your head. Play{" "}
            {animations.length} interactive studies, learn their names, and take
            a prompt with you.
          </p>
          <div className="hero-actions">
            <Link href="#collection" className="button primary-button">
              Browse the library <Icon name="arrow" size={18} />
            </Link>
            <span className="hero-fact">
              {categories.length} categories. Ready to play.
            </span>
          </div>
        </div>
        {featured ? (
          <div className="hero-feature">
            <div className="feature-topline mono">
              <span>Inside the library</span>
              <Icon name="diagonal" size={20} />
            </div>
            <div className="feature-title">
              <span className="mono">
                Study / {String(featured.number).padStart(2, "0")}
              </span>
              <Link href={`/animations/${featured.id}`}>{featured.name}</Link>
            </div>
            <DemoPlayer entry={featured} />
            <div className="feature-bottomline">
              <span>{featured.description}</span>
              <span className="mono">
                {String(featured.number).padStart(2, "0")} / {animations.length}
              </span>
            </div>
          </div>
        ) : null}
      </section>
      <Catalog entries={animations} />
      <section
        id="how-it-works"
        className="how-it-works"
        aria-labelledby="how-title"
      >
        <div>
          <h2 id="how-title">
            Your next motion,
            <br />
            in three steps.
          </h2>
          <Link href="#collection" className="text-link">
            Find your motion <Icon name="arrow" />
          </Link>
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
              <h3>Try the preview</h3>
              <p>Play an effect, slow it down, and see what makes it work.</p>
            </div>
          </li>
          <li>
            <span>03</span>
            <div>
              <h3>Copy the prompt</h3>
              <p>Copy a ready-to-use prompt and make it your own.</p>
            </div>
          </li>
        </ol>
      </section>
    </main>
  );
};
export default Home;
