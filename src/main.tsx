import App from './App';
import { ApolloProvider } from '@apollo/client';
import client from './apollo/client';
import ReactDOM from 'react-dom/client';
import React from 'react';
import "./i18n";
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
);
