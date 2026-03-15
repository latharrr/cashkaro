import "./globals.css";

export const metadata = {
  title: "CampusDeal MVP - Hyperlocal Group Buying",
  description: "Unlock bulk discounts + CashKaro cashback when your campus joins forces.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="mobile-container">
          {children}
        </div>
      </body>
    </html>
  );
}
