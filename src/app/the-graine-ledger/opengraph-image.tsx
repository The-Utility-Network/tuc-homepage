import { ImageResponse } from 'next/og';
import { readFileSync } from 'fs';
import { join } from 'path';

export const alt = 'The Graine Ledger - From Seed to Marketplace';
export const size = { width: 2400, height: 1260 };
export const contentType = 'image/png';

const THEME = '#D4A574';

export default async function Image() {
    const bgData = readFileSync(join(process.cwd(), 'public', 'og-images', 'graine_og.jpg'));
    const bgBase64 = `data:image/jpeg;base64,${bgData.toString('base64')}`;

    const medallionData = readFileSync(join(process.cwd(), 'public', 'Medallions', 'TGL_opt.png'));
    const medallionBase64 = `data:image/png;base64,${medallionData.toString('base64')}`;

    return new ImageResponse(
        (
            <div style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundImage: `url(${bgBase64})`,
                backgroundSize: '100% 100%',
                backgroundColor: '#000000',
                position: 'relative',
                fontFamily: 'Helvetica, Arial, sans-serif'
            }}>
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)' }} />

                {/* Left Wing - QUOTE */}
                <div style={{
                    position: 'absolute',
                    left: 200,
                    top: 480,
                    width: 800,
                    height: 320,
                    borderRadius: '40px 0 0 40px',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                    padding: '40px 260px 40px 40px',
                    boxShadow: 'inset 2px 2px 20px rgba(255,255,255,0.2)',
                    background: 'rgba(255,255,255,0.1)'
                }}>
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.05)' }} />
                    <div style={{ position: 'absolute', inset: 0, border: '2px solid rgba(255,255,255,0.1)', borderRight: 'none', borderRadius: '40px 0 0 40px' }} />

                    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', zIndex: '10' }}>
                        <div style={{ fontSize: 40, fontWeight: 700, color: 'white', lineHeight: 1.2, textAlign: 'right', textShadow: '0 4px 30px rgba(0,0,0,0.9)' }}>
                            “Cultivators of the earth are the most valuable citizens.”
                        </div>
                        <div style={{
                            fontSize: 24,
                            fontWeight: 700,
                            color: THEME,
                            marginTop: 16,
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            textShadow: '0 2px 20px black'
                        }}>
                            — Thomas Jefferson
                        </div>
                    </div>
                </div>

                {/* Right Wing */}
                <div style={{
                    position: 'absolute',
                    right: 100,
                    top: 480,
                    width: 920,
                    height: 320,
                    borderRadius: '0 40px 40px 0',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    padding: '40px 40px 40px 240px',
                    boxShadow: 'inset -2px 2px 20px rgba(255,255,255,0.2)',
                    background: 'rgba(255,255,255,0.1)'
                }}>
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.05)' }} />
                    <div style={{ position: 'absolute', inset: 0, border: '2px solid rgba(255,255,255,0.3)', borderLeft: 'none', borderRadius: '0 40px 40px 0' }} />

                    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', zIndex: '10' }}>
                        <div style={{ fontSize: 40, color: 'white', fontWeight: 300, lineHeight: 1.2, display: 'flex', flexDirection: 'column', maxWidth: 640, textShadow: '0 4px 30px rgba(0,0,0,0.9)' }}>
                            <span>From Seed</span>
                            <span>to Marketplace</span>
                        </div>
                        <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 12, borderLeft: `6px solid ${THEME}`, paddingLeft: 30 }}>
                            <span style={{ fontSize: 24, color: '#D1D5DB', letterSpacing: '0.15em', fontWeight: 500, textShadow: '0 2px 10px black' }}>SANTA FE, NM</span>
                            <span style={{ fontSize: 24, color: THEME, letterSpacing: '0.15em', fontWeight: 700, textShadow: '0 2px 10px black' }}>theutilitycompany.co/the-graine-ledger</span>
                        </div>
                    </div>
                </div>

                {/* Center Medallion Ring */}
                <div style={{
                    position: 'absolute',
                    left: 810,
                    top: 240,
                    width: 780,
                    height: 780,
                    borderRadius: '50%',
                    overflow: 'hidden',
                    display: 'flex',
                    zIndex: '40',
                    boxShadow: 'inset 0 0 20px rgba(255,255,255,0.3)',
                    border: `4px solid ${THEME}`,
                    background: 'rgba(255,255,255,0.05)'
                }}>
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.05)' }} />
                </div>

                {/* Visual Medallion */}
                <div style={{
                    position: 'absolute',
                    left: 850,
                    top: 280,
                    width: 700,
                    height: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: '50'
                }}>
                    <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: `4px solid ${THEME}`, boxShadow: `0 0 50px ${THEME}60`, display: 'flex' }} />
                    <img src={medallionBase64} width={700} height={700} style={{ position: 'relative', width: 700, height: 700, objectFit: 'contain', padding: 30 }} />
                </div>

                {/* FRAME BARS */}
                <div style={{ position: 'absolute', left: 40, top: 40, width: 2320, height: 40, overflow: 'hidden', borderRadius: '24px 24px 0 0', display: 'flex', zIndex: '5', boxShadow: 'inset 0 0 10px rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)' }}>
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.05)' }} />
                    <div style={{ position: 'absolute', inset: 0, border: '2px solid rgba(255,255,255,0.3)', borderBottom: 'none' }} />
                </div>
                <div style={{ position: 'absolute', left: 40, top: 1180, width: 2320, height: 40, overflow: 'hidden', borderRadius: '0 0 24px 24px', display: 'flex', zIndex: '5', boxShadow: 'inset 0 0 10px rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)' }}>
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.05)' }} />
                    <div style={{ position: 'absolute', inset: 0, border: '2px solid rgba(255,255,255,0.3)', borderTop: 'none' }} />
                </div>
                <div style={{ position: 'absolute', left: 40, top: 80, width: 40, height: 1100, overflow: 'hidden', display: 'flex', zIndex: '5', boxShadow: 'inset 0 0 10px rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)' }}>
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.05)' }} />
                    <div style={{ position: 'absolute', inset: 0, border: '2px solid rgba(255,255,255,0.3)', borderTop: 'none', borderBottom: 'none' }} />
                </div>
                <div style={{ position: 'absolute', left: 2320, top: 80, width: 40, height: 1100, overflow: 'hidden', display: 'flex', zIndex: '5', boxShadow: 'inset 0 0 10px rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)' }}>
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.05)' }} />
                    <div style={{ position: 'absolute', inset: 0, border: '2px solid rgba(255,255,255,0.3)', borderTop: 'none', borderBottom: 'none' }} />
                </div>

                {/* HUD Corners */}
                <div style={{ position: 'absolute', top: 60, left: 60, width: 80, height: 80, borderTop: `8px solid ${THEME}`, borderLeft: `8px solid ${THEME}`, borderRadius: '24px 0 0 0', display: 'flex' }} />
                <div style={{ position: 'absolute', top: 60, right: 60, width: 80, height: 80, borderTop: `8px solid ${THEME}`, borderRight: `8px solid ${THEME}`, borderRadius: '0 24px 0 0', display: 'flex' }} />
                <div style={{ position: 'absolute', bottom: 60, left: 60, width: 80, height: 80, borderBottom: `8px solid ${THEME}`, borderLeft: `8px solid ${THEME}`, borderRadius: '0 0 0 24px', display: 'flex' }} />
                <div style={{ position: 'absolute', bottom: 60, right: 60, width: 80, height: 80, borderBottom: `8px solid ${THEME}`, borderRight: `8px solid ${THEME}`, borderRadius: '0 0 24px 0', display: 'flex' }} />

            </div>
        ),
        { ...size }
    );
}
