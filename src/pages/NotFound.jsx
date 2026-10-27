import { Link } from 'react-router-dom';
import Watch from '../components/Watch';
import { defaultConfig } from '../data/watch';
import { usePageTitle } from '../lib/misc';

export default function NotFound() {
  usePageTitle('Page not found — Maison Aurelle');
  return (
    <div className="container notfound">
      <div className="notfound__watch">
        <Watch config={{ ...defaultConfig, dialId: 'obsidian', caseId: 'steel' }} live={false} />
      </div>
      <div>
        <p className="eyebrow">Error 404</p>
        <h1 className="display">
          This moment <em>doesn’t exist.</em>
        </h1>
        <p className="lede">The page you were looking for has been lost to time. Let us take you somewhere better.</p>
        <Link to="/" className="btn btn--solid">
          Return to the Maison
        </Link>
      </div>
    </div>
  );
}
