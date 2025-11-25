import {useState} from 'react';

export default function Admin(){
  const[id,setId]=useState('');
  const[url,setUrl]=useState('');
  const[msg,setMsg]=useState('');

  const submit=async()=>{
    const res=await fetch('/api/create',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id,url})});
    const data=await res.json();
    setMsg(data.message);
  }

  return(
    <div style={{maxWidth:'400px',margin:'60px auto',textAlign:'center'}}>
      <h2>Admin Panel</h2>
      <input placeholder='short id' onChange={e=>setId(e.target.value)} style={{width:'100%',padding:'10px'}}/>
      <br/><br/>
      <input placeholder='full url' onChange={e=>setUrl(e.target.value)} style={{width:'100%',padding:'10px'}}/>
      <br/><br/>
      <button onClick={submit} style={{padding:'10px 20px'}}>Create</button>
      <p>{msg}</p>
    </div>
  );
}