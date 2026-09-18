import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App.jsx';
import { AuraProvider } from '@aura/react';
createRoot(document.getElementById('root')).render(<AuraProvider locale="th"><App /></AuraProvider>);
