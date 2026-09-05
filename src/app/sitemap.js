const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default function sitemap() {
  return ["", "/learn", "/train", "/civic", "/leaderboard", "/login", "/signup"].map(
    (path) => ({
      url: `${BASE_URL}${path}`,
      changeFrequency: "weekly",
    })
  );
}
