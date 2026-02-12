
import React from 'react';

const RaceTrack = ({ userProgress, bots }) => {
    return (
        <div className="w-full bg-blue-50/50 rounded-xl p-6 mb-8 relative overflow-hidden">
            {/* Background Tracks */}
            <div className="absolute inset-0 flex flex-col justify-between py-6 px-4 -z-0 opacity-20 pointer-events-none">
                {/* Visual lines for tracks */}
                {[...Array(bots.length + 1)].map((_, i) => (
                    <div key={i} className="w-full h-px bg-slate-300 transform translate-y-4"></div>
                ))}
                {/* Finish line */}
                <div className="absolute top-0 bottom-0 right-10 w-2 border-l-2 border-dashed border-slate-300/50"></div>
            </div>

            <div className="space-y-6 relative z-10">
                {/* Bots */}
                {bots.map((bot, index) => (
                    <div key={bot.id} className="relative h-10 w-full">
                        <div
                            className="absolute top-0 transition-all duration-700 ease-linear flex flex-col items-center"
                            style={{ left: `calc(${bot.progress}% - 20px)` }}
                        >
                            <div className="flex items-center gap-2 mb-1">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm ${bot.color}`}>
                                    {index + 1}
                                </div>
                                <span className="text-xs font-bold text-slate-600 bg-white/80 px-2 py-0.5 rounded-full shadow-sm backdrop-blur-sm">
                                    {bot.name}
                                </span>
                            </div>
                            <div className="text-3xl filter drop-shadow-md transform scale-x-[-1]">{bot.avatar}</div>
                        </div>
                    </div>
                ))}

                {/* User */}
                <div className="relative h-12 w-full mt-4">
                    <div
                        className="absolute top-0 transition-all duration-300 ease-out flex flex-col items-center z-20"
                        style={{ left: `calc(${userProgress}% - 24px)` }}
                    >
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-7 h-7 rounded-full bg-yellow-400 flex items-center justify-center text-xs font-bold text-yellow-900 shadow-sm border-2 border-white">
                                You
                            </div>
                        </div>
                        <div className="text-4xl filter drop-shadow-lg transform hover:scale-110 transition-transform">
                            😃
                        </div>
                        {/* Tooltip for start */}
                        {userProgress === 0 && (
                            <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg animate-bounce">
                                Start typing
                                <div className="absolute -top-1 left-1/2 -translate-x-1/2 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-emerald-500"></div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Finish Line Decoration */}
            <div className="absolute top-0 bottom-0 right-8 w-8 bg-repeat-y opacity-10"
                style={{ backgroundImage: 'linear-gradient(45deg, #000 25%, transparent 25%), linear-gradient(-45deg, #000 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #000 75%), linear-gradient(-45deg, transparent 75%, #000 75%)', backgroundSize: '10px 10px' }}>
            </div>
        </div>
    );
};

export default RaceTrack;
