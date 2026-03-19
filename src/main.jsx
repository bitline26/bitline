import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Admin from './Admin.jsx'
import Promo from './Promo.jsx'

const path = window.location.pathname

const Page = path === '/admin' ? Admin : path === '/promo' ? Promo : App

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Page />
  </StrictMode>,
)
