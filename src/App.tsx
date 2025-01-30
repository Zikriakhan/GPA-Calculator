import React, { useState } from 'react';
import { PlusCircle, Trash2, Calculator, BookOpen, GraduationCap } from 'lucide-react';

interface Course {
  id: number;
  name: string;
  credits: number;
  grade: string;
}

interface Semester {
  id: number;
  courses: Course[];
}

function App() {
  const [semesters, setSemesters] = useState<Semester[]>([
    { id: 1, courses: [] }
  ]);
  const [activeTab, setActiveTab] = useState<'gpa' | 'cgpa'>('gpa');

  const gradePoints: { [key: string]: number } = {
    'A': 4.0, 'A-': 3.7,
    'B+': 3.3, 'B': 3.0, 'B-': 2.7,
    'C+': 2.3, 'C': 2.0, 'C-': 1.7,
    'D+': 1.3, 'D': 1.0, 'F': 0.0
  };

  const addCourse = (semesterId: number) => {
    setSemesters(semesters.map(sem => {
      if (sem.id === semesterId) {
        return {
          ...sem,
          courses: [...sem.courses, {
            id: Date.now(),
            name: '',
            credits: 3,
            grade: 'A'
          }]
        };
      }
      return sem;
    }));
  };

  const updateCourse = (semesterId: number, courseId: number, field: keyof Course, value: string | number) => {
    setSemesters(semesters.map(sem => {
      if (sem.id === semesterId) {
        return {
          ...sem,
          courses: sem.courses.map(course => {
            if (course.id === courseId) {
              return { ...course, [field]: value };
            }
            return course;
          })
        };
      }
      return sem;
    }));
  };

  const deleteCourse = (semesterId: number, courseId: number) => {
    setSemesters(semesters.map(sem => {
      if (sem.id === semesterId) {
        return {
          ...sem,
          courses: sem.courses.filter(course => course.id !== courseId)
        };
      }
      return sem;
    }));
  };

  const addSemester = () => {
    setSemesters([...semesters, {
      id: Date.now(),
      courses: []
    }]);
  };

  const calculateGPA = (courses: Course[]) => {
    if (courses.length === 0) return 0;
    
    const totalPoints = courses.reduce((sum, course) => 
      sum + (course.credits * gradePoints[course.grade]), 0);
    const totalCredits = courses.reduce((sum, course) => sum + course.credits, 0);
    
    return totalCredits === 0 ? 0 : Number((totalPoints / totalCredits).toFixed(2));
  };

  const calculateCGPA = () => {
    const allCourses = semesters.flatMap(sem => sem.courses);
    return calculateGPA(allCourses);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-xl p-6 md:p-8">
          <div className="flex items-center justify-center gap-4 mb-8">
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <GraduationCap className="text-purple-600" size={32} />
              GPA Calculator
            </h1>
          </div>

          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setActiveTab('gpa')}
              className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors ${
                activeTab === 'gpa'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <BookOpen size={20} />
              Semester GPA
            </button>
            <button
              onClick={() => setActiveTab('cgpa')}
              className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors ${
                activeTab === 'cgpa'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Calculator size={20} />
              CGPA
            </button>
          </div>

          {semesters.map((semester, index) => (
            <div key={semester.id} className="mb-8">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Semester {index + 1}
              </h2>
              
              <div className="space-y-4">
                {semester.courses.map(course => (
                  <div key={course.id} className="flex gap-4 items-center">
                    <input
                      type="text"
                      placeholder="Course Name"
                      value={course.name}
                      onChange={(e) => updateCourse(semester.id, course.id, 'name', e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <input
                      type="number"
                      min="1"
                      max="6"
                      value={course.credits}
                      onChange={(e) => updateCourse(semester.id, course.id, 'credits', Number(e.target.value))}
                      className="w-20 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <select
                      value={course.grade}
                      onChange={(e) => updateCourse(semester.id, course.id, 'grade', e.target.value)}
                      className="w-24 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      {Object.keys(gradePoints).map(grade => (
                        <option key={grade} value={grade}>{grade}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => deleteCourse(semester.id, course.id)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={() => addCourse(semester.id)}
                className="mt-4 text-purple-600 hover:text-purple-700 flex items-center gap-2"
              >
                <PlusCircle size={20} />
                Add Course
              </button>

              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-lg font-semibold text-gray-700">
                  Semester GPA: {calculateGPA(semester.courses)}
                </p>
              </div>
            </div>
          ))}

          {activeTab === 'cgpa' && (
            <div className="mt-6 p-6 bg-purple-50 rounded-lg">
              <h2 className="text-2xl font-bold text-purple-800 mb-2">
                Cumulative GPA (CGPA)
              </h2>
              <p className="text-3xl font-bold text-purple-600">
                {calculateCGPA()}
              </p>
            </div>
          )}

          <button
            onClick={addSemester}
            className="mt-6 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors duration-200 flex items-center gap-2"
          >
            <PlusCircle size={20} />
            Add Semester
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;