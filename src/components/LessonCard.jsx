export default function LessonCard({ lesson }) {
  if (!lesson) return null;

  return (
    <div style={{ border: "1px solid #ccc", padding: 16, marginBottom: 16 }}>
      <h3>{lesson.title}</h3>

      <p><strong>Explanation:</strong> {lesson.explanation}</p>
      <p><strong>When:</strong> {lesson.when_applies}</p>
      <p><strong>Example:</strong> {lesson.example}</p>
      <p><strong>Risk:</strong> {lesson.risk}</p>
      <p><strong>Do:</strong> {lesson.action}</p>

      <div style={{ marginTop: 10, fontWeight: "bold" }}>
        👉 &ldquo;{lesson.script}&rdquo;
      </div>
    </div>
  );
}