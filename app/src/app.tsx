import { Router } from 'preact-router';
import { Navigation } from './components/navigation';
import { Home } from './pages/home';
import Swap from './pages/swap';

export function App() {
  return (
    <div id='app'>
      <Navigation />
      <Router>
        <Home path='/' />
        <Swap path='/swap' />
        {/* <About path='/about' />
        // <NotFound default /> */}
      </Router>
    </div>
  );
}
