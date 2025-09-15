import React from 'react'
export default function Pagination({page,setPage,total,pageSize}){
  const pages=Math.max(1,Math.ceil(total/pageSize));const items=[];for(let p=1;p<=pages;p++) items.push(p)
  return (<div className="pagination">
    <button className="page-btn" onClick={()=>setPage(Math.max(1,page-1))} disabled={page===1}>◀</button>
    {items.map(p=><button key={p} className={'page-btn'+(p===page?' active':'')} onClick={()=>setPage(p)}>{p}</button>)}
    <button className="page-btn" onClick={()=>setPage(Math.min(pages,page+1))} disabled={page===pages}>▶</button>
  </div>)
}