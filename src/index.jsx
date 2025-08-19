import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import Poem from './components/Poem';
import CubeGrid from './components/CubeGrid';

createRoot(document.getElementById('root')).render(<App />);
// createRoot(document.getElementById('root')).render(<CubeGrid />);
