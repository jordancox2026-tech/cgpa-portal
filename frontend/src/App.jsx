import { useState } from "react";

function App() {
  const [search, setSearch] = useState("");
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [notFound, setNotFound] = useState(false);

  // LIVE SEARCH SUGGESTIONS
  const fetchSuggestions = async (value) => {
    setSearch(value);

    if (value.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/search?query=${value}`
      );

      const data = await response.json();

      setSuggestions(data.slice(0, 6));
    } catch (error) {
      console.log(error);
    }
  };

  // SEARCH STUDENT
  const searchStudent = async () => {
    if (!search) return;

    setLoading(true);
    setNotFound(false);

    try {
      const response = await fetch(
        `http://localhost:5000/search?query=${search}`
      );

      const data = await response.json();

      if (data.length > 0) {
        setStudent(data[0]);
        setSuggestions([]);
        setNotFound(false);
      } else {
        setStudent(null);
        setNotFound(true);
      }
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  const grades =
    student?.tables?.grade_history_combined || [];

  const cgpaDetails =
    student?.tables?.cgpa_details?.[0];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* NAVBAR */}
      <header className="border-b border-zinc-900 sticky top-0 z-50 bg-black/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black">
              CGPA Portal
            </h1>

            <p className="text-zinc-500 text-sm mt-1">
              Student Academic Dashboard
            </p>
          </div>

          <div className="hidden md:block text-zinc-500 text-sm">
            52,111 Student Records
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-10">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-black mb-5">
            Search Student Records
          </h1>

          <p className="text-zinc-500 text-lg">
            Instantly access grades, CGPA and subject history
          </p>
        </div>

        {/* SEARCH */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-4 shadow-2xl">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Search using Register Number or Student Name"
              value={search}
              onChange={(e) =>
                fetchSuggestions(e.target.value)
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  searchStudent();
                }
              }}
              className="flex-1 bg-black border border-zinc-800 rounded-2xl px-6 py-4 text-base outline-none focus:border-white transition-all"
            />

            <button
              onClick={searchStudent}
              className="bg-white text-black hover:bg-zinc-200 transition-all px-10 py-4 rounded-2xl font-bold text-base"
            >
              Search
            </button>
          </div>
        </div>

        {/* SUGGESTIONS */}
        {suggestions.length > 0 && (
          <div className="mt-4 bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
            {suggestions.map((item, index) => (
              <div
                key={index}
                onClick={() => {
                  setStudent(item);
                  setSuggestions([]);
                  setSearch(
                    item.student_information.name
                  );
                }}
                className="p-4 hover:bg-zinc-900 cursor-pointer border-b border-zinc-800 transition-all"
              >
                <div className="font-semibold text-base">
                  {item.student_information.name}
                </div>

                <div className="text-sm text-zinc-500 mt-1">
                  {
                    item.student_information
                      .register_number
                  }
                </div>
              </div>
            ))}
          </div>
        )}

        {/* LOADING */}
        {loading && (
          <div className="flex justify-center items-center gap-3 mt-10 text-zinc-400">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>

            <span className="text-lg">
              Searching student...
            </span>
          </div>
        )}

        {/* NOT FOUND */}
        {notFound && (
          <div className="text-center mt-8 text-red-400 text-lg">
            No student found
          </div>
        )}
      </section>

      {/* STUDENT DASHBOARD */}
      {student && (
        <section className="max-w-7xl mx-auto px-6 pb-20">
          {/* PROFILE */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-[2rem] p-8 mb-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">
              {/* LEFT */}
              <div>
                <p className="text-zinc-500 uppercase tracking-[4px] text-xs mb-4">
                  Student Profile
                </p>

                <h2 className="text-3xl md:text-4xl font-black mb-5">
                  {
                    student.student_information.name
                  }
                </h2>

                <div className="flex flex-wrap gap-4">
                  <div className="bg-black border border-zinc-800 px-5 py-3 rounded-2xl">
                    <span className="text-zinc-500 text-sm">
                      Register No
                    </span>

                    <div className="font-bold mt-1">
                      {
                        student.student_information
                          .register_number
                      }
                    </div>
                  </div>

                  <div className="bg-black border border-zinc-800 px-5 py-3 rounded-2xl">
                    <span className="text-zinc-500 text-sm">
                      Credits Earned
                    </span>

                    <div className="font-bold mt-1">
                      {
                        cgpaDetails?.CreditsEarned
                      }
                    </div>
                  </div>
                </div>
              </div>

              {/* CGPA */}
              <div className="bg-white text-black rounded-[2rem] px-10 py-8 text-center min-w-[220px]">
                <p className="uppercase text-xs font-bold tracking-[3px] mb-3">
                  CGPA
                </p>

                <h1 className="text-6xl font-black">
                  {cgpaDetails?.Cgpa}
                </h1>
              </div>
            </div>
          </div>

          {/* MAIN GRID */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* SUBJECTS */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-[2rem] overflow-hidden">
              <div className="p-6 border-b border-zinc-800">
                <h2 className="text-2xl font-black">
                  Subjects & Grades
                </h2>

                <p className="text-zinc-500 mt-2 text-sm">
                  Complete academic subject history
                </p>
              </div>

              <div className="max-h-[700px] overflow-y-auto">
                {grades.map((course, index) => (
                  <div
                    key={index}
                    className="p-5 border-b border-zinc-900 hover:bg-zinc-900/60 transition-all"
                  >
                    <div className="flex justify-between gap-5">
                      <div>
                        <h3 className="font-semibold text-base leading-snug">
                          {course.CourseTitle}
                        </h3>

                        <div className="flex flex-wrap gap-3 mt-3">
                          <span className="bg-black border border-zinc-800 px-3 py-1 rounded-xl text-xs text-zinc-400">
                            {course.CourseCode}
                          </span>

                          <span className="bg-black border border-zinc-800 px-3 py-1 rounded-xl text-xs text-zinc-400">
                            {course.ExamMonth}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-2xl font-black">
                          {course.Grade}
                        </div>

                        <div className="text-zinc-500 mt-2 text-sm">
                          {course.Credits} Credits
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* GRADE STATISTICS */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-[2rem] overflow-hidden h-fit">
              <div className="p-6 border-b border-zinc-800">
                <h2 className="text-2xl font-black">
                  Grade Statistics
                </h2>

                <p className="text-zinc-500 mt-2 text-sm">
                  Overall performance breakdown
                </p>
              </div>

              <div className="p-6">
                {/* GRID */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    {
                      label: "S Grades",
                      value: cgpaDetails?.SGrades,
                    },
                    {
                      label: "A Grades",
                      value: cgpaDetails?.AGrades,
                    },
                    {
                      label: "B Grades",
                      value: cgpaDetails?.BGrades,
                    },
                    {
                      label: "C Grades",
                      value: cgpaDetails?.CGrades,
                    },
                    {
                      label: "D Grades",
                      value: cgpaDetails?.DGrades,
                    },
                    {
                      label: "E Grades",
                      value: cgpaDetails?.EGrades,
                    },
                    {
                      label: "F Grades",
                      value: cgpaDetails?.FGrades,
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="bg-black border border-zinc-800 rounded-2xl px-4 py-4 flex flex-col justify-center items-center hover:border-zinc-600 transition-all"
                    >
                      <span className="text-sm text-zinc-400">
                        {item.label}
                      </span>

                      <span className="text-3xl font-black mt-2">
                        {item.value || 0}
                      </span>
                    </div>
                  ))}
                </div>

                {/* FINAL CGPA */}
                <div className="mt-8 bg-white text-black rounded-[2rem] p-8 text-center">
                  <p className="uppercase tracking-[4px] text-xs font-bold mb-4">
                    FINAL CGPA
                  </p>

                  <h1 className="text-6xl font-black">
                    {cgpaDetails?.Cgpa}
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default App;