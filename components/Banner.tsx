export default function Banner() {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold mb-4">Welcome to EduPlatform</h1>
          <p className="text-xl mb-6 text-blue-100">
            Learn new skills and advance your career with our comprehensive courses
          </p>
          <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
            Explore Courses
          </button>
        </div>
      </div>
    </div>
  );
}

