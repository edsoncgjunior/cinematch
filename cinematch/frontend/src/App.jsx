import React from 'react'
import { Outlet, Link } from 'react-router-dom'
export default function App(){
  return (<div>
    <header className="header">
      <div className="container" style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div className="brand"><span style={{fontSize:20}}>🎬</span><span>CineMatch</span></div>
        
      </div>
    </header>
    <main className="container"><Outlet/></main>
  </div>)
}