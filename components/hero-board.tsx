export function HeroBoard() {
  return (
    <div className="pointer-events-none relative h-full w-full overflow-hidden">
      <svg
        viewBox="0 0 1100 320"
        preserveAspectRatio="xMidYMid meet"
        className="relative block h-full w-full"
        aria-hidden
      >
        <defs>
          <filter id="paper-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="6" stdDeviation="6" floodOpacity="0.18" />
          </filter>
          <linearGradient id="hex-fold-a" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fdba04" />
            <stop offset="50%" stopColor="#fdba04" />
            <stop offset="50%" stopColor="#d4920a" />
            <stop offset="100%" stopColor="#d4920a" />
          </linearGradient>
          <linearGradient id="hex-fold-b" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fef3c7" />
            <stop offset="50%" stopColor="#fef3c7" />
            <stop offset="50%" stopColor="#fcd34d" />
            <stop offset="100%" stopColor="#fcd34d" />
          </linearGradient>
          <linearGradient id="hex-fold-c" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#e7e5e4" />
            <stop offset="100%" stopColor="#e7e5e4" />
          </linearGradient>
        </defs>

        {/* Big amber hex */}
        <g filter="url(#paper-shadow)">
          <polygon
            points="550,40 680,115 680,225 550,300 420,225 420,115"
            fill="url(#hex-fold-a)"
            stroke="#0a0a0a"
            strokeWidth="0.8"
          />
          <line
            x1="550"
            y1="40"
            x2="550"
            y2="300"
            stroke="#0a0a0a"
            strokeWidth="0.6"
            opacity="0.3"
          />
        </g>

        {/* Left cream hex */}
        <g filter="url(#paper-shadow)">
          <polygon
            points="240,80 330,132 330,212 240,264 150,212 150,132"
            fill="url(#hex-fold-b)"
            stroke="#0a0a0a"
            strokeWidth="0.6"
          />
          <line
            x1="240"
            y1="80"
            x2="240"
            y2="264"
            stroke="#0a0a0a"
            strokeWidth="0.6"
            opacity="0.25"
          />
        </g>

        {/* Right white hex */}
        <g filter="url(#paper-shadow)">
          <polygon
            points="860,80 950,132 950,212 860,264 770,212 770,132"
            fill="url(#hex-fold-c)"
            stroke="#0a0a0a"
            strokeWidth="0.6"
          />
          <line
            x1="860"
            y1="80"
            x2="860"
            y2="264"
            stroke="#0a0a0a"
            strokeWidth="0.6"
            opacity="0.25"
          />
        </g>

        {/* Far-left small hex */}
        <g filter="url(#paper-shadow)">
          <polygon
            points="80,180 120,205 120,255 80,280 40,255 40,205"
            fill="url(#hex-fold-a)"
            stroke="#0a0a0a"
            strokeWidth="0.5"
            opacity="0.85"
          />
        </g>

        {/* Far-right small hex */}
        <g filter="url(#paper-shadow)">
          <polygon
            points="1020,180 1060,205 1060,255 1020,280 980,255 980,205"
            fill="url(#hex-fold-b)"
            stroke="#0a0a0a"
            strokeWidth="0.5"
            opacity="0.85"
          />
        </g>

        {/* Paper plane */}
        <g filter="url(#paper-shadow)" transform="translate(700 60)">
          <polygon
            points="0,0 60,15 30,30 60,15 30,15 0,0"
            fill="#ffffff"
            stroke="#0a0a0a"
            strokeWidth="0.8"
          />
        </g>
      </svg>
    </div>
  );
}
