import { createRoot } from 'react-dom/client'
import './index.css'
import Home from './Page'
import { BrowserRouter as Router } from 'react-router-dom';

createRoot(document.getElementById('root')).render(
  <Router>
    <Home />
  </Router>
)