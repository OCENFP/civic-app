import courses from "../../data/courses.json";
import LessonCard from "../../components/LessonCard";
import StateLawCard from "../../components/StateLawCard";

export default function Learn() {
  return (
    <div>
      {courses.map((course, ci) => (
        <div key={course.id ?? ci}>
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
      ))}

      <StateLawCard />
    </div>
  );
}
