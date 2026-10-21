import Link from 'next/link';
import ReservationManager from '../components/ReservationManager';

export default function AdminPage() {
  return (
    <main className="admin-layout">
      <aside className="admin-sidebar">
        <Link className="wordmark" href="/">
          bếp<span>nhà.</span>
          <small>KHÔNG GIAN QUẢN TRỊ</small>
        </Link>
        <p className="sidebar-label">VẬN HÀNH NHÀ HÀNG</p>
        <nav aria-label="Điều hướng quản trị">
          <a className="active" href="#reservations">
            ▤ <span>Sổ đặt bàn</span>
          </a>
          <a href="#floor">
            ▦ <span>Sơ đồ bàn</span>
          </a>
          <a href="#new-booking">
            ＋ <span>Tạo đặt bàn</span>
          </a>
        </nav>
        <div className="sidebar-bottom">
          <p>Chu đáo từ lúc đặt bàn.</p>
          <Link href="/">
            Về trang khách hàng{' '}
            <span className="arrow-icon" aria-hidden="true" />
          </Link>
        </div>
      </aside>
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
        <ReservationManager />
      </div>
    </main>
  );
}
