'use client';

import { useEffect, useState } from 'react';
import ReservationManager from './ReservationManager';

export default function AdminGate() {
  const [ready, setReady] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/admin/session', { cache: 'no-store' })
      .then((response) => setAuthenticated(response.ok))
      .finally(() => setReady(true));
  }, []);

  const signIn = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      const response = await fetch('/api/admin/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'ÄÄƒng nháº­p tháº¥t báº¡i.');
      setAuthenticated(true);
      setPassword('');
    } catch (cause) {
      setError(cause.message);
    } finally {
      setSaving(false);
    }
  };

  if (!ready) return <p role="status">Äang kiá»ƒm tra phiÃªn nhÃ¢n viÃªnâ€¦</p>;
  if (authenticated) return <ReservationManager />;

  return (
    <section className="panel form-panel" aria-labelledby="admin-login-title">
      <h2 id="admin-login-title">ÄÄƒng nháº­p nhÃ¢n viÃªn</h2>
      <form className="reservation-form" onSubmit={signIn}>
        <label>
          Máº­t kháº©u quáº£n trá»‹
          <input type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} />
        </label>
        {error && <p className="feedback error" role="alert">{error}</p>}
        <button type="submit" disabled={saving}>{saving ? 'Äang Ä‘Äƒng nháº­pâ€¦' : 'ÄÄƒng nháº­p'}</button>
      </form>
    </section>
  );
}
