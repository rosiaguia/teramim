export default function BreathingScene() {
  return (
    <div className="breathe-painting" aria-hidden="true">
      <svg viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bsky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fde8bd" />
            <stop offset="45%" stopColor="#f8c58f" />
            <stop offset="72%" stopColor="#ef9f78" />
            <stop offset="100%" stopColor="#e0896c" />
          </linearGradient>
          <radialGradient id="bsunGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff2cd" stopOpacity="0.95" />
            <stop offset="55%" stopColor="#ffd98f" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#ffd98f" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="bsun" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff6d8" />
            <stop offset="70%" stopColor="#ffd27d" />
            <stop offset="100%" stopColor="#f8b95e" />
          </radialGradient>
          <linearGradient id="briver" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a7c6d1" />
            <stop offset="60%" stopColor="#7aa4b6" />
            <stop offset="100%" stopColor="#5f8ea2" />
          </linearGradient>
        </defs>

        {/* céu */}
        <rect x="0" y="0" width="600" height="400" fill="url(#bsky)" />

        {/* brilho do sol */}
        <g transform="translate(300,186)">
          <circle r="100" fill="url(#bsunGlow)" className="b-glowslow" />
        </g>

        {/* sol central com raios girando */}
        <g transform="translate(300,186)">
          <g className="b-rays">
            <path d="M0 -72 L0 -104 M0 72 L0 104 M-72 0 L-104 0 M72 0 L104 0" stroke="#ffecb3" strokeWidth="5" strokeLinecap="round" opacity="0.7" />
            <path d="M51 -51 L74 -74 M-51 -51 L-74 -74 M51 51 L74 74 M-51 51 L-74 74" stroke="#ffecb3" strokeWidth="4" strokeLinecap="round" opacity="0.55" />
          </g>
          <g className="b-sun">
            <circle r="56" fill="url(#bsun)" />
          </g>
        </g>

        {/* nuvens à deriva */}
        <g transform="translate(120,82)">
          <g className="b-cloud b-cloud1">
            <circle cx="0" cy="0" r="22" fill="#ffffff" opacity="0.85" />
            <circle cx="26" cy="6" r="16" fill="#ffffff" opacity="0.8" />
            <circle cx="-26" cy="9" r="17" fill="#fff4e0" opacity="0.8" />
            <circle cx="-4" cy="13" r="17" fill="#ffffff" opacity="0.85" />
          </g>
        </g>
        <g transform="translate(450,116)">
          <g className="b-cloud b-cloud2">
            <circle cx="0" cy="0" r="16" fill="#ffffff" opacity="0.6" />
            <circle cx="20" cy="5" r="12" fill="#ffffff" opacity="0.55" />
            <circle cx="-18" cy="6" r="12" fill="#fff4e0" opacity="0.55" />
          </g>
        </g>

        {/* passarinhos */}
        <g transform="translate(170,120)">
          <g className="b-bird b-bird1">
            <path d="M0 0 Q 7 -8 14 0 M 14 0 Q 21 -8 28 0" stroke="#6b5a52" strokeWidth="2.4" fill="none" strokeLinecap="round" />
          </g>
        </g>
        <g transform="translate(240,140)">
          <g className="b-bird b-bird2">
            <path d="M0 0 Q 6 -7 12 0 M 12 0 Q 18 -7 24 0" stroke="#7a675e" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.85" />
          </g>
        </g>

        {/* colinas distantes */}
        <path d="M0 258 Q 80 222 170 250 T 360 238 T 600 252 L 600 400 L 0 400 Z" fill="#c39b8c" />
        <path d="M0 300 Q 110 258 220 290 T 420 280 T 600 296 L 600 400 L 0 400 Z" fill="#8fa88f" />

        {/* rio */}
        <path d="M300 248 Q 382 322 468 400 L 132 400 Q 218 322 300 248 Z" fill="url(#briver)" />

        {/* brilho na água */}
        <g className="b-shimmers">
          <ellipse cx="300" cy="272" rx="52" ry="4.5" fill="#ffe9b0" opacity="0.5" />
          <ellipse cx="300" cy="308" rx="64" ry="5" fill="#ffe9b0" opacity="0.4" />
          <ellipse cx="300" cy="348" rx="78" ry="6" fill="#ffe9b0" opacity="0.3" />
        </g>

        {/* margens verdes */}
        <path d="M0 400 L0 342 Q 90 348 168 400 Z" fill="#6d9486" />
        <path d="M600 400 L600 336 Q 505 344 428 400 Z" fill="#6d9486" />

        {/* ponte de madeira */}
        <g transform="translate(0,0)">
          <path d="M196 318 Q 300 272 404 318" stroke="#7a4f2f" strokeWidth="11" fill="none" strokeLinecap="round" />
          <path d="M196 318 Q 300 272 404 318" stroke="#a06a41" strokeWidth="5" fill="none" strokeLinecap="round" />
          <path d="M220 300 L 220 320 M 300 283 L 300 302 M 380 300 L 380 320" stroke="#5f3b23" strokeWidth="5" strokeLinecap="round" />
          <path d="M200 312 Q 300 270 400 312" stroke="#6b4426" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        </g>

        {/* árvore */}
        <g transform="translate(118,0)">
          <path d="M120 336 Q 118 296 122 262" stroke="#6b4a33" strokeWidth="11" fill="none" strokeLinecap="round" />
          <path d="M120 290 Q 96 300 84 312 M 121 300 Q 146 306 158 318" stroke="#6b4a33" strokeWidth="6" fill="none" strokeLinecap="round" />
          <g className="b-canopy">
            <circle cx="120" cy="238" r="42" fill="#5c8a63" />
            <circle cx="90" cy="256" r="30" fill="#54805b" />
            <circle cx="152" cy="258" r="32" fill="#54805b" />
            <circle cx="106" cy="226" r="28" fill="#82ad74" />
            <circle cx="140" cy="240" r="22" fill="#7aa76e" />
          </g>
        </g>

        {/* folhas caindo */}
        <ellipse cx="150" cy="272" rx="5" ry="3" fill="#9cbe74" className="b-leaf b-leaf1" />
        <ellipse cx="92" cy="288" rx="4" ry="2.6" fill="#8fb268" className="b-leaf b-leaf2" />

        {/* grama */}
        <path d="M0 396 Q 14 384 28 396 Q 42 384 56 396 Q 70 384 84 396 Q 98 384 112 396" stroke="#4d7a5c" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M470 396 Q 484 384 498 396 Q 512 384 526 396 Q 540 384 554 396" stroke="#4d7a5c" strokeWidth="3" fill="none" strokeLinecap="round" />

        {/* vagalumes */}
        <circle cx="420" cy="230" r="2.6" fill="#fff8cf" className="b-spark b-spark1" />
        <circle cx="250" cy="180" r="2.2" fill="#fff8cf" className="b-spark b-spark2" />
        <circle cx="90" cy="196" r="2.2" fill="#fff8cf" className="b-spark b-spark3" />
        <circle cx="480" cy="270" r="2.8" fill="#fff4bd" className="b-spark b-spark4" />
        <circle cx="330" cy="222" r="2" fill="#fff8cf" className="b-spark b-spark5" />
      </svg>
    </div>
  )
}
