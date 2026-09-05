import 'react-toastify/dist/ReactToastify.css';
import '../src/index.css';
import '../src/App.css';
import '../src/Navbar.css';
import ClientLayout from '../src/ClientLayout';

export const metadata = {
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
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/images/logoicon.png" type="image/png" />
        <link rel="shortcut icon" href="/images/logoicon.png" />
        <link rel="apple-touch-icon" href="/logo192.png" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
