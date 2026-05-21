import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Ensure root element exists before rendering
const rootElement = document.getElementById('root')

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
} else {
  console.error('Root element not found! Make sure index.html has <div id="root"></div>')
  // Fallback: create root div if missing
  const root = document.createElement('div')
  root.id = 'root'
  document.body.appendChild(root)
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
}
