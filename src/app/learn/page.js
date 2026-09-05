import courses from "../../data/courses.json";
import Navbar from "../../components/Navbar";
import LessonCard from "../../components/LessonCard";

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
            <LessonCard key={i} lesson={lesson} />
          ))}
        </div>
      ))}
    </div>
  );
}
