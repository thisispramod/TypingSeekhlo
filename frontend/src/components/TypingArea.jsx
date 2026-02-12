
import { useState, useEffect, useRef } from 'react';
import api from '../api/axios';

const TypingArea = ({ onFinish }) => {
    const [paragraph, setParagraph] = useState('');
    const [input, setInput] = useState('');
    const [timeLeft, setTimeLeft] = useState(60);
    const [isActive, setIsActive] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const [stats, setStats] = useState({ wpm: 0, accuracy: 0, cpm: 0, correct: 0, incorrect: 0 });
    const [language, setLanguage] = useState('english');
    const [duration, setDuration] = useState(60);
    const inputRef = useRef(null);
    const timerRef = useRef(null);

    useEffect(() => {
        fetchParagraph();
    }, [language]);

    useEffect(() => {
        if (isActive && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            clearInterval(timerRef.current);
            finishTest();
        }
        return () => clearInterval(timerRef.current);
    }, [isActive, timeLeft]);

    const fetchParagraph = async () => {
        try {
            const res = await api.get(`/paragraphs/test?language=${language}`);
            setParagraph(res.data.paragraph_text);
            resetTest(false);
        } catch (err) {
            console.error("Error fetching paragraph", err);
            setParagraph("Error loading text. Please try again or check backend.");
        }
    };

    const resetTest = (fetchNew = true) => {
        setIsActive(false);
        setIsFinished(false);
        setInput('');
        setTimeLeft(duration);
        setStats({ wpm: 0, accuracy: 0, cpm: 0, correct: 0, incorrect: 0 });
        clearInterval(timerRef.current);
        if (fetchNew) fetchParagraph();
        if (inputRef.current) inputRef.current.focus();
    };

    const finishTest = () => {
        setIsActive(false);
        setIsFinished(true);
        if (onFinish) onFinish(stats);
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
        const timeElapsed = (duration - timeLeft) / 60;
        const wpm = timeElapsed > 0 ? Math.round((correct / 5) / timeElapsed) : 0;
        const accuracy = ((correct / currentInput.length) * 100) || 0;

        setStats({
            wpm,
            cpm: Math.round(correct / (timeElapsed || 0.01)),
            accuracy: accuracy.toFixed(2),
            correct,
            incorrect
        });
    };

    const handleInput = (e) => {
        const val = e.target.value;
        if (!isActive && !isFinished) {
            setIsActive(true);
        }

        setInput(val);
        calculateStats(val);

        if (val.length >= paragraph.length) {
            finishTest();
        }
    };

    const handleDurationChange = (e) => {
        const newDuration = parseInt(e.target.value);
        setDuration(newDuration);
        setTimeLeft(newDuration);
        setIsActive(false);
        setInput('');
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg border border-slate-100">
            {/* Header Controls */}
            <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                <div className="flex gap-2">
                    <button
                        onClick={() => setLanguage('english')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${language === 'english' ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                    >
                        English
                    </button>
                    <button
                        onClick={() => setLanguage('hindi')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${language === 'hindi' ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                    >
                        Hindi (Mangal)
                    </button>
                </div>

                <div className="flex items-center gap-4">
                    <select
                        value={duration}
                        onChange={handleDurationChange}
                        className="px-3 py-2 border rounded-md text-slate-600 bg-slate-50 focus:ring-2 focus:ring-primary outline-none"
                    >
                        <option value={30}>30s</option>
                        <option value={60}>60s</option>
                        <option value={120}>2 mins</option>
                    </select>
                    <div className={`text-2xl font-bold font-mono ${timeLeft < 10 ? 'text-danger' : 'text-slate-700'}`}>
                        {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                    </div>
                </div>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-4 gap-4 mb-6 text-center">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <div className="text-sm text-slate-500 uppercase font-semibold">WPM</div>
                    <div className="text-2xl font-bold text-primary">{stats.wpm}</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <div className="text-sm text-slate-500 uppercase font-semibold">Accuracy</div>
                    <div className="text-2xl font-bold text-success">{stats.accuracy}%</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <div className="text-sm text-slate-500 uppercase font-semibold">Correct</div>
                    <div className="text-2xl font-bold text-green-600">{stats.correct}</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <div className="text-sm text-slate-500 uppercase font-semibold">Error</div>
                    <div className="text-2xl font-bold text-red-500">{stats.incorrect}</div>
                </div>
            </div>

            {/* Text Display */}
            <div className={`mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200 h-48 overflow-y-auto leading-loose text-xl select-none custom-scrollbar ${language === 'hindi' ? 'mangal-font' : 'font-mono'}`}>
                {paragraph.split('').map((char, i) => {
                    let color = 'text-slate-500';
                    let bg = '';
                    if (i < input.length) {
                        if (input[i] === char) {
                            color = 'text-green-600';
                        } else {
                            color = 'text-red-500';
                            bg = 'bg-red-50';
                        }
                    } else if (i === input.length) {
                        bg = 'bg-blue-100 border-l-2 border-primary animate-pulse';
                    }

                    return (
                        <span key={i} className={`${color} ${bg} px-[1px] rounded-sm transition-colors duration-75`}>
                            {char}
                        </span>
                    );
                })}
            </div>

            {/* Input Area */}
            <textarea
                ref={inputRef}
                value={input}
                onChange={handleInput}
                disabled={isFinished}
                onPaste={(e) => e.preventDefault()}
                placeholder={isActive ? "Keep typing..." : "Start typing here..."}
                className={`w-full h-32 p-4 border-2 rounded-lg focus:ring-4 focus:ring-blue-100 focus:border-primary outline-none resize-none transition-all shadow-sm ${language === 'hindi' ? 'mangal-font' : 'font-mono'}`}
            ></textarea>

            {/* Footer Controls */}
            <div className="flex justify-center gap-4 mt-6">
                <button
                    onClick={() => resetTest(true)}
                    className="px-6 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-medium transition-colors"
                >
                    Reset & New Text
                </button>
                <button
                    onClick={() => resetTest(false)}
                    className="px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg font-medium transition-colors"
                >
                    Restart
                </button>
            </div>

            {isFinished && (
                <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg text-center animate-fade-in">
                    <h3 className="text-2xl font-bold text-blue-800 mb-2">Test Completed!</h3>
                    <p className="text-blue-600 mb-4">You typed at <span className="font-bold">{stats.wpm} WPM</span> with <span className="font-bold">{stats.accuracy}%</span> accuracy.</p>
                </div>
            )}
        </div>
    );
};

export default TypingArea;
