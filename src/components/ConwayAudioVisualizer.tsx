'use client';

import { useEffect, useRef, useMemo } from 'react';

interface ConwayAudioVisualizerProps {
    isPlaying: boolean;
}

export default function ConwayAudioVisualizer({ isPlaying }: ConwayAudioVisualizerProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const gridRef = useRef<boolean[][]>([]);
    const animationRef = useRef<number>(0);
    const lastUpdateRef = useRef<number>(0);

    // Configuration
    const CELL_SIZE = 8;
    const LIVE_COLOR = 'rgba(245, 64, 41, 0.8)'; // #F54029
    const TRAIL_COLOR = 'rgba(245, 64, 41, 0.2)';

    // Initialize grid
    const initGrid = (cols: number, rows: number) => {
        const grid: boolean[][] = [];
        for (let y = 0; y < rows; y++) {
            grid[y] = [];
            for (let x = 0; x < cols; x++) {
                // Initialize with some random noise
                grid[y][x] = Math.random() > 0.85;
            }
        }
        return grid;
    };

    const countNeighbors = (grid: boolean[][], x: number, y: number, cols: number, rows: number) => {
        let count = 0;
        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                if (dx === 0 && dy === 0) continue;
                const nx = (x + dx + cols) % cols;
                const ny = (y + dy + rows) % rows;
                if (grid[ny][nx]) count++;
            }
        }
        return count;
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resize = () => {
            const parent = canvas.parentElement;
            if (parent) {
                canvas.width = parent.clientWidth;
                canvas.height = parent.clientHeight;
                const cols = Math.ceil(canvas.width / CELL_SIZE);
                const rows = Math.ceil(canvas.height / CELL_SIZE);
                gridRef.current = initGrid(cols, rows);
            }
        };
        resize();
        window.addEventListener('resize', resize);

        const update = (timestamp: number) => {
            const cols = Math.ceil(canvas.width / CELL_SIZE);
            const rows = Math.ceil(canvas.height / CELL_SIZE);

            // Dynamic speed based on playing state
            // Playing: update every 50ms (20fps)
            // Paused: update every 200ms (5fps)
            const updateInterval = isPlaying ? 50 : 200;

            if (timestamp - lastUpdateRef.current > updateInterval) {
                const newGrid: boolean[][] = [];

                for (let y = 0; y < rows; y++) {
                    newGrid[y] = [];
                    for (let x = 0; x < cols; x++) {
                        const neighbors = countNeighbors(gridRef.current, x, y, cols, rows);
                        const isAlive = gridRef.current[y][x];

                        if (isAlive && (neighbors === 2 || neighbors === 3)) {
                            newGrid[y][x] = true;
                        } else if (!isAlive && neighbors === 3) {
                            newGrid[y][x] = true;
                        } else {
                            newGrid[y][x] = false;
                        }
                    }
                }

                // Inject energy if playing
                if (isPlaying) {
                    const centerX = Math.floor(cols / 2);
                    const centerY = Math.floor(rows / 2);
                    const radius = 5;

                    // Inject random cells in the center to stimulate growth
                    for (let i = 0; i < 3; i++) {
                        const rx = centerX + Math.floor((Math.random() - 0.5) * radius * 2);
                        const ry = centerY + Math.floor((Math.random() - 0.5) * radius * 2);
                        if (newGrid[ry] && newGrid[ry][rx] !== undefined) {
                            newGrid[ry][rx] = !newGrid[ry][rx]; // Flip state
                        }
                    }
                }

                gridRef.current = newGrid;
                lastUpdateRef.current = timestamp;
            }

            // Draw
            ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'; // Fade effect
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            for (let y = 0; y < rows; y++) {
                for (let x = 0; x < cols; x++) {
                    if (gridRef.current[y]?.[x]) {
                        ctx.fillStyle = LIVE_COLOR;
                        const px = x * CELL_SIZE;
                        const py = y * CELL_SIZE;

                        // Draw glowing cell
                        ctx.beginPath();
                        ctx.arc(px + CELL_SIZE / 2, py + CELL_SIZE / 2, CELL_SIZE / 2 - 1, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
            }

            // Central "Beat" Visualizer Overlay
            if (isPlaying) {
                const centerX = canvas.width / 2;
                const centerY = canvas.height / 2;
                const pulse = (Math.sin(timestamp / 200) + 1) / 2; // 0 to 1

                ctx.beginPath();
                ctx.strokeStyle = `rgba(245, 64, 41, ${0.1 + pulse * 0.2})`;
                ctx.lineWidth = 2;
                ctx.arc(centerX, centerY, 40 + pulse * 10, 0, Math.PI * 2);
                ctx.stroke();
            }

            animationRef.current = requestAnimationFrame(update);
        };

        animationRef.current = requestAnimationFrame(update);

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationRef.current);
        };
    }, [isPlaying]);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full opacity-60 mix-blend-screen pointer-events-none"
        />
    );
}
