import Link from "next/link";
import { Icon } from "@/components/icon";

const Loading = () => {
  return (
    <main
      id="main-content"
      className="detail-main container"
      aria-busy="true"
      aria-label="Loading animation"
    >
      <Link href="/" className="back-link">
        <Icon name="back" />
        Back to library
      </Link>
      <div className="detail-heading">
        <div>
          <p className="eyebrow">MOTION STUDY</p>
          <h1>
            Just a moment<span>.</span>
          </h1>
          <p>Getting the next idea ready.</p>
        </div>
      </div>
      <div className="loading-stage">
        <p className="mono">LOADING ANIMATION…</p>
      </div>
    </main>
  );
};
export default Loading;
