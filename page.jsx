'use client';
import { supabase } from '../lib/supabase';
import { useState } from 'react';
import Link from 'next/link';

export default function Page() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');

  const login = async (e) => {
    e.preventDefault();
    setStatus('Invio magic link...');
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: typeof window !== 'undefined' ? window.location.origin + '/dashboard' : undefined }
    });
    if (error) setStatus('Errore: ' + error.message);
    else setStatus('Controlla la tua email per il link.');
  };

  return (
    <main className="centerfull">
      <div className="card" style={{maxWidth:460, width:'100%'}}>
        <h1>THE PROP</h1>
        <p className="small">Accedi via Magic Link</p>
        <form onSubmit={login}>
          <input className="input" placeholder="la-tua-email" value={email} onChange={e=>setEmail(e.target.value)} />
          <div style={{height:8}} />
          <button className="btn" type="submit" style={{width:'100%'}}>Entra</button>
        </form>
        <p style={{marginTop:8}}>{status}</p>
        <p className="small" style={{marginTop:16}}>Dopo l'accesso verrai reindirizzato alla tua dashboard.</p>
        <p style={{marginTop:16}}><Link href="/admin">Area Admin</Link></p>
      </div>
    </main>
  );
}
