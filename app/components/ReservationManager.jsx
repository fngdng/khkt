'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

const DEFAULT_FORM = {
  customerName: '',
  phone: '',
  date: '2026-10-17',
  time: '18:00',
  durationMinutes: '90',
  partySize: '2',
  tableId: '',
};

const STATUS_LABELS = {
  pending: 'Chờ duyệt',
  confirmed: 'Đã xác nhận',
  arrived: 'Đã đến',
  cancelled: 'Đã hủy',
};

function tableLabel(tableId, tables) {
  const table = tables.find((candidate) => candidate.id === tableId);
  return table ? `${table.id} (${table.capacity} chỗ)` : tableId;
}

function floorStatus(table, reservations) {
  const activeReservation = reservations.find(
    (reservation) => reservation.tableId === table.id && reservation.status !== 'cancelled'
  );

  if (!activeReservation) return { text: 'Trống', tone: 'idle' };
  if (activeReservation.status === 'arrived') return { text: 'Đang phục vụ', tone: 'busy' };
  return { text: activeReservation.status === 'pending' ? 'Chờ duyệt' : 'Đã giữ', tone: 'reserved' };
}

async function readResponse(response) {
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || data.errors?.join(' ') || 'Có lỗi xảy ra.');
  return data;
}

export default function ReservationManager() {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', messages: [] });
  const [phoneQuery, setPhoneQuery] = useState('');
  const [searchPhone, setSearchPhone] = useState('');
  const [searching, setSearching] = useState(false);

  const loadData = useCallback(async () => {
    const [reservationData, tableData] = await Promise.all([
      fetch('/api/reservations', { cache: 'no-store' }).then(readResponse),
      fetch('/api/tables', { cache: 'no-store' }).then(readResponse),
    ]);
    setReservations(reservationData.reservations);
    setTables(tableData.tables);
  }, []);

  useEffect(() => {
    loadData()
      .catch((error) => setFeedback({ type: 'error', messages: [error.message] }))
      .finally(() => setLoading(false));
  }, [loadData]);

  const sortedReservations = useMemo(
    () => [...reservations].sort((left, right) => `${left.date} ${left.time}`.localeCompare(`${right.date} ${right.time}`)),
    [reservations]
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setFeedback({ type: '', messages: [] });
    try {
      const data = await readResponse(await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, tableId: form.tableId || undefined, durationMinutes: Number(form.durationMinutes), partySize: Number(form.partySize) }),
      }));
      await loadData();
      setFeedback({ type: 'success', messages: [`Đã lưu đặt bàn cho ${data.reservation.customerName} tại bàn ${data.reservation.tableId}. Đặt bàn đang chờ duyệt.`] });
      setForm(DEFAULT_FORM);
    } catch (error) {
      setFeedback({ type: 'error', messages: [error.message] });
    } finally {
      setSaving(false);
    }
  };

  const updateStatus = async (reservationId, status) => {
    setFeedback({ type: '', messages: [] });
    try {
      await readResponse(await fetch(`/api/reservations/${reservationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      }));
      await loadData();
      setFeedback({ type: 'success', messages: ['Đã lưu cập nhật đặt bàn'] });
    } catch (error) {
      setFeedback({ type: 'error', messages: [error.message] });
    }
  };

  const searchByPhone = async (event) => {
    event.preventDefault();
    const normalized = phoneQuery.trim();
    setSearching(true);
    try {
      const params = new URLSearchParams();
      if (normalized) params.set('phone', normalized);
      const data = await readResponse(await fetch(`/api/reservations?${params}`, { cache: 'no-store' }));
      setReservations(data.reservations);
      setSearchPhone(normalized);
      setFeedback({ type: 'success', messages: [normalized ? `Tìm thấy ${data.reservations.length} lượt đặt với số ${normalized}.` : 'Đang hiển thị tất cả lượt đặt bàn.'] });
    } catch (error) {
      setFeedback({ type: 'error', messages: [error.message] });
    } finally {
      setSearching(false);
    }
  };

  const today = new Date().toISOString().slice(0, 10);
  const todayCount = reservations.filter((reservation) => reservation.date === today && reservation.status !== 'cancelled').length;
  const pendingCount = reservations.filter((reservation) => reservation.status === 'pending').length;

  return (
    <section className="manager-grid" aria-label="Khối quản lý đặt bàn">
      <article className="panel form-panel">
        <h2>Tạo đặt bàn mới</h2>
        <form className="reservation-form" onSubmit={handleSubmit}>
          <label>Tên khách hàng<input required minLength="2" name="customerName" value={form.customerName} onChange={handleChange} placeholder="Nguyen Van A" /></label>
          <label>Số điện thoại<input required pattern="0[0-9]{9}" name="phone" value={form.phone} onChange={handleChange} placeholder="09xxxxxxxx" /></label>
          <div className="inline-fields">
            <label>Ngày<input required type="date" name="date" value={form.date} onChange={handleChange} /></label>
            <label>Giờ<input required type="time" name="time" value={form.time} onChange={handleChange} step="60" /></label>
          </div>
          <div className="inline-fields">
            <label>Số khách<input required type="number" min="1" name="partySize" value={form.partySize} onChange={handleChange} /></label>
            <label>Thời lượng (phút)<input required type="number" min="30" step="15" name="durationMinutes" value={form.durationMinutes} onChange={handleChange} /></label>
          </div>
          <label>Bàn mong muốn
            <select name="tableId" value={form.tableId} onChange={handleChange}>
              <option value="">Tự động chọn bàn phù hợp</option>
              {tables.map((table) => <option key={table.id} value={table.id} disabled={table.capacity < Number(form.partySize)}>Bàn {table.id} · {table.capacity} chỗ{table.capacity < Number(form.partySize) ? ' · Không đủ chỗ' : ''}</option>)}
            </select>
          </label>
          <button type="submit" disabled={saving}>{saving ? 'Đang lưu…' : 'Kiểm tra và tạo đặt bàn'}</button>
        </form>
      </article>

      <article className="panel floor-panel">
        <h2>Sơ đồ bàn</h2>
        <div className="floor-grid">
          {tables.map((table) => {
            const status = floorStatus(table, reservations);
            return <div className={`floor-item ${status.tone}`} key={table.id}><p className="floor-name">Bàn {table.id}</p><p className="floor-capacity">{table.capacity} chỗ</p><p className="floor-state">{status.text}</p></div>;
          })}
        </div>
      </article>

      <article className="panel list-panel">
        <div className="list-heading">
          <div><h2>Duyệt và quản lý đặt bàn</h2><p className="supporting-text">Hôm nay: {todayCount} lượt • Chờ duyệt: {pendingCount}</p></div>
          <button className="secondary-btn" type="button" onClick={() => loadData().catch((error) => setFeedback({ type: 'error', messages: [error.message] }))}>Tải lại</button>
        </div>
        <form className="search-form" onSubmit={searchByPhone}>
          <label htmlFor="search-phone">Tra cứu theo số điện thoại</label>
          <div className="search-controls"><input id="search-phone" type="tel" inputMode="numeric" value={phoneQuery} onChange={(event) => setPhoneQuery(event.target.value)} placeholder="Nhập số điện thoại" /><button type="submit" disabled={searching}>{searching ? 'Đang tìm' : 'Tra cứu'}</button>{searchPhone && <button className="secondary-btn" type="button" onClick={() => { setPhoneQuery(''); setSearchPhone(''); loadData().catch((error) => setFeedback({ type: 'error', messages: [error.message] })); }}>Xóa lọc</button>}</div>
        </form>
        {feedback.messages.length > 0 && <div className={`feedback ${feedback.type}`} role="status">{feedback.messages.map((message) => <p key={message}>{message}</p>)}</div>}
        <div className="table-list">
          {loading ? <p>Đang tải dữ liệu…</p> : sortedReservations.length === 0 ? <p>Không có lượt đặt bàn phù hợp.</p> : sortedReservations.map((reservation) => (
            <div className="reservation-card" key={reservation.id}>
              <header><strong>{reservation.customerName}</strong><span className={`status ${reservation.status}`}>{STATUS_LABELS[reservation.status]}</span></header>
              <p><a href={`tel:${reservation.phone}`}>{reservation.phone}</a> • {reservation.date} lúc {reservation.time}</p>
              <p>{reservation.partySize} khách • {reservation.durationMinutes} phút • Bàn {tableLabel(reservation.tableId, tables)}</p>
              <div className="actions">
                {reservation.status === 'pending' && <button type="button" onClick={() => updateStatus(reservation.id, 'confirmed')}>Duyệt đặt bàn</button>}
                {reservation.status !== 'arrived' && reservation.status !== 'cancelled' && <button type="button" onClick={() => updateStatus(reservation.id, 'arrived')}>Khách đã đến</button>}
                {reservation.status !== 'cancelled' && <button className="danger-btn" type="button" onClick={() => updateStatus(reservation.id, 'cancelled')}>Hủy bàn</button>}
              </div>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}
