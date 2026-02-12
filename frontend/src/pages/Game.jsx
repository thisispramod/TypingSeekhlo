
import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../api/axios';
import RaceTrack from '../components/RaceTrack';

const Game = () => {
    const location = useLocation();
    const [paragraph, setParagraph] = useState('');
    const [input, setInput] = useState('');
    const [timeLeft, setTimeLeft] = useState(60);
    const [isActive, setIsActive] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const [stats, setStats] = useState({ wpm: 0, accuracy: 0, cpm: 0, correct: 0, incorrect: 0 });
    const [language, setLanguage] = useState('english');
    const [duration, setDuration] = useState(60);

    // Race State
    const [bots, setBots] = useState([
        { id: 1, name: 'Pingo', color: 'bg-orange-500', avatar: '🐧', progress: 0, speed: 30 },
        { id: 2, name: 'Kito', color: 'bg-blue-500', avatar: '🐱', progress: 0, speed: 45 },
        { id: 3, name: 'Alba', color: 'bg-purple-500', avatar: '🦜', progress: 0, speed: 60 },
    ]);

    const inputRef = useRef(null);
    const timerRef = useRef(null);
    const botIntervalRef = useRef(null);
    const customText = location.state?.customText;

    useEffect(() => {
        fetchParagraph();
    }, [language]);

    useEffect(() => {
        if (isFinished) {
            saveReport();
        }
    }, [isFinished]);

    useEffect(() => {
        if (isActive && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);

            // Move bots
            botIntervalRef.current = setInterval(() => {
                setBots(prevBots => prevBots.map(bot => {
                    if (bot.progress >= 100) return bot;
                    // Calculate random increment based on speed (WPM)
                    const totalChars = paragraph.length || 100;
                    const charPerSec = (bot.speed * 5) / 60;
                    const increment = (charPerSec / totalChars) * 100 * 0.5; // running every 500ms
                    // Add some randomness
                    const randomFactor = Math.random() * 0.5 + 0.8;
                    return { ...bot, progress: Math.min(100, bot.progress + increment * randomFactor) };
                }));
            }, 500);

        } else if (timeLeft === 0) {
            finishTest();
        }
        return () => {
            clearInterval(timerRef.current);
            clearInterval(botIntervalRef.current);
        };
    }, [isActive, timeLeft, paragraph.length]);

    const fetchParagraph = async () => {
        if (customText) {
            setParagraph(customText.content);
            resetTest(false);
        } else {
            try {
                const res = await api.get(`/paragraphs/test?language=${language}`);
                setParagraph(res.data.paragraph_text);
                resetTest(false);
            } catch (err) {
                console.error("Error fetching paragraph", err);
                setParagraph("Did you know that octopuses have three hearts? Two pump blood to the gills, while a third circulates it to the rest of the body.");
            }
        }
    };

    const saveReport = async () => {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        if (token && user) {
            try {
                // Check if user is admin (optional, if admins don't track stats or if different token structure)
                // But generally safe to try
                await api.post('/user/reports', {
                    wpm: stats.wpm,
                    accuracy: stats.accuracy,
                    errors: stats.incorrect,
                    duration: duration,
                    source: customText ? 'custom' : 'default'
                });
            } catch (error) {
                console.error("Failed to save report", error);
            }
        }
    };

    const resetTest = (fetchNew = true) => {
        setIsActive(false);
        setIsFinished(false);
        setInput('');
        setTimeLeft(duration);
        setStats({ wpm: 0, accuracy: 0, cpm: 0, correct: 0, incorrect: 0 });
        setBots(bots.map(b => ({ ...b, progress: 0 })));

        clearInterval(timerRef.current);
        clearInterval(botIntervalRef.current);

        if (fetchNew) fetchParagraph();
        // Focus input
        setTimeout(() => inputRef.current?.focus(), 100);
    };

    const finishTest = () => {
        clearInterval(timerRef.current);
        clearInterval(botIntervalRef.current);
        setIsActive(false);
        setIsFinished(true);
    };

    const calculateStats = (currentInput) => {
        let correct = 0;
        let incorrect = 0;
        const paraChars = paragraph.split('');
        const inputChars = currentInput.split('');

        inputChars.forEach((char, index) => {
            if (char === paraChars[index]) {
                correct++;
            } else {
                incorrect++;
            }
        });

        // Time elapsed in minutes
        const timeElapsed = (duration - timeLeft) / 60; // Approximate if not finished
        const timeUsed = timeElapsed === 0 ? (1 / 60) : (duration - timeLeft) === 0 ? 0.01 : (duration - timeLeft) / 60;

        const wpm = Math.round((correct / 5) / timeUsed);
        const accuracy = ((correct / currentInput.length) * 100) || 0;

        setStats({
            wpm: wpm < 0 ? 0 : wpm,
            cpm: Math.round(correct / timeUsed),
            accuracy: accuracy.toFixed(1),
            correct,
            incorrect
        });
    };

    const handleInput = (e) => {
        const val = e.target.value;
        if (!isActive && !isFinished) {
            setIsActive(true);
        }

        if (isFinished) return;

        setInput(val);
        calculateStats(val);

        if (val.length >= paragraph.length) {
            finishTest();
        }
    };

    const userProgress = paragraph.length > 0 ? (input.length / paragraph.length) * 100 : 0;

    const renderText = () => {
        return (
            <div className="relative text-2xl md:text-3xl leading-relaxed font-medium text-slate-400 font-mono tracking-wide break-words">
                {paragraph.split('').map((char, i) => {
                    let color = '';
                    let bg = '';
                    let isCurrent = i === input.length;

                    if (i < input.length) {
                        if (input[i] === char) {
                            color = 'text-green-600';
                        } else {
                            color = 'text-red-500 bg-red-100 rounded';
                        }
                    } else {
                        color = 'text-slate-800'; // upcoming text
                    }

                    return (
                        <span key={i} className={`relative ${color} ${bg} transition-colors duration-75`}>
                            {isCurrent && (
                                <span className="absolute -left-[1px] -top-1 bottom-0 w-[2px] bg-green-500 animate-pulse h-full scale-110"></span>
                            )}
                            {isCurrent && !isActive && input.length === 0 && (
                                <span className="absolute -top-12 left-0 whitespace-nowrap bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg animate-bounce z-50">
                                    Start typing
                                    <div className="absolute -bottom-1 left-4 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-green-500"></div>
                                </span>
                            )}
                            {char}
                        </span>
                    );
                })}
            </div>
        );
    };

    const focusInput = () => {
        inputRef.current?.focus();
    };

    const handleDurationChange = (e) => {
        const val = parseInt(e.target.value);
        setDuration(val);
        setTimeLeft(val);
        setIsActive(false);
        setInput('');
        setBots(bots.map(b => ({ ...b, progress: 0 })));
    };

    return (
        <div className="min-h-screen bg-slate-50 py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-slate-800 mb-2">Typing Race</h1>
                    <p className="text-slate-600">Compete against bots and improve your speed!</p>
                </div>

                <div className="max-w-5xl mx-auto space-y-8">

                    {/* Race Section */}
                    <RaceTrack userProgress={userProgress} bots={bots} />

                    {/* Typing Card */}
                    <div
                        className="bg-white rounded-2xl shadow-xl px-10 py-12 border border-slate-100 relative cursor-text min-h-[300px] flex flex-col justify-center items-center"
                        onClick={focusInput}
                    >
                        <textarea
                            ref={inputRef}
                            value={input}
                            onChange={handleInput}
                            className="absolute opacity-0 top-0 left-0 w-full h-full cursor-default -z-10"
                            autoFocus
                            spellCheck="false"
                        />

                        <div className="w-full max-w-4xl text-center select-none pointer-events-none">
                            {renderText()}
                        </div>

                        <div className="absolute bottom-4 right-6 flex items-center gap-4 text-sm font-medium text-slate-400">
                            <div className={`transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
                                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                            </div>
                            <div className="h-4 w-px bg-slate-200"></div>
                            <select
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                                className="bg-transparent hover:text-slate-600 outline-none cursor-pointer"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <option value="english">🇺🇸 English</option>
                                <option value="hindi">🇮🇳 Hindi</option>
                            </select>
                        </div>
                    </div>

                    {/* Stats Dashboard */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center gap-3">
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">⚡</div>
                            <div>
                                <div className="text-sm text-slate-500 font-medium">Speed</div>
                                <div className="text-xl font-bold text-slate-700">{stats.wpm} <span className="text-xs font-normal text-slate-400">WPM</span></div>
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center gap-3">
                            <div className="p-2 bg-green-50 text-green-600 rounded-lg">🎯</div>
                            <div>
                                <div className="text-sm text-slate-500 font-medium">Accuracy</div>
                                <div className="text-xl font-bold text-slate-700">{stats.accuracy}%</div>
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center gap-3">
                            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">⏱️</div>
                            <div className="w-full">
                                <div className="text-sm text-slate-500 font-medium mb-1">Duration</div>
                                <select
                                    value={duration}
                                    onChange={handleDurationChange}
                                    className="w-full bg-slate-50 border-none text-sm font-bold text-slate-700 rounded p-0 cursor-pointer focus:ring-0"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <option value={30}>30s Sprint</option>
                                    <option value={60}>60s Normal</option>
                                    <option value={120}>2m Marathon</option>
                                </select>
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center gap-3 justify-center cursor-pointer hover:bg-slate-50 transition-colors" onClick={() => resetTest(true)}>
                            <div className="flex flex-col items-center text-slate-500">
                                <span className="text-xl">↻</span>
                                <span className="text-xs font-bold">Restart</span>
                            </div>
                        </div>
                    </div>

                    {/* Result Modal */}
                    {isFinished && (
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                            <div className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl transform scale-100 animate-fade-in text-center">
                                <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <span className="text-4xl">🏆</span>
                                </div>
                                <h2 className="text-3xl font-bold text-slate-800 mb-2">Race Finished!</h2>
                                <p className="text-slate-500 mb-8">You placed {stats.wpm > 50 ? '1st 🥇' : 'well (keep practicing!)'}</p>

                                <div className="grid grid-cols-3 gap-6 mb-8">
                                    <div className="text-center">
                                        <div className="text-3xl font-black text-blue-600">{stats.wpm}</div>
                                        <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">WPM</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-3xl font-black text-green-500">{stats.accuracy}%</div>
                                        <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Accuracy</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-3xl font-black text-purple-500">{stats.correct}</div>
                                        <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Keystrokes</div>
                                    </div>
                                </div>

                                <div className="flex gap-4 justify-center">
                                    <button
                                        onClick={() => resetTest(true)}
                                        className="px-8 py-3 bg-primary text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-600 transition-all hover:-translate-y-1"
                                    >
                                        New Race
                                    </button>
                                    <button
                                        onClick={() => window.location.href = '/'}
                                        className="px-8 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-colors"
                                    >
                                        Home
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Game;
