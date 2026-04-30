import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { registerSW } from 'virtual:pwa-register'

// Enregistrement automatique du Service Worker avec rechargement immédiat lors d'une mise à jour
const updateSW = registerSW({
  onNeedRefresh() {
    // Si une mise à jour est trouvée, on force le rechargement de l'application
    // sans attendre l'interaction de l'utilisateur (comportement automatique)
    updateSW(true)
  },
  onOfflineReady() {
    console.log('AFB EXAM est prêt pour une utilisation hors-ligne !')
  },
})

// Vérification périodique des mises à jour toutes les 60 minutes
setInterval(() => {
  updateSW()
}, 60 * 60 * 1000)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
