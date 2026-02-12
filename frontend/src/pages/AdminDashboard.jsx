import { useState, useEffect } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const [view, setView] = useState('paragraphs'); // paragraphs | reports
    const [paragraphs, setParagraphs] = useState([]);
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentPara, setCurrentPara] = useState({ paragraph_text: '', language: 'english', difficulty: 'medium', status: 'active' });
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) navigate('/login');
        if (view === 'paragraphs') fetchParagraphs();
        if (view === 'reports') fetchReports();
    }, [view]);

    const fetchParagraphs = async () => {
        setLoading(true);
        try {
            const res = await api.get('/paragraphs');
            setParagraphs(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Failed to fetch paragraphs");
            if (err.response?.status === 401 || err.response?.status === 403) navigate('/login');
            setLoading(false);
        }
    };

    const fetchReports = async () => {
        setLoading(true);
        try {
            const res = await api.get('/user/admin/reports');
            setReports(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Failed to fetch reports");
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this paragraph?")) return;
        try {
            await api.delete(`/paragraphs/${id}`);
            fetchParagraphs();
        } catch (err) {
            alert("Failed to delete");
        }
    };

    const handleEdit = (para) => {
        setCurrentPara(para);
        setIsEditing(true);
        // Scroll to form
        document.getElementById('para-form').scrollIntoView({ behavior: 'smooth' });
    };

    const handleReset = () => {
        setCurrentPara({ paragraph_text: '', language: 'english', difficulty: 'medium', status: 'active' });
        setIsEditing(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await api.put(`/paragraphs/${currentPara.id}`, currentPara);
            } else {
                await api.post('/paragraphs', currentPara);
            }
            fetchParagraphs();
            handleReset();
        } catch (err) {
            console.error(err);
            alert("Operation failed");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-slate-800">Admin Dashboard</h1>
                    <div className="flex bg-white p-1 rounded-lg border border-slate-200">
                        <button
                            onClick={() => setView('paragraphs')}
                            className={`px-4 py-2 rounded-md transition-colors ${view === 'paragraphs' ? 'bg-primary text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}
                        >
                            Paragraphs
                        </button>
                        <button
                            onClick={() => setView('reports')}
                            className={`px-4 py-2 rounded-md transition-colors ${view === 'reports' ? 'bg-primary text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}
                        >
                            User Reports
                        </button>
                    </div>
                </div>

                {view === 'paragraphs' ? (
                    <>
                        {/* Form Section */}
                        <div id="para-form" className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 mb-8">
                            <h2 className="text-xl font-bold mb-4 text-slate-700">{isEditing ? 'Edit Paragraph' : 'Add New Paragraph'}</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-600 mb-1">Language</label>
                                        <select
                                            className="w-full px-3 py-2 border rounded-md"
                                            value={currentPara.language}
                                            onChange={(e) => setCurrentPara({ ...currentPara, language: e.target.value })}
                                        >
                                            <option value="english">English</option>
                                            <option value="hindi">Hindi</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-600 mb-1">Difficulty</label>
                                        <select
                                            className="w-full px-3 py-2 border rounded-md"
                                            value={currentPara.difficulty}
                                            onChange={(e) => setCurrentPara({ ...currentPara, difficulty: e.target.value })}
                                        >
                                            <option value="easy">Easy</option>
                                            <option value="medium">Medium</option>
                                            <option value="hard">Hard</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-600 mb-1">Status</label>
                                        <select
                                            className="w-full px-3 py-2 border rounded-md"
                                            value={currentPara.status}
                                            onChange={(e) => setCurrentPara({ ...currentPara, status: e.target.value })}
                                        >
                                            <option value="active">Active</option>
                                            <option value="disabled">Disabled</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-slate-600 mb-1">Paragraph Text</label>
                                    <textarea
                                        className={`w-full h-32 p-3 border rounded-md resize-y ${currentPara.language === 'hindi' ? 'mangal-font' : ''}`}
                                        value={currentPara.paragraph_text}
                                        onChange={(e) => setCurrentPara({ ...currentPara, paragraph_text: e.target.value })}
                                        required
                                        placeholder="Paste or type paragraph text here..."
                                    ></textarea>
                                </div>
                                <div className="flex gap-4">
                                    <button type="submit" className="px-6 py-2 bg-primary text-white font-medium rounded-lg hover:bg-blue-600 transition-colors">
                                        {isEditing ? 'Update Paragraph' : 'Add Paragraph'}
                                    </button>
                                    {isEditing && (
                                        <button type="button" onClick={handleReset} className="px-6 py-2 bg-slate-100 text-slate-600 font-medium rounded-lg hover:bg-slate-200 transition-colors">
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>

                        {/* List Section */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-50 border-b border-slate-200">
                                        <tr>
                                            <th className="px-6 py-4 font-semibold text-slate-600">ID</th>
                                            <th className="px-6 py-4 font-semibold text-slate-600 w-1/2">Preview</th>
                                            <th className="px-6 py-4 font-semibold text-slate-600">Language</th>
                                            <th className="px-6 py-4 font-semibold text-slate-600">Difficulty</th>
                                            <th className="px-6 py-4 font-semibold text-slate-600">Status</th>
                                            <th className="px-6 py-4 font-semibold text-slate-600">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {loading ? (
                                            <tr><td colSpan="6" className="text-center p-8">Loading...</td></tr>
                                        ) : paragraphs.map((para) => (
                                            <tr key={para.id} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-4 text-slate-500">{para.id}</td>
                                                <td className={`px-6 py-4 text-slate-700 truncate max-w-xs ${para.language === 'hindi' ? 'mangal-font' : ''}`}>{para.paragraph_text.substring(0, 100)}...</td>
                                                <td className="px-6 py-4 text-slate-600 capitalize">{para.language}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 text-xs rounded-full ${para.difficulty === 'hard' ? 'bg-red-100 text-red-600' : para.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600'}`}>
                                                        {para.difficulty}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 text-xs rounded-full ${para.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-slate-200 text-slate-500'}`}>
                                                        {para.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex gap-2">
                                                        <button onClick={() => handleEdit(para)} className="text-blue-500 hover:text-blue-700">Edit</button>
                                                        <button onClick={() => handleDelete(para.id)} className="text-red-500 hover:text-red-700">Delete</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        {!loading && paragraphs.length === 0 && (
                                            <tr><td colSpan="6" className="text-center p-8 text-slate-500">No paragraphs found. Add one above.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                ) : (
                    // Reports View
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold text-slate-600">Date</th>
                                        <th className="px-6 py-4 font-semibold text-slate-600">User</th>
                                        <th className="px-6 py-4 font-semibold text-slate-600">WPM</th>
                                        <th className="px-6 py-4 font-semibold text-slate-600">Accuracy</th>
                                        <th className="px-6 py-4 font-semibold text-slate-600">Duration</th>
                                        <th className="px-6 py-4 font-semibold text-slate-600">Source</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {loading ? (
                                        <tr><td colSpan="6" className="text-center p-8">Loading...</td></tr>
                                    ) : reports.map((report) => (
                                        <tr key={report.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4 text-slate-600">{new Date(report.test_date).toLocaleString()}</td>
                                            <td className="px-6 py-4 text-slate-800 font-medium">
                                                {report.username}
                                                <div className="text-xs text-slate-400 font-normal">{report.email}</div>
                                            </td>
                                            <td className="px-6 py-4 font-bold text-primary">{report.wpm}</td>
                                            <td className="px-6 py-4 text-green-600">{report.accuracy}%</td>
                                            <td className="px-6 py-4 text-slate-500">{report.duration}s</td>
                                            <td className="px-6 py-4 text-slate-500 capitalize">{report.source}</td>
                                        </tr>
                                    ))}
                                    {!loading && reports.length === 0 && (
                                        <tr><td colSpan="6" className="text-center p-8 text-slate-500">No user reports found.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
