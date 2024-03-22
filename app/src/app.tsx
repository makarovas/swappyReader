import { Router } from 'preact-router';
import { Navigation } from './components/navigation';
import DexQuotes from './pages/dexs';
import { Home } from './pages/home';
import Swap from './pages/swap';

export function App() {
  return (
    <div id='app' style={{ width: '100%' }}>
      <Navigation />
      <Router>
        <Home path='/' />
        <Swap path='/swap' />
        <DexQuotes path='/dexs' />
        {/* <About path='/about' />
        // <NotFound default /> */}
      </Router>
    </div>
  );
}
