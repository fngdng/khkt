import './globals.css';

export const metadata = {
  title: 'Bếp Nhà · Đặt bàn cho những cuộc hẹn',
  description:
    'Đặt bàn tại Bếp Nhà: chọn ngày giờ, gửi yêu cầu và tra cứu lịch hẹn dễ dàng bằng số điện thoại.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
