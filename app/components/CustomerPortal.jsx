'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const STATUS_LABELS = {
  pending: 'Đang chờ nhà hàng xác nhận',
  confirmed: 'Đã xác nhận',
  arrived: 'Đã nhận bàn',
  cancelled: 'Đã hủy',
};

function getToday() {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Ho_Chi_Minh',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());
  const values = Object.fromEntries(
    parts.map(({ type, value }) => [type, value]),
  );
  return `${values.year}-${values.month}-${values.day}`;
}

async function readResponse(response) {
  const data = await response.json();
  if (!response.ok)
    throw new Error(data.message || data.errors?.join(' ') || 'Có lỗi xảy ra.');
  return data;
}

export default function CustomerPortal() {
  const [form, setForm] = useState({
    customerName: '',
    phone: '',
    date: getToday(),
    time: '18:00',
    durationMinutes: '90',
    partySize: '2',
    tableId: '',
  });
  const [tables, setTables] = useState([]);
  const [phone, setPhone] = useState('');
  const [reservations, setReservations] = useState([]);
  const [booking, setBooking] = useState(false);
  const [searching, setSearching] = useState(false);
  const [cancellingId, setCancellingId] = useState(null);
  const [feedbackTarget, setFeedbackTarget] = useState('booking');
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  useEffect(() => {
    fetch('/api/tables', { cache: 'no-store' })
      .then(readResponse)
      .then((data) => setTables(data.tables))
      .catch((error) => setFeedback({ type: 'error', message: error.message }));
  }, []);

  const updateForm = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const submitReservation = async (event) => {
    event.preventDefault();
    setFeedbackTarget('booking');
    setBooking(true);
    setFeedback({ type: '', message: '' });
    try {
      const data = await readResponse(
        await fetch('/api/reservations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...form,
            durationMinutes: Number(form.durationMinutes),
            partySize: Number(form.partySize),
          }),
        }),
      );
      setFeedback({
        type: 'success',
        message: `Đã nhận yêu cầu đặt bàn cho ${data.reservation.customerName} lúc ${data.reservation.time}, ngày ${data.reservation.date}. Nhà hàng sẽ xác nhận sớm.`,
      });
      setPhone(form.phone);
      setReservations([data.reservation]);
      setForm((current) => ({ ...current, customerName: '', phone: '' }));
    } catch (error) {
      setFeedback({ type: 'error', message: error.message });
    } finally {
      setBooking(false);
    }
  };

  const searchReservations = async (event) => {
    event.preventDefault();
    setFeedbackTarget('lookup');
    const normalizedPhone = phone.trim();
    if (!normalizedPhone) {
      setFeedback({
        type: 'error',
        message: 'Vui lòng nhập số điện thoại đã dùng khi đặt bàn.',
      });
      return;
    }
    setSearching(true);
    setFeedback({ type: '', message: '' });
    try {
      const params = new URLSearchParams({ phone: normalizedPhone });
      const data = await readResponse(
        await fetch(`/api/reservations?${params}`, { cache: 'no-store' }),
      );
      setReservations(data.reservations);
      setFeedback({
        type: data.reservations.length ? 'success' : 'info',
        message: data.reservations.length
          ? `Tìm thấy ${data.reservations.length} lượt đặt bàn với số điện thoại này.`
          : 'Chưa tìm thấy lượt đặt bàn nào với số điện thoại này.',
      });
    } catch (error) {
      setFeedback({ type: 'error', message: error.message });
    } finally {
      setSearching(false);
    }
  };

  const cancelReservation = async (reservationId) => {
    setFeedbackTarget('lookup');
    setCancellingId(reservationId);
    setFeedback({ type: '', message: '' });
    try {
      await readResponse(
        await fetch(`/api/reservations/${reservationId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'cancelled', phone: phone.replace(/\D/g, '') }),
        }),
      );
      const params = new URLSearchParams({ phone: phone.trim() });
      const data = await readResponse(
        await fetch(`/api/reservations?${params}`, { cache: 'no-store' }),
      );
      setReservations(data.reservations);
      setFeedback({ type: 'success', message: 'Đã hủy đặt bàn.' });
    } catch (error) {
      setFeedback({ type: 'error', message: error.message });
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <main className="page-shell customer-page">
      <nav className="customer-nav" aria-label="Điều hướng chính">
        <Link className="wordmark" href="/">
          <span>bếp nhà.</span>
          <small>ẨM THỰC & KẾT NỐI</small>
        </Link>
        <div className="nav-links">
          <a href="#booking">Đặt bàn</a>
          <a href="#lookup">Tra cứu đặt chỗ</a>
          <Link href="/admin" className="staff-link">
            Dành cho nhân viên{' '}
            <span className="arrow-icon" aria-hidden="true" />
          </Link>
        </div>
      </nav>
      <section className="dining-hero">
        <div className="hero-editorial">
          <p className="eyebrow">MỘT CHỖ HẸN, NHIỀU NIỀM VUI</p>
          <h1>
            Bữa ngon hơn,
            <br />
            khi có <em>nhau.</em>
          </h1>
          <p>
            Hẹn người thương, gặp bạn cũ hay quây quần bên gia đình. Để Bếp Nhà
            chuẩn bị một chiếc bàn dành riêng cho bạn.
          </p>
          <a className="primary-link" href="#booking">
            Chọn bàn cho cuộc hẹn{' '}
            <span className="arrow-icon" aria-hidden="true" />
          </a>
          <div className="hero-footnote">
            <span>01 — ĐẶT CHỖ TRỰC TUYẾN</span>
            <span>Không cần tài khoản</span>
          </div>
        </div>
        <div
          className="dining-art"
          role="img"
          aria-label="Minh họa bàn ăn với đĩa sứ, khăn và nhánh lá"
        >
          <div className="art-caption">
            THE TABLE IS SET.
            <br />
            <em>Chỉ còn chờ bạn.</em>
          </div>
          <div className="linen" />
          <div className="plate">
            <div className="plate-inner">
              <span className="leaf leaf-one" />
              <span className="leaf leaf-two" />
              <span className="leaf leaf-three" />
              <span className="leaf-stem" />
            </div>
          </div>
          <div className="cutlery fork">
            <i />
            <i />
            <i />
          </div>
          <div className="cutlery knife" />
          <div className="glass" />
          <span className="art-label">BẾP NHÀ · NHỮNG CUỘC HẸN ẤM ÁP</span>
        </div>
      </section>
      <section className="booking-promise" aria-label="Cách đặt bàn">
        <div>
          <b>01</b>
          <span>
            Chọn ngày & giờ<small>Lên lịch cho cuộc hẹn của bạn</small>
          </span>
        </div>
        <div>
          <b>02</b>
          <span>
            Gửi yêu cầu<small>Chỉ cần tên và số điện thoại</small>
          </span>
        </div>
        <div>
          <b>03</b>
          <span>
            Chờ xác nhận<small>Theo dõi ngay trên website</small>
          </span>
        </div>
      </section>
      <div className="section-intro">
        <div>
          <p className="eyebrow">CHUẨN BỊ CHO CUỘC HẸN</p>
          <h2>Giữ một chỗ, đón một niềm vui.</h2>
        </div>
        <p>Đặt bàn miễn phí · Thông tin rõ ràng</p>
      </div>
      <section className="customer-grid">
        <article className="panel booking-panel" id="booking">
          <div className="panel-title">
            <span className="section-number">01</span>
            <div>
              <h2>Đặt bàn tại Bếp Nhà</h2>
              <p className="panel-subtitle">
                Chọn thời gian, chúng mình chuẩn bị phần còn lại.
              </p>
            </div>
          </div>
          <p className="booking-note">
            Yêu cầu được giữ ở trạng thái chờ cho đến khi nhà hàng xác nhận.
          </p>
          <form className="reservation-form" onSubmit={submitReservation}>
            <label>
              Họ và tên
              <input
                autoComplete="name"
                required
                minLength="2"
                name="customerName"
                value={form.customerName}
                onChange={updateForm}
                placeholder="Nguyễn Văn A"
              />
            </label>
            <label>
              Số điện thoại
              <input
                type="tel"
                autoComplete="tel"
                required
                pattern="0[0-9]{9}"
                name="phone"
                value={form.phone}
                onChange={updateForm}
                placeholder="09xxxxxxxx"
              />
            </label>
            <div className="inline-fields">
              <label>
                Ngày
                <input
                  required
                  type="date"
                  min={getToday()}
                  name="date"
                  value={form.date}
                  onChange={updateForm}
                />
              </label>
              <label>
                Giờ
                <input
                  required
                  type="time"
                  name="time"
                  value={form.time}
                  onChange={updateForm}
                  step="900"
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
                  onChange={updateForm}
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
                  onChange={updateForm}
                />
              </label>
            </div>
            <label>
              Bàn mong muốn
              <select name="tableId" value={form.tableId} onChange={updateForm}>
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
            {feedbackTarget === 'booking' && feedback.message && (
              <p className={`feedback ${feedback.type}`} role="status">
                {feedback.message}
              </p>
            )}
            <button type="submit" disabled={booking}>
              {booking ? 'Đang gửi yêu cầu…' : 'Gửi yêu cầu đặt bàn'}
            </button>
          </form>
        </article>

        <article className="panel customer-lookup" id="lookup">
          <p className="eyebrow">ĐÃ CÓ LỊCH HẸN?</p>
          <h2>Xem lại bàn đã đặt</h2>
          <p className="panel-subtitle">
            Nhập số điện thoại bạn đã dùng khi đặt bàn để xem trạng thái.
          </p>
          <form className="search-form" onSubmit={searchReservations}>
            <label htmlFor="customer-phone">Số điện thoại</label>
            <div className="search-controls">
              <input
                id="customer-phone"
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="09xxxxxxxx"
              />
              <button type="submit" disabled={searching}>
                {searching ? 'Đang tra cứu…' : 'Tra cứu'}
              </button>
            </div>
          </form>

          {feedbackTarget === 'lookup' && feedback.message && (
            <p className={`feedback ${feedback.type}`} role="status">
              {feedback.message}
            </p>
          )}
          <div className="table-list customer-results" aria-live="polite">
            {reservations.length === 0 && (
              <div className="lookup-empty">
                <span>⌕</span>
                <p>Cuộc hẹn của bạn ở đây</p>
                <small>
                  Nhập số điện thoại để xem thông tin và trạng thái đặt bàn.
                </small>
              </div>
            )}
            {reservations.map((reservation) => (
              <article className="reservation-card" key={reservation.id}>
                <header>
                  <strong>{reservation.customerName}</strong>
                  <span className={`status ${reservation.status}`}>
                    {STATUS_LABELS[reservation.status]}
                  </span>
                </header>
                <p>
                  {reservation.date} lúc {reservation.time}
                </p>
                <p>
                  {reservation.partySize} khách · Bàn {reservation.tableId}
                </p>
                {reservation.status !== 'cancelled' && (
                  <div className="actions customer-actions">
                    <button
                      className="danger-btn"
                      type="button"
                      disabled={cancellingId === reservation.id}
                      onClick={() => cancelReservation(reservation.id)}
                    >
                      {cancellingId === reservation.id
                        ? 'Đang hủy…'
                        : 'Hủy đặt bàn'}
                    </button>
                  </div>
                )}
              </article>
            ))}
          </div>
          <p className="privacy-note">
            Thông tin đặt bàn được tra cứu từ số điện thoại bạn cung cấp.
          </p>
        </article>
      </section>
      <footer className="site-footer">
        <span className="wordmark">
          bếp <span>nhà.</span>
        </span>
        <p>Mỗi cuộc hẹn, một chút ấm áp.</p>
        <span>Hẹn gặp bạn tại bàn ăn.</span>
      </footer>
    </main>
  );
}
