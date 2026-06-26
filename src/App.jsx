import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './components/AppLayout.jsx';
import BossTestPage from './pages/BossTestPage.jsx';
import DailyLootPage from './pages/DailyLootPage.jsx';
import GamerCommsPage from './pages/GamerCommsPage.jsx';
import ListenTypePage from './pages/ListenTypePage.jsx';
import MistakeBookPage from './pages/MistakeBookPage.jsx';
import RealTalkPage from './pages/RealTalkPage.jsx';
import VideoFarmPage from './pages/VideoFarmPage.jsx';
import WordLootPage from './pages/WordLootPage.jsx';

export const routes = [
  { path: '/', label: 'Daily Loot', element: <DailyLootPage /> },
  { path: '/word-loot', label: 'Word Loot', element: <WordLootPage /> },
  { path: '/real-talk', label: 'Real Talk', element: <RealTalkPage /> },
  { path: '/gamer-comms', label: 'Gamer Comms', element: <GamerCommsPage /> },
  { path: '/listen-type', label: 'Listen & Type', element: <ListenTypePage /> },
  { path: '/mistake-book', label: 'Mistake Book', element: <MistakeBookPage /> },
  { path: '/boss-test', label: 'Boss Test', element: <BossTestPage /> },
  { path: '/video-farm', label: 'Video Farm', element: <VideoFarmPage /> },
];

export default function App() {
  return (
    <AppLayout routes={routes}>
      <Routes>
        {routes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppLayout>
  );
}
