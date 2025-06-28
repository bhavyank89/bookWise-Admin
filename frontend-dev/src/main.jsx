import { createRoot } from 'react-dom/client'
import './index.css'
import Home from './Page'
import { BrowserRouter as Router } from 'react-router-dom';
import { Analytics } from "@vercel/analytics/next"

createRoot(document.getElementById('root')).render(
  <Router>
    <Home />
    <Analytics />
  </Router>
)