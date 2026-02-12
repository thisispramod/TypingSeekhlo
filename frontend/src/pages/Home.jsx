import TypingArea from '../components/TypingArea';
import Navbar from '../components/Navbar';

const Home = () => {
    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-slate-800 mb-4 tracking-tight">
                        Test Your Typing Speed
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Practice touch typing in English and Hindi (Mangal InScript). Improve your WPM and Accuracy for competitive exams like SSC, CPCT, and Banking.
                    </p>
                </div>

                <div className="text-center mb-10">
                    <a href="/game" className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 md:py-4 md:text-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                        🎮 Play Typing Race Mode
                    </a>
                </div>

                <TypingArea />

                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 text-primary">
                            <span className="text-2xl font-bold">🚀</span>
                        </div>
                        <h3 className="text-lg font-bold mb-2">Speed Analysis</h3>
                        <p className="text-slate-500">Get detailed analytics of your typing speed in WPM and CPM along with accuracy percentages.</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 text-green-600">
                            <span className="text-2xl font-bold">अ</span>
                        </div>
                        <h3 className="text-lg font-bold mb-2">Hindi InScript</h3>
                        <p className="text-slate-500">Fully supports Mangal font and InScript keyboard layout for Hindi typing practice.</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 text-purple-600">
                            <span className="text-2xl font-bold">🎯</span>
                        </div>
                        <h3 className="text-lg font-bold mb-2">Exam Oriented</h3>
                        <p className="text-slate-500">Paragraphs designed to mimic actual exam patterns with varying difficulty levels.</p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Home;
