import './globals.css';

export const metadata = { title: 'THE PROP - Dashboard', description: 'MVP dashboard per prop trading' };

export default function RootLayout({ children }) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}
