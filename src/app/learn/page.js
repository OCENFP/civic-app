import courses from "../../data/courses.json";
import Navbar from "../../components/Navbar";

export default function Learn() {
  const course = courses[0];

  return (
    <div>
      <Navbar />

      <h1>{course.title}</h1>
      <p>{course.description}</p>

      {course.modules.map((module) => (
        <div key={module.id}>
          <h2>{module.title}</h2>

          {module.lessons.map((lesson, i) => (
            <div key={i} className="card">
              <h3>{lesson.title}</h3>
              <p><span className="label">Explanation:</span> {lesson.explanation}</p>
              <p><span className="label">When:</span> {lesson.when_applies}</p>
              <p><span className="label">Example:</span> {lesson.example}</p>
              <p><span className="label">Risk:</span> {lesson.risk}</p>
              <p><span className="label">Do:</span> {lesson.action}</p>
              <p><span className="label">Say:</span> &ldquo;{lesson.script}&rdquo;</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}