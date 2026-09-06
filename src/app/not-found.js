import Link from "next/link";

export default function NotFound() {
  return (
    <div className="card">
      <h1>Page not found</h1>
      <p>That page doesn&apos;t exist — but your rights still do.</p>
      <Link href="/" className="btn">Back Home</Link>
    </div>
  );
}
