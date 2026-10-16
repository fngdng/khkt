import './globals.css';

export const metadata = {
  title: 'Quản lý đặt bàn nhà hàng',
  description: 'Ứng dụng quản lý đặt bàn nhà hàng cơ bản với Next.js',
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
