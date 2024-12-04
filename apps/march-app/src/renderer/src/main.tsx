import './styles/main.css'

import ReactDOM from 'react-dom/client'
import App from './App'
import { BrowserRouter, Route, Routes } from 'react-router'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { GithubCallback } from './components/callbacks/github'
import GoogleCallback from './components/callbacks/google'

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <GoogleOAuthProvider clientId={clientId}>
    <BrowserRouter>
      <Routes>
        <Route index element={<App />} />
        <Route path="/api/auth/github/callback" element={<GithubCallback />} />
        <Route path="/api/auth/google/callback" element={<GoogleCallback />} />
      </Routes>
    </BrowserRouter>
  </GoogleOAuthProvider>
)
