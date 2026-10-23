import ReservationManager from '../components/ReservationManager';
import Link from 'next/link';

export default function AdminPage() {
  return (
    <main className="page-shell">
      <section className="hero-surface">
        <nav className="top-nav" aria-label="Điều hướng chính">
          <p className="brand"><span>· ADMIN</span></p>
          <Link className="connection-label" href="/">Trang khách hàng</Link>
        </nav>
        <div className="hero-copy">
          <p className="eyebrow">QUẢN TRỊ NHÀ HÀNG</p>
          <h1>Duyệt đặt bàn và đón khách chu đáo</h1>
          <p>Theo dõi lịch đặt, xác nhận khách và tra cứu nhanh bằng số điện thoại.</p>
        </div>
        <div className="hero-metrics" aria-label="Chỉ số vận hành">
        </div>
      </section>
      <ReservationManager />
    </main>
  );
}
