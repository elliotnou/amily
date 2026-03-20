import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Landing from './pages/Landing'
import Home from './pages/Home'
import Friends from './pages/Friends'
import FriendProfile from './pages/FriendProfile'
import Hangouts from './pages/Hangouts'
import HangoutDetail from './pages/HangoutDetail'
import Stats from './pages/Stats'
import AI, { AIGiftIdeas, AICatchupBrief, AIHangoutIdeas } from './pages/AI'

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">{children}</main>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/home" element={<AppLayout><Home /></AppLayout>} />
      <Route path="/friends" element={<AppLayout><Friends /></AppLayout>} />
      <Route path="/friends/:id" element={<AppLayout><FriendProfile /></AppLayout>} />
      <Route path="/hangouts" element={<AppLayout><Hangouts /></AppLayout>} />
      <Route path="/hangouts/:id" element={<AppLayout><HangoutDetail /></AppLayout>} />
      <Route path="/stats" element={<AppLayout><Stats /></AppLayout>} />
      <Route path="/ai" element={<AppLayout><AI /></AppLayout>} />
      <Route path="/ai/gifts/:friendId" element={<AppLayout><AIGiftIdeas /></AppLayout>} />
      <Route path="/ai/catchup/:friendId" element={<AppLayout><AICatchupBrief /></AppLayout>} />
      <Route path="/ai/hangout-ideas/:friendId" element={<AppLayout><AIHangoutIdeas /></AppLayout>} />
    </Routes>
  )
}
