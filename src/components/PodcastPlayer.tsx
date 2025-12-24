'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { PodcastEpisode } from '@/utils/rssParser';
import ConwayAudioVisualizer from '@/components/ConwayAudioVisualizer';
import Image from 'next/image';

interface PodcastPlayerProps {
    episodes: PodcastEpisode[];
    artwork?: string;
}

type SortOrder = 'asc' | 'desc';

export default function PodcastPlayer({ episodes, artwork }: PodcastPlayerProps) {
    const [currentEpisode, setCurrentEpisode] = useState<PodcastEpisode>(episodes[0]); // Episodes are passed pre-sorted asc
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
    const audioRef = useRef<HTMLAudioElement>(null);

    // Derived sorted list
    const sortedEpisodes = useMemo(() => {
        return [...episodes].sort((a, b) => {
            const timeA = new Date(a.pubDate).getTime();
            const timeB = new Date(b.pubDate).getTime();
            return sortOrder === 'asc' ? timeA - timeB : timeB - timeA;
        });
    }, [episodes, sortOrder]);

    useEffect(() => {
        if (isPlaying) {
            audioRef.current?.play();
        } else {
            audioRef.current?.pause();
        }
    }, [isPlaying, currentEpisode]);

    const handlePlayPause = () => {
        setIsPlaying(!isPlaying);
    };

    const handleEpisodeClick = (episode: PodcastEpisode) => {
        if (episode.guid === currentEpisode.guid) {
            handlePlayPause();
        } else {
            setCurrentEpisode(episode);
            setIsPlaying(true);
        }
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
            setDuration(audioRef.current.duration || 0);
        }
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const time = parseFloat(e.target.value);
        if (audioRef.current) {
            audioRef.current.currentTime = time;
            setCurrentTime(time);
        }
    };

    const toggleSort = () => {
        setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    };

    const formatTime = (time: number) => {
        if (isNaN(time)) return '0:00';
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className="w-full flex flex-col md:flex-row gap-8">
            <audio
                ref={audioRef}
                src={currentEpisode.audioUrl}
                onTimeUpdate={handleTimeUpdate}
                onEnded={() => setIsPlaying(false)}
            />

            {/* Main Player */}
            <div className="flex-1 space-y-8">
                <div className="relative aspect-square md:aspect-video rounded-2xl overflow-hidden bg-[#111] border border-white/10 shadow-2xl group cursor-pointer" onClick={handlePlayPause}>

                    {/* Background Artwork (Blended) */}
                    {artwork && (
                        <div className="absolute inset-0 opacity-40 mix-blend-overlay">
                            <Image
                                src={artwork}
                                alt="Podcast Artwork"
                                fill
                                className="object-cover blur-sm"
                            />
                        </div>
                    )}

                    {/* Visualizer Layer */}
                    <div className="relative z-10 w-full h-full mix-blend-screen">
                        <ConwayAudioVisualizer isPlaying={isPlaying} />
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-transparent to-[#F54029]/20 pointer-events-none z-20" />

                    {/* Play/Pause Overlay Indicator */}
                    <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 pointer-events-none z-30 ${isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>
                        <div className="w-20 h-20 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                            {isPlaying ? (
                                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" /></svg>
                            ) : (
                                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                            )}
                        </div>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none z-30">
                        <h2 className="text-2xl md:text-3xl font-mono font-bold text-white mb-2 leading-tight drop-shadow-lg">
                            {currentEpisode.title}
                        </h2>
                        <p className="text-[#F54029] font-mono text-sm tracking-widest drop-shadow-md">
                            {new Date(currentEpisode.pubDate).toLocaleDateString()} • {currentEpisode.duration}
                        </p>
                    </div>
                </div>

                {/* Controls */}
                <div className="bg-[#111] border border-white/10 rounded-xl p-6">
                    <div className="flex items-center gap-4 mb-4">
                        <button
                            onClick={handlePlayPause}
                            className="w-12 h-12 rounded-full bg-[#F54029] text-black flex items-center justify-center hover:opacity-90 transition-opacity"
                        >
                            {isPlaying ? (
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" /></svg>
                            ) : (
                                <svg className="w-5 h-5 translate-x-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                            )}
                        </button>

                        <div className="flex-1">
                            <input
                                type="range"
                                min="0"
                                max={duration || 100}
                                value={currentTime}
                                onChange={handleSeek}
                                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-[#F54029] [&::-webkit-slider-thumb]:rounded-full hover:[&::-webkit-slider-thumb]:scale-125 transition-all"
                            />
                            <div className="flex justify-between mt-1 text-[10px] font-mono text-gray-500">
                                <span>{formatTime(currentTime)}</span>
                                <span>{formatTime(duration)}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <p className="text-gray-400 font-mono text-sm leading-relaxed max-w-2xl">
                    {currentEpisode.description}
                </p>
            </div>

            {/* Playlist */}
            <div className="w-full md:w-80 lg:w-96 flex-shrink-0">
                <div className="bg-[#111]/50 backdrop-blur-sm border border-white/10 rounded-xl h-[600px] flex flex-col">
                    <div className="p-4 border-b border-white/10 flex items-center justify-between">
                        <h3 className="text-[#F54029] font-mono text-xs font-bold tracking-widest">EPISODES</h3>
                        <button
                            onClick={toggleSort}
                            className="text-xs font-mono text-gray-500 hover:text-white flex items-center gap-1 transition-colors"
                        >
                            {sortOrder === 'asc' ? 'OLDEST FIRST' : 'NEWEST FIRST'}
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" /></svg>
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                        {sortedEpisodes.map((episode, index) => (
                            <button
                                key={index}
                                onClick={() => handleEpisodeClick(episode)}
                                className={`w-full text-left p-3 rounded-lg transition-all border border-transparent ${currentEpisode.guid === episode.guid
                                    ? 'bg-white/10 border-[#F54029]/30 text-white'
                                    : 'text-gray-500 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <div className="text-xs font-mono mb-1 opacity-70">
                                    {new Date(episode.pubDate).toLocaleDateString()}
                                </div>
                                <div className="font-mono text-xs font-bold line-clamp-2">
                                    {episode.title}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
