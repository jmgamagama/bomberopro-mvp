import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import AppAddressNotice from './components/AppAddressNotice';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppAddressNotice />
    <App />
  </StrictMode>,
);
