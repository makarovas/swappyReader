import { render } from 'preact';
import { AppProvider } from './AppClients.tsx';
import './index.css';

render(<AppProvider />, document.getElementById('app')!);
