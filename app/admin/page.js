import Link from 'next/link';
import AdminGate from '../components/AdminGate';

export default function AdminPage() {
  return (
    <main className="page-shell">
      <section className="hero-surface">
        <nav className="top-nav" aria-label="Điều hướng chính">
          <p className="brand"><span>· ADMIN</span></p>
          <Link className="connection-label" href="/">Trang khách hàng</Link>
        </nav>
        <div className="sidebar-bottom">
          <p>Chu đáo từ lúc đặt bàn.</p>
          <Link href="/">
            Về trang khách hàng{' '}
            <span className="arrow-icon" aria-hidden="true" />
          </Link>
        </div>
      </section>
      <div className="admin-main">
        <header className="admin-header">
          <div>
            <p className="eyebrow">TỔNG QUAN VẬN HÀNH</p>
            <h1>Sổ đặt bàn</h1>
            <p>Mỗi vị khách đều xứng đáng được đón tiếp chu đáo.</p>
          </div>
          <span className="workspace-badge">
            Bếp Nhà <small>Không gian nhân viên</small>
          </span>
        </header>
        <AdminGate />
      </div>
    </main>
  );
}
