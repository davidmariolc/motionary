import Link from "next/link";
import { Icon } from "@/components/icon";

const NotFound = () => {
  return (
    <main id="main-content" className="not-found container">
      <p className="eyebrow">404 / OUT OF FRAME</p>
      <h1>This motion got away.</h1>
      <p>
        That animation is not in the collection. There are plenty more to
        explore.
      </p>
      <Link className="button primary-button" href="/">
        Back to library
        <Icon name="arrow" />
      </Link>
    </main>
  );
};
export default NotFound;
