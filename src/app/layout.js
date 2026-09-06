import "../styles/globals.css";
import AuthProvider from "../components/auth/AuthProvider";
import Navbar from "../components/Navbar";

export const metadata = {
  title: "Know Your Rights AI",
  description: "Civic education for real-world application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <div className="container">
            <Navbar />
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
