import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Import Cesium styles
import 'cesium/Build/Cesium/Widgets/widgets.css';

// Import Tailwind styles
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);