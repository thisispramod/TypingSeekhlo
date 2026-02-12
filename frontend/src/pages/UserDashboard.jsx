import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';

const UserDashboard = () => {
    const [reports, setReports] = useState([]);
    const [customParagraphs, setCustomParagraphs] = useState([]);
    const [newText, setNewText] = useState({ title: '', content: '' });
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [reportsRes, customRes] = await Promise.all([
                api.get('/user/reports'),
                api.get('/user/custom-paragraphs')
            ]);
            setReports(reportsRes.data);
            setCustomParagraphs(customRes.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleTextSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            await api.post('/user/custom-paragraphs', newText);
            setNewText({ title: '', content: '' });
            setMessage('Text added successfully!');
            fetchData(); // Refresh list
        } catch (error) {
            setMessage('Failed to add text.');
        }
    };

    const startCustomGame = (text) => {
        // We can pass the text via state to the game location
        navigate('/game', { state: { customText: text } });
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <div className="max-w-6xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-slate-800 mb-8">My Dashboard</h1>

                {/* Progress Section */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 mb-8">
                    <h2 className="text-xl font-bold text-slate-700 mb-4">Daily Improvement Report</h2>
                    {reports.length === 0 ? (
                        <p className="text-slate-500">No practice sessions yet.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-slate-100">
                                        <th className="pb-3 font-semibold text-slate-600">Date</th>
                                        <th className="pb-3 font-semibold text-slate-600">WPM</th>
                                        <th className="pb-3 font-semibold text-slate-600">Accuracy</th>
                                        <th className="pb-3 font-semibold text-slate-600">Source</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reports.map((report) => (
                                        <tr key={report.id} className="border-b border-slate-50 hover:bg-slate-50">
                                            <td className="py-3 text-slate-600">{new Date(report.test_date).toLocaleDateString()}</td>
                                            <td className="py-3 font-bold text-primary">{report.wpm}</td>
                                            <td className="py-3 text-green-600">{report.accuracy}%</td>
                                            <td className="py-3 text-slate-500 text-sm capitalize">{report.source}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Add Custom Text */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                        <h2 className="text-xl font-bold text-slate-700 mb-4">Upload Custom Practice Text</h2>
                        {message && <div className="mb-4 text-green-600 text-sm font-medium">{message}</div>}
                        <form onSubmit={handleTextSubmit}>
                            <div className="mb-4">
                                <label className="block text-slate-600 text-sm font-medium mb-1">Title</label>
                                <input
                                    type="text"
                                    value={newText.title}
                                    onChange={(e) => setNewText({ ...newText, title: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                                    placeholder="e.g. My Favorite Poem"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-slate-600 text-sm font-medium mb-1">Text Content</label>
                                <textarea
                                    value={newText.content}
                                    onChange={(e) => setNewText({ ...newText, content: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none h-32"
                                    placeholder="Paste your text here..."
                                    required
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                className="w-full py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors"
                            >
                                Save Text
                            </button>
                        </form>
                    </div>

                    {/* Custom Texts List */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                        <h2 className="text-xl font-bold text-slate-700 mb-4">My Custom Texts</h2>
                        {customParagraphs.length === 0 ? (
                            <p className="text-slate-500">No custom texts added.</p>
                        ) : (
                            <div className="space-y-3">
                                {customParagraphs.map((text) => (
                                    <div key={text.id} className="p-3 border border-slate-100 rounded-lg flex justify-between items-center hover:bg-slate-50">
                                        <div>
                                            <h3 className="font-medium text-slate-800">{text.title}</h3>
                                            <p className="text-xs text-slate-500">{new Date(text.created_at).toLocaleDateString()}</p>
                                        </div>
                                        <button
                                            onClick={() => startCustomGame(text)}
                                            className="px-3 py-1 bg-primary text-white text-sm rounded-md hover:bg-blue-600"
                                        >
                                            Practice
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
