import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import Catalogo from './pages/Catalogo.jsx'
import Recomendacoes from './pages/Recomendacoes.jsx'
import './styles.css'
createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route element={<App />}>
        <Route index element={<Catalogo />} />
        <Route path="/recomendacoes" element={<Recomendacoes />} />
      </Route>
    </Routes>
  </BrowserRouter>
)