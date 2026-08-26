import { Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Landing from './pages/Landing.jsx'
import Subscribe from './pages/Subscribe.jsx'
import HowItWorks from './pages/HowItWorks.jsx'
import Login from './pages/Login.jsx'
import AppPage from './pages/AppPage.jsx'
import Admin from './pages/Admin.jsx'
import TopBar from './components/TopBar.jsx'
import GuidedFlow from './components/GuidedFlow.jsx'
import RitualMenu from './components/RitualMenu.jsx'
import RitualScreen from './components/RitualScreen.jsx'
import ChallengeScreen from './components/ChallengeScreen.jsx'
import RespLibrary from './components/RespLibrary.jsx'
import RespPractice from './components/RespPractice.jsx'
import AudioPractice from './components/AudioPractice.jsx'
import AudioPracticeDetail from './components/AudioPracticeDetail.jsx'
import SosFlow from './components/SosFlow.jsx'
import HomeMenu from './components/HomeMenu.jsx'
import LockScreen from './components/LockScreen.jsx'
import { ContentProvider } from './engine/ContentContext.jsx'
import { hasAccess, getOrCreateUser, updateCurrentUser } from './engine/store.js'
import { verifyAccess } from './api/client.js'

function AppGate() {
  const [status, setStatus] = useState(hasAccess() ? 'open' : 'checking')

  useEffect(() => {
    if (status === 'open') return
    const user = getOrCreateUser()
    if (!user.email || !user.email.includes('@')) {
      setStatus('locked')
      return
    }
    let cancelled = false
    verifyAccess(user.email).then((has) => {
      if (cancelled) return
      if (has) {
        updateCurrentUser({ subscribed: true })
        setStatus('open')
      } else {
        setStatus('locked')
      }
    })
    return () => { cancelled = true }
  }, [status])

  if (status === 'checking') {
    return (
      <div className="gate-loading">
        <p>Verificando seu acesso...</p>
      </div>
    )
  }
  return status === 'open' ? <AppPage /> : <LockScreen />
}

export default function App() {
  return (
    <ContentProvider>
      <TopBar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/como-funciona" element={<HowItWorks />} />
        <Route path="/assinar" element={<Subscribe />} />
        <Route path="/entrar" element={<Login />} />
        <Route path="/app" element={<AppGate />}>
          <Route index element={<HomeMenu />} />
          <Route path="avaliacao" element={<GuidedFlow />} />
          <Route path="ritual" element={<RitualMenu />} />
          <Route path="ritual/:ritualId" element={<RitualScreen />} />
          <Route path="processo" element={<ChallengeScreen />} />
          <Route path="respiracao" element={<RespLibrary />} />
          <Route path="respiracao/:id" element={<RespPractice />} />
          <Route path="protocolos" element={<AudioPractice />} />
          <Route path="protocolos/:id" element={<AudioPracticeDetail />} />
          <Route path="sos" element={<SosFlow />} />
        </Route>
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ContentProvider>
  )
}
