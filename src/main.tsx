import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import MarketingSections from './MarketingSections'
import './index.css'
import './marketing.css'
import './premium.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
    <MarketingSections />
  </React.StrictMode>,
)
