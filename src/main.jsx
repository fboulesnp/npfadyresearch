// Entry point — order matters. setup-globals must run first so the legacy
// modules can read `window.React` when they destructure hooks at module
// top level.
import './setup-globals.js';
import './brain-data.js';
import './neural.jsx';
import './shell.jsx';
import './trial-alert.jsx';
import './study-edu.jsx';
import './pages.jsx';
import './app.jsx';

import ReactDOM from 'react-dom/client';

// Trial registry data (inclusion/exclusion, endpoints, etc) pulled from ClinicalTrials.gov
(async () => {
  try {
    const [r1, r2] = await Promise.all([
      fetch('/assets/trial-data.json'),
      fetch('/assets/study-briefs.json'),
    ]);
    window.TRIAL_DATA = await r1.json();
    window.STUDY_BRIEFS = await r2.json();
    window.dispatchEvent(new Event('trial-data-ready'));
  } catch (e) {
    window.TRIAL_DATA = window.TRIAL_DATA || {};
    window.STUDY_BRIEFS = window.STUDY_BRIEFS || {};
  }
})();

const App = window.App;
ReactDOM.createRoot(document.getElementById('app')).render(<App />);
