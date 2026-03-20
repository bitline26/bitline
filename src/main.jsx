import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Admin from './Admin.jsx'
import Promo from './Promo.jsx'
import AppMobile from './AppMobile.jsx'
import PromoMobile from './PromoMobile.jsx'

const path = window.location.pathname
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  || window.innerWidth <= 768

let Page
if (path === '/admin') {
  Page = Admin
} else if (path === '/promo') {
  Page = isMobile ? PromoMobile : Promo
} else {
  Page = isMobile ? AppMobile : App
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Page />
  </StrictMode>,
)
