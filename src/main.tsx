// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles/global.css'; // Placeholder for global styles

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* Wrapping the entire app in the router */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);