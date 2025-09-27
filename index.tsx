// src/index.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider } from './context/ThemeContext';
<<<<<<< HEAD
import { AuthProvider } from './context/AuthContext'; // Import the new AuthProvider
=======
>>>>>>> 5179a46835ae9d155dfe77729e15f1c572cdad50

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ThemeProvider>
<<<<<<< HEAD
      <AuthProvider> {/* Wrap App with AuthProvider */}
        <App />
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
=======
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
>>>>>>> 5179a46835ae9d155dfe77729e15f1c572cdad50
