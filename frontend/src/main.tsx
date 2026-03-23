import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { OnboardingProvider } from './providers/OnboardingProvider';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <OnboardingProvider>
      <App />
    </OnboardingProvider>
  </StrictMode>,
);
