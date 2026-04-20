import React from 'react';
import * as ReactDOMClient from 'react-dom/client';

// Legacy JSX files use `const { useState } = React;` at module top level,
// and JSX lookups like `<HomePage/>` fall back to globalThis. Expose both
// so the original code works unchanged.
window.React = React;
window.ReactDOM = ReactDOMClient;
