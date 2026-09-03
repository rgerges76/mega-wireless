import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import Hero3D from './Hero3D'
import MarketingSections from './MarketingSections'
import './index.css'
import './marketing.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Hero3D />
    <App />
    <MarketingSections />
  </React.StrictMode>,
)
