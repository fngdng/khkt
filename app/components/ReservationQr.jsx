'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import QRCode from 'qrcode';

export default function ReservationQr({ phone, label = 'Mã QR tra cứu' }) {
  const [src, setSrc] = useState('');
  useEffect(() => {
    let active = true;
    const url = `${window.location.origin}/?phone=${encodeURIComponent(phone)}#lookup`;
    QRCode.toDataURL(url, { width: 180, margin: 2, color: { dark: '#203d34', light: '#ffffff' } })
      .then((dataUrl) => { if (active) setSrc(dataUrl); });
    return () => { active = false; };
  }, [phone]);
  if (!src) return <span className="qr-loading">Đang tạo QR…</span>;
  return (
    <div className="reservation-qr">
      <Image src={src} alt={`${label} cho số điện thoại ${phone}`} width={82} height={82} unoptimized />
      <div><small>{label}</small><a href={src} download="bep-nha-tra-cuu.png">Tải mã QR</a></div>
    </div>
  );
}
