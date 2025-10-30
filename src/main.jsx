import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './app/store'; // Import both store and persistor
import App from './App.jsx';
import './styles/print.css';
import LoadingSpinner from './components/common/LoadingSpinner';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={<LoadingSpinner fullPage />} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);