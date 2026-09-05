import "../styles/globals.css";

export const metadata = {
  title: "Know Your Rights AI",
  description: "Civic education for real-world application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="container">
          {children}
        </div>
      </body>
    </html>
  );
}