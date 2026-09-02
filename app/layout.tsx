import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'Kodlama Macerası: İlkokul Algoritma Atölyesi',
  description: 'İlkokul öğrencileri için renkli, eğlenceli ve etkileşimli algoritma, sıralama, döngü ve koşul öğrenme platformu. Adım adım kontrol ve karar analizi.',
  openGraph: {
    title: 'Kodlama Macerası: İlkokul Algoritma Atölyesi',
    description: 'İlkokul öğrencileri için renkli, eğlenceli ve etkileşimli algoritma, sıralama, döngü ve koşul öğrenme platformu. Adım adım kontrol ve karar analizi.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kodlama Macerası: İlkokul Algoritma Atölyesi',
    description: 'İlkokul öğrencileri için renkli, eğlenceli ve etkileşimli algoritma, sıralama, döngü ve koşul öğrenme platformu. Adım adım kontrol ve karar analizi.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
