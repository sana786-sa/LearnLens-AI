import Navbar from "../components/Navbar"
function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-700 via-purple-600 to-blue-500 flex items-center justify-center px-6">
<Navbar />
      <div className="max-w-5xl text-center text-white">

        <div className="mb-6">
          <span className="text-6xl">📚</span>
        </div>

        <h1 className="text-6xl font-bold mb-6">
          LearnLens AI
        </h1>

        <p className="text-xl max-w-2xl mx-auto mb-8 text-white/90">
          Your smart AI learning companion that transforms notes,
          images, and textbooks into easy explanations, summaries,
          quizzes, and personalized study plans.
        </p>

        <div className="flex justify-center gap-4">

          <button className="bg-white text-indigo-700 px-8 py-4 rounded-full font-semibold text-lg hover:scale-105 transition">
            Start Learning
          </button>

          <button className="border border-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/20 transition">
            Explore Features
          </button>

        </div>

      </div>

    </div>
  )
}

export default Landing