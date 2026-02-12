import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    let user = null;
    try {
        if (userStr && userStr !== 'undefined') {
            user = JSON.parse(userStr);
        }
    } catch (e) {
        console.error('Error parsing user data', e);
        localStorage.removeItem('user');
    }

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    return (
        <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
                        <div className="bg-primary text-white p-2 rounded-lg mr-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                            </svg>
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
                            TypoMaster
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/')} className="text-slate-600 hover:text-primary font-medium transition-colors">
                            Home
                        </button>
                        <button onClick={() => navigate('/game')} className="text-slate-600 hover:text-primary font-medium transition-colors">
                            Race Mode
                        </button>
                        {token ? (
                            <>
                                {user?.role === 'admin' ? (
                                    <button onClick={() => navigate('/admin')} className="text-slate-600 hover:text-primary font-medium transition-colors">
                                        Admin Dashboard
                                    </button>
                                ) : (
                                    <button onClick={() => navigate('/dashboard')} className="text-slate-600 hover:text-primary font-medium transition-colors">
                                        My Dashboard
                                    </button>
                                )}
                                <div className="flex items-center gap-2 border-l pl-4 ml-2 border-slate-200">
                                    <span className="text-sm font-medium text-slate-500 hidden sm:block">Hi, {user?.username}</span>
                                    <button onClick={handleLogout} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors">
                                        Logout
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <button onClick={() => navigate('/login/user')} className="text-slate-600 hover:text-primary font-medium transition-colors">
                                    Login
                                </button>
                                <button onClick={() => navigate('/register')} className="px-4 py-2 bg-primary hover:bg-blue-600 text-white rounded-lg font-medium transition-colors shadow-sm shadow-blue-200">
                                    Start Free
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
