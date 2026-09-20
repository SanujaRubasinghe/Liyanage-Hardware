import 'react-toastify/dist/ReactToastify.css';
import 'react-image-crop/dist/ReactCrop.css';
import 'react-datepicker/dist/react-datepicker.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../src/index.css';
import '../src/App.css';
import '../src/Navbar.css';
import '../src/AdminPanel/index.css';
import '../src/AdminPanel/App.css';
import ClientLayout from '../src/ClientLayout';

export const metadata = {
  metadataBase: new URL('https://newliyanagehardware.lk'),
  title: 'New Liyanage Hardware',
  description: 'Your trusted partner for all construction and home improvement needs in Sri Lanka.',
  icons: {
    icon: [
      { url: '/images/logoicon.png', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    shortcut: '/images/logoicon.png',
    apple: '/logo192.png',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
