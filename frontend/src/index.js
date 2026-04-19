import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import store from './store/store';
import { Provider } from 'react-redux';
(function injectYandexMaps() {
  const yandexKey = process.env.REACT_APP_YANDEX_MAPS_API_KEY;
  if (yandexKey && typeof document !== 'undefined' && !document.querySelector('script[data-yandex-maps]')) {
    const s = document.createElement('script');
    s.src = `https://api-maps.yandex.ru/v3/?apikey=${encodeURIComponent(yandexKey)}&lang=ru_RU`;
    s.async = true;
    s.dataset.yandexMaps = '1';
    document.head.appendChild(s);
  }
})();
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Provider store={store}>
        <App />
    </Provider>);
reportWebVitals();
