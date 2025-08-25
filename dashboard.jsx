'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import Link from 'next/link';

function Stat({label, value}){
  return <div className="card"><div className="small">{label}</div><div style={{fontSize:22, fontWeight:700}}>{value}</div></div>
}

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [metrics, setMetrics] = useState([]);
  const [status, setStatus] = useState('');

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href='/'; return; }
      setStatus('Carico dati...');
      const { data: prof } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle();
      setProfile(prof);
      const { data: metr } = await supabase.from('metrics_view').select('*').order('date', { ascending: true }).limit(60);
      setMetrics(metr || []);
      setStatus('');
    };
    load();
  }, []);

  return (
    <main>
      <header className="top">
        <h2>Dashboard Trader</h2>
        <Link href="/admin">Admin</Link>
      </header>
      <p className="small">{status}</p>
      {profile && (
        <div className="grid3">
          <Stat label="PNL Totale" value={(profile.demo_total_pnl ?? 0).toFixed(2) + ' €'} />
          <Stat label="Max Drawdown" value={(profile.demo_max_dd ?? 0).toFixed(2) + ' %'} />
          <Stat label="Stato Challenge" value={profile.demo_status ?? '—'} />
        </div>
      )}
      <section style={{marginTop:24}}>
        <h3>Ultimi 30 giorni (demo)</h3>
        <ul>
          {metrics.map((m,i)=>(
            <li key={i} className="small">{m.date}: PnL {m.pnl} — Equity {m.equity}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}
