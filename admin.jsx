'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import Link from 'next/link';

const DEFAULT_RULES = {
  phase1: { target: 10, daily: 4, maxLoss: 8, minDays: 2, maxDays: 15 },
  phase2: { target: 10, daily: 5, maxLoss: 10, minDays: 1, maxDays: null },
  common: { equityBased: true, hardBreach: true, resetPhase2: true, failureDiscountPercent: 13 }
};

export default function Admin() {
  const [session, setSession] = useState(null);
  const [rules, setRules] = useState(DEFAULT_RULES);
  const [coupon, setCoupon] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = '/'; return; }
      setSession(user);
    })();
  }, []);

  const saveRules = async () => {
    setStatus('Salvo regole...');
    const { error } = await supabase
      .from('settings')
      .upsert({ id: 'rules', data: rules });
    setStatus(error ? 'Errore: '+error.message : 'Regole salvate.');
  };

  const generateCoupon = async () => {
    const code = 'RIPROVA13-' + Math.random().toString(36).slice(2,8).toUpperCase();
    const expires_at = new Date(Date.now() + 30*24*3600*1000).toISOString();
    const { error } = await supabase.from('coupons').insert({ code, percent_off: 13, expires_at, created_by: session?.id });
    if (error) setStatus('Errore: '+error.message); else { setCoupon(code); setStatus('Coupon creato.'); }
  };

  return (
    <main>
      <header className="top">
        <h2>Admin</h2>
        <Link href="/dashboard">Torna alla Dashboard</Link>
      </header>

      <section className="card">
        <h3>Regole Challenge</h3>
        <pre className="small" style={{whiteSpace:'pre-wrap'}}>{JSON.stringify(rules, null, 2)}</pre>
        <button className="btn" onClick={saveRules}>Salva regole</button>
      </section>

      <div style={{height:16}} />

      <section className="card">
        <h3>Coupon -13% se fallisce la challenge</h3>
        <button className="btn" onClick={generateCoupon}>Genera Coupon -13%</button>
        {coupon && <p className="small">Codice generato: <b>{coupon}</b> (scade in 30 giorni)</p>}
      </section>

      <div style={{height:16}} />

      <section className="card">
        <h3>Utenti (demo)</h3>
        <p className="small">Qui potrai attivare/disattivare utenti e vedere lo stato challenge.</p>
      </section>

      <p className="small" style={{marginTop:16}}>{status}</p>
    </main>
  );
}
