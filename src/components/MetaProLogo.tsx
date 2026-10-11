import React from 'react';

interface MetaProLogoProps {
  variant?: 'full' | 'stacked' | 'compact' | 'symbol';
  theme?: 'dark' | 'light';
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showCornerFrame?: boolean;
}

export const MetaProLogo: React.FC<MetaProLogoProps> = ({
  variant = 'full',
  theme = 'light',
  className = '',
  size = 'md',
  showCornerFrame = false,
}) => {
  // Exact brand colors from the official MetaPro Enterprises logo
  const navyColor = theme === 'dark' ? '#FFFFFF' : '#08142C';
  const subNavyColor = theme === 'dark' ? '#E2E8F0' : '#08142C';
  const goldColor = '#EAB01E';

  const sizeConfig = {
    xs: {
      symbolH: 'h-7',
      stackedSymbolH: 'h-12',
      wordmarkText: 'text-sm sm:text-base',
      subText: 'text-[7px]',
      lineW: 'w-4',
      diamondSize: 'w-1.5 h-1.5',
    },
    sm: {
      symbolH: 'h-9',
      stackedSymbolH: 'h-16',
      wordmarkText: 'text-base sm:text-lg',
      subText: 'text-[8px]',
      lineW: 'w-5 sm:w-6',
      diamondSize: 'w-1.5 h-1.5',
    },
    md: {
      symbolH: 'h-11 sm:h-12',
      stackedSymbolH: 'h-20 sm:h-24',
      wordmarkText: 'text-lg sm:text-xl',
      subText: 'text-[8.5px] sm:text-[9.5px]',
      lineW: 'w-6 sm:w-8',
      diamondSize: 'w-2 h-2',
    },
    lg: {
      symbolH: 'h-14 sm:h-16',
      stackedSymbolH: 'h-28 sm:h-32',
      wordmarkText: 'text-2xl sm:text-3xl',
      subText: 'text-[10px] sm:text-xs',
      lineW: 'w-8 sm:w-12',
      diamondSize: 'w-2.5 h-2.5',
    },
    xl: {
      symbolH: 'h-20 sm:h-24',
      stackedSymbolH: 'h-36 sm:h-44',
      wordmarkText: 'text-3xl sm:text-4xl',
      subText: 'text-xs sm:text-sm',
      lineW: 'w-12 sm:w-16',
      diamondSize: 'w-3 h-3',
    },
  };

  const currentSize = sizeConfig[size] || sizeConfig.md;

  // Exact interlocking MP Monogram from the user's official logo
  const renderMonogram = (heightClass: string) => (
    <svg
      viewBox="0 0 200 190"
      className={`${heightClass} w-auto shrink-0 select-none`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="MetaPro Enterprises MP Monogram"
    >
      {/* Left vertical leg + left diagonal arm of M (stops cleanly before right slash) */}
      <path
        d="M 32 18 L 105 73 L 90 85 L 54 58 L 54 156 L 32 156 Z"
        fill={navyColor}
      />

      {/* Right diagonal slash + right upper peak of M */}
      <path
        d="M 78 102 L 168 18 L 168 72 C 161 67 154 65 146 65 L 146 51 L 78 116 Z"
        fill={navyColor}
      />

      {/* Gold P vertical stem with angled top parallel to M slash */}
      <path
        d="M 104 113 L 126 95 L 126 174 L 104 174 Z"
        fill={goldColor}
      />

      {/* Gold P curved bowl with angled top-left cut and clean separation gap */}
      <path
        d="M 132 90 L 149 76 C 175 76 191 92 191 114 C 191 136 175 151 151 151 L 133 151 L 133 131 L 150 131 C 163 131 170 124 170 114 C 170 103 163 96 149 96 L 132 96 Z"
        fill={goldColor}
      />
    </svg>
  );

  // Wordmark lockup: METΛPRO + — ENTERPRISES — + ◆
  const WordmarkBlock = (
    <div className="flex flex-col items-center justify-center select-none">
      {/* METΛPRO */}
      <div
        className={`flex items-center font-extrabold tracking-[0.18em] leading-none ${currentSize.wordmarkText}`}
      >
        <span style={{ color: navyColor }}>MET</span>
        {/* Stylized crossbar-free chevron A (Λ) */}
        <svg
          viewBox="0 0 24 24"
          className="h-[0.82em] w-auto mx-[0.02em] -mb-[0.04em] inline-block"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M 12 2.5 L 22 21.5 L 17.4 21.5 L 12 10.6 L 6.6 21.5 L 2 21.5 Z"
            fill={navyColor}
          />
        </svg>
        <span style={{ color: goldColor }} className="ml-[0.06em]">
          PRO
        </span>
      </div>

      {/* Left Navy Line + ENTERPRISES + Right Gold Line */}
      <div className="flex items-center justify-center gap-2 sm:gap-2.5 mt-1.5 w-full">
        <span
          className={`h-[1.5px] ${currentSize.lineW} shrink-0 block`}
          style={{ backgroundColor: navyColor }}
        />
        <span
          className={`font-bold tracking-[0.28em] uppercase leading-none ${currentSize.subText}`}
          style={{ color: subNavyColor }}
        >
          ENTERPRISES
        </span>
        <span
          className={`h-[1.5px] ${currentSize.lineW} shrink-0 block`}
          style={{ backgroundColor: goldColor }}
        />
      </div>

      {/* Centered Gold Diamond Accent */}
      <div className="flex justify-center mt-1">
        <span
          className={`${currentSize.diamondSize} rotate-45 block`}
          style={{ backgroundColor: goldColor }}
        />
      </div>
    </div>
  );

  if (variant === 'symbol') {
    return (
      <div className={`inline-flex items-center ${className}`}>
        {renderMonogram(currentSize.symbolH)}
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`inline-flex items-center gap-2.5 ${className}`}>
        {renderMonogram(currentSize.symbolH)}
        <div className="flex flex-col leading-none">
          <div className="flex items-center font-extrabold tracking-[0.16em] text-base sm:text-lg">
            <span style={{ color: navyColor }}>MET</span>
            <span style={{ color: navyColor }}>Λ</span>
            <span style={{ color: goldColor }}>PRO</span>
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="h-[1px] w-3 block" style={{ backgroundColor: navyColor }} />
            <span
              className="text-[7.5px] font-bold tracking-[0.24em] uppercase"
              style={{ color: subNavyColor }}
            >
              ENTERPRISES
            </span>
            <span className="h-[1px] w-3 block" style={{ backgroundColor: goldColor }} />
          </div>
        </div>
      </div>
    );
  }

  // Stacked vertical composition matching the uploaded image 1:1
  if (variant === 'stacked') {
    return (
      <div
        className={`relative inline-flex flex-col items-center justify-center ${
          showCornerFrame
            ? 'p-8 sm:p-12 bg-white rounded-2xl border border-stone-200/90 shadow-sm overflow-hidden'
            : ''
        } ${className}`}
      >
        {showCornerFrame && (
          <>
            {/* Architectural geometric gold/navy corner linework inspired by the uploaded logo card */}
            <svg
              viewBox="0 0 120 120"
              className="w-20 h-20 sm:w-28 sm:h-28 absolute top-0 left-0 pointer-events-none"
              fill="none"
            >
              <path d="M 0 95 L 95 0 M 0 70 L 70 0 M 15 55 L 40 80 L 90 30" stroke="#EAB01E" strokeWidth="1.2" />
              <rect x="34" y="24" width="8" height="8" transform="rotate(45 34 24)" stroke="#08142C" strokeWidth="1.8" fill="white" />
              <rect x="24" y="44" width="9" height="9" transform="rotate(45 24 44)" fill="#08142C" />
            </svg>
            <svg
              viewBox="0 0 120 120"
              className="w-20 h-20 sm:w-28 sm:h-28 absolute top-0 right-0 pointer-events-none"
              fill="none"
            >
              <path d="M 25 0 L 120 95 M 50 0 L 120 70 M 45 25 L 85 65 L 115 35" stroke="#EAB01E" strokeWidth="1.2" />
              <rect x="82" y="22" width="10" height="10" transform="rotate(45 82 22)" fill="#EAB01E" />
            </svg>
            <svg
              viewBox="0 0 120 120"
              className="w-20 h-20 sm:w-28 sm:h-28 absolute bottom-0 left-0 pointer-events-none"
              fill="none"
            >
              <path d="M 0 25 L 95 120 M 0 50 L 70 120 M 15 85 L 45 55 L 85 95" stroke="#EAB01E" strokeWidth="1.2" />
            </svg>
            <svg
              viewBox="0 0 120 120"
              className="w-20 h-20 sm:w-28 sm:h-28 absolute bottom-0 right-0 pointer-events-none"
              fill="none"
            >
              <path d="M 25 120 L 120 25 M 50 120 L 120 50 M 35 95 L 80 50 L 105 75" stroke="#EAB01E" strokeWidth="1.2" />
              <rect x="86" y="64" width="8" height="8" transform="rotate(45 86 64)" fill="#08142C" />
            </svg>
          </>
        )}
        <div className="relative z-10 flex flex-col items-center gap-3">
          {renderMonogram(currentSize.stackedSymbolH)}
          {WordmarkBlock}
        </div>
      </div>
    );
  }

  // Horizontal 'full' variant (Monogram + Full Wordmark with Navy/Gold lines & Diamond)
  return (
    <div className={`inline-flex items-center gap-2.5 sm:gap-3 ${className}`}>
      {renderMonogram(currentSize.symbolH)}
      {WordmarkBlock}
    </div>
  );
};
