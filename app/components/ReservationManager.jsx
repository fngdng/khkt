'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

const DEFAULT_FORM = {
  customerName: '',
  phone: '',
  date: '',
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
  const matches = reservations.filter(
    (reservation) =>
      reservation.tableId === table.id && reservation.status !== 'cancelled',
  );
  const activeReservation =
    matches.find((reservation) => reservation.status === 'arrived') ||
    matches.find((reservation) => reservation.status === 'confirmed') ||
    matches[0];

  if (!activeReservation) return { text: 'Chưa có lịch', tone: 'idle' };
  if (activeReservation.status === 'arrived')
    return { text: 'Đang phục vụ', tone: 'busy' };
  return {
    text: activeReservation.status === 'pending' ? 'Chờ duyệt' : 'Đã giữ',
    tone: 'reserved',
  };
}

async function readResponse(response) {
  const data = await response.json();
  if (!response.ok)
    throw new Error(data.message || data.errors?.join(' ') || 'Có lỗi xảy ra.');
  return data;
}

function localToday() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Ho_Chi_Minh',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

export default function ReservationManager() {
  const [form, setForm] = useState(() => ({
    ...DEFAULT_FORM,
    date: localToday(),
  }));
  const [reservations, setReservations] = useState([]);
  const [waitlist, setWaitlist] = useState([]);
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', messages: [] });
  const [phoneQuery, setPhoneQuery] = useState('');
  const [searchPhone, setSearchPhone] = useState('');
  const [searching, setSearching] = useState(false);
  const [selectedDate, setSelectedDate] = useState(localToday);
  const [statusFilter, setStatusFilter] = useState('all');
  const [updatingId, setUpdatingId] = useState(null);

  const loadData = useCallback(async () => {
    const [reservationData, tableData] = await Promise.all([
      fetch('/api/reservations', { cache: 'no-store' }).then(readResponse),
      fetch('/api/tables', { cache: 'no-store' }).then(readResponse),
    ]);
    return { reservations: reservationData.reservations, waitlist: reservationData.waitlist || [], tables: tableData.tables };
  }, []);

  const refreshData = useCallback(async () => {
    const data = await loadData();
    setReservations(data.reservations);
    setWaitlist(data.waitlist);
    setTables(data.tables);
  }, [loadData]);

  useEffect(() => {
    loadData()
      .then(({ reservations: nextReservations, waitlist: nextWaitlist, tables: nextTables }) => {
        setReservations(nextReservations);
        setWaitlist(nextWaitlist);
        setTables(nextTables);
      })
      .catch((error) => setFeedback({ type: 'error', messages: [error.message] }))
      .finally(() => setLoading(false));
  }, [loadData]);

  const sortedReservations = useMemo(
    () =>
      reservations
        .filter(
          (row) =>
            (!selectedDate || row.date === selectedDate) &&
            (statusFilter === 'all' || row.status === statusFilter) &&
            (!searchPhone || row.phone === searchPhone),
        )
        .sort((left, right) =>
          `${left.date} ${left.time}`.localeCompare(
            `${right.date} ${right.time}`,
          ),
        ),
    [reservations, selectedDate, statusFilter, searchPhone],
  );

  const sortedWaitlist = useMemo(
    () => waitlist.filter((row) =>
      (!selectedDate || row.date === selectedDate) &&
      (!searchPhone || row.phone === searchPhone) &&
      !['cancelled', 'converted'].includes(row.status),
    ).sort((left, right) => `${left.date} ${left.time}`.localeCompare(`${right.date} ${right.time}`)),
    [waitlist, selectedDate, searchPhone],
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
      await refreshData();
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
    setUpdatingId(reservationId);
    try {
      await readResponse(await fetch(`/api/reservations/${reservationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      }));
      await refreshData();
      setFeedback({ type: 'success', messages: ['Đã lưu cập nhật đặt bàn'] });
    } catch (error) {
      setFeedback({ type: 'error', messages: [error.message] });
    } finally {
      setUpdatingId(null);
    }
  };

  const updateWaitlistStatus = async (entryId, status) => {
    setUpdatingId(`wait-${entryId}`);
    try {
      await readResponse(await fetch(`/api/waitlist/${entryId}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }),
      }));
      await refreshData();
      setFeedback({ type: 'success', messages: ['Đã cập nhật danh sách chờ'] });
    } catch (error) {
      setFeedback({ type: 'error', messages: [error.message] });
    } finally { setUpdatingId(null); }
  };

  const searchByPhone = async (event) => {
    event.preventDefault();
    setSearching(true);
    try {
      await loadData();
      setSearchPhone(phoneQuery.trim());
    } catch (error) {
      setFeedback({ type: 'error', messages: [error.message] });
    } finally {
      setSearching(false);
    }
  };

  const today = localToday();
  const dayReservations = reservations.filter(
    (row) => row.date === selectedDate,
  );
  const todayCount = reservations.filter(
    (reservation) =>
      reservation.date === today && reservation.status !== 'cancelled',
  ).length;
  const pendingCount = reservations.filter(
    (reservation) => reservation.status === 'pending',
  ).length;

  return (
    <section className="manager-grid" aria-label="Khối quản lý đặt bàn">
      <div className="dashboard-metrics">
        <article>
          <span>Đặt bàn hôm nay</span>
          <strong>{loading ? '—' : todayCount}</strong>
          <small>Lượt chưa hủy</small>
        </article>
        <article>
          <span>Chờ xác nhận</span>
          <strong>{loading ? '—' : pendingCount}</strong>
          <small>Tất cả ngày đặt</small>
        </article>
        <article>
          <span>Sức chứa nhà hàng</span>
          <strong>
            {loading
              ? '—'
              : tables.reduce((sum, table) => sum + table.capacity, 0)}
            <em> chỗ</em>
          </strong>
          <small>{tables.length} bàn trong hệ thống</small>
        </article>
      </div>
      {feedback.messages.length > 0 && (
        <div
          className={`feedback manager-feedback ${feedback.type}`}
          role="status"
        >
          {feedback.messages.map((message) => (
            <p key={message}>{message}</p>
          ))}
        </div>
      )}
      <article className="panel form-panel" id="new-booking">
        <h2>Tạo đặt bàn mới</h2>
        <form className="reservation-form" onSubmit={handleSubmit}>
          <label>
            Tên khách hàng
            <input
              required
              minLength="2"
              name="customerName"
              value={form.customerName}
              onChange={handleChange}
              placeholder="Nguyễn Văn An"
            />
          </label>
          <label>
            Số điện thoại
            <input
              required
              pattern="0[0-9]{9}"
              type="tel"
              autoComplete="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="09xxxxxxxx"
            />
          </label>
          <div className="inline-fields">
            <label>
              Ngày
              <input
                required
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
              />
            </label>
            <label>
              Giờ
              <input
                required
                type="time"
                name="time"
                value={form.time}
                onChange={handleChange}
                step="60"
              />
            </label>
          </div>
          <div className="inline-fields">
            <label>
              Số khách
              <input
                required
                type="number"
                min="1"
                name="partySize"
                value={form.partySize}
                onChange={handleChange}
              />
            </label>
            <label>
              Thời lượng (phút)
              <input
                required
                type="number"
                min="30"
                step="15"
                name="durationMinutes"
                value={form.durationMinutes}
                onChange={handleChange}
              />
            </label>
          </div>
          <label>
            Bàn mong muốn
            <select name="tableId" value={form.tableId} onChange={handleChange}>
              <option value="">Tự động chọn bàn phù hợp</option>
              {tables.map((table) => (
                <option
                  key={table.id}
                  value={table.id}
                  disabled={table.capacity < Number(form.partySize)}
                >
                  Bàn {table.id} · {table.capacity} chỗ
                  {table.capacity < Number(form.partySize)
                    ? ' · Không đủ chỗ'
                    : ''}
                </option>
              ))}
            </select>
          </label>
          <button type="submit" disabled={saving}>
            {saving ? 'Đang lưu…' : 'Kiểm tra và tạo đặt bàn'}
          </button>
        </form>
      </article>
      <article className="panel list-panel waitlist-panel" id="waitlist">
        <div className="list-heading"><div><p className="eyebrow">KHÔNG CÒN BÀN TRỐNG?</p><h2>Danh sách chờ</h2><p className="supporting-text">Khách sẽ được giữ lại khi khung giờ đã đầy.</p></div><span className="workspace-badge">{sortedWaitlist.length} lượt đang chờ</span></div>
        <div className="table-list">
          {sortedWaitlist.length === 0 ? <p>Không có khách đang chờ trong bộ lọc hiện tại.</p> : sortedWaitlist.map((entry) => (
            <div className="reservation-card" key={`wait-${entry.id}`}>
              <header><strong>{entry.customerName}</strong><span className="status waiting">Đang chờ</span></header>
              <p><a href={`tel:${entry.phone}`}>{entry.phone}</a> • {entry.date} lúc {entry.time}</p>
              <p>{entry.partySize} khách • {entry.durationMinutes} phút • Chưa được xếp bàn</p>
              <div className="actions">
                <button type="button" disabled={updatingId === `wait-${entry.id}`} onClick={() => updateWaitlistStatus(entry.id, 'notified')}>Đã liên hệ khách</button>
                <button className="danger-btn" type="button" disabled={updatingId === `wait-${entry.id}`} onClick={() => updateWaitlistStatus(entry.id, 'cancelled')}>Xóa khỏi danh sách</button>
              </div>
            </div>
          ))}
        </div>
      </article>

      <article className="panel floor-panel" id="floor">
        <div className="list-heading">
          <div>
            <p className="eyebrow">KHÔNG GIAN ĐÓN KHÁCH</p>
            <h2>Sơ đồ bàn</h2>
          </div>
          <span className="floor-date">{selectedDate || 'Tất cả ngày'}</span>
        </div>
        <p className="panel-subtitle">
          Tổng hợp lịch đặt trong ngày đã chọn, không biểu thị bàn trống theo
          giờ.
        </p>
        <div className="floor-grid">
          {tables.map((table) => {
            const status = floorStatus(
              table,
              selectedDate ? dayReservations : reservations,
            );
            return (
              <div className={`floor-item ${status.tone}`} key={table.id}>
                <p className="floor-name">Bàn {table.id}</p>
                <p className="floor-capacity">{table.capacity} chỗ</p>
                <p className="floor-state">{status.text}</p>
              </div>
            );
          })}
        </div>
        <p className="floor-legend">
          <span>○ Chưa có lịch</span>
          <span>◷ Có đặt bàn</span>
          <span>● Khách đã đến</span>
        </p>
      </article>

      <article className="panel list-panel" id="reservations">
        <div className="list-heading">
          <div><h2>Duyệt và quản lý đặt bàn</h2><p className="supporting-text">Hôm nay: {todayCount} lượt • Chờ duyệt: {pendingCount}</p></div>
          <button className="secondary-btn" type="button" onClick={() => refreshData().catch((error) => setFeedback({ type: 'error', messages: [error.message] }))}>Tải lại</button>
        </div>
        <form className="search-form" onSubmit={searchByPhone}>
          <label htmlFor="search-phone">Tra cứu theo số điện thoại</label>
          <div className="search-controls"><input id="search-phone" type="tel" inputMode="numeric" value={phoneQuery} onChange={(event) => setPhoneQuery(event.target.value)} placeholder="Nhập số điện thoại" /><button type="submit" disabled={searching}>{searching ? 'Đang tìm' : 'Tra cứu'}</button>{searchPhone && <button className="secondary-btn" type="button" onClick={() => { setPhoneQuery(''); setSearchPhone(''); refreshData().catch((error) => setFeedback({ type: 'error', messages: [error.message] })); }}>Xóa lọc</button>}</div>
        </form>
        <div className="table-list">
          {loading ? (
            <p>Đang tải dữ liệu…</p>
          ) : sortedReservations.length === 0 ? (
            <p>Không có lượt đặt bàn phù hợp.</p>
          ) : (
            sortedReservations.map((reservation) => (
              <div className="reservation-card" key={reservation.id}>
                <header>
                  <strong>{reservation.customerName}</strong>
                  <span className={`status ${reservation.status}`}>
                    {STATUS_LABELS[reservation.status]}
                  </span>
                </header>
                <p>
                  <a href={`tel:${reservation.phone}`}>{reservation.phone}</a> •{' '}
                  {reservation.date} lúc {reservation.time}
                </p>
                <p>
                  {reservation.partySize} khách • {reservation.durationMinutes}{' '}
                  phút • Bàn {tableLabel(reservation.tableId, tables)}
                </p>
                <div className="actions">
                  {reservation.status === 'pending' && (
                    <button
                      type="button"
                      disabled={updatingId === reservation.id}
                      onClick={() => updateStatus(reservation.id, 'confirmed')}
                    >
                      Duyệt đặt bàn
                    </button>
                  )}
                  {reservation.status !== 'arrived' &&
                    reservation.status !== 'cancelled' && (
                      <button
                        type="button"
                        disabled={updatingId === reservation.id}
                        onClick={() => updateStatus(reservation.id, 'arrived')}
                      >
                        Khách đã đến
                      </button>
                    )}
                  {reservation.status !== 'cancelled' && (
                    <button
                      className="danger-btn"
                      type="button"
                      disabled={updatingId === reservation.id}
                      onClick={() => updateStatus(reservation.id, 'cancelled')}
                    >
                      Hủy bàn
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </article>
    </section>
  );
}
