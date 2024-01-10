import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { store } from './app/store.jsx'
import { Provider } from 'react-redux'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<App />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
)

// The '!' asserts that the element will not be null or undefined.

// <Provider> is a component provided by the react-redux library that makes the Redux store available to the entire React application.

// <BrowserRouter> is a component from react-router-dom that provides the application with the ability to use client-side routing using the HTML5 History API.
// <Routes> is a component from react-router-dom that declares the routes for your application.
// <Route> is used to define a route, and path="/*" matches any path.
