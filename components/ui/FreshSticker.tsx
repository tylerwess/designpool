export function FreshSticker() {
  return (
    <span className="fresh-sticker" aria-hidden="true">
      <svg viewBox="0 0 120 120" width="100%" height="100%" overflow="visible">
        <path
          className="fresh-sticker-back"
          d="M60.0,6.6 L64.88,4.21 L70.18,2.29 L74.49,5.91 L78.26,9.82 L83.67,9.25 L89.3,9.25 L92.12,14.13 L94.32,19.09 L99.6,20.4 L104.89,22.33 L105.87,27.88 L106.25,33.3 L110.75,36.33 L115.07,39.96 L114.09,45.51 L112.59,50.73 L115.79,55.12 L118.6,60.0 L115.79,64.88 L112.59,69.27 L114.09,74.49 L115.07,80.04 L110.75,83.67 L106.25,86.7 L105.87,92.12 L104.89,97.67 L99.6,99.6 L94.32,100.91 L92.12,105.87 L89.3,110.75 L83.67,110.75 L78.26,110.18 L74.49,114.09 L70.18,117.71 L64.88,115.79 L60.0,113.4 L55.12,115.79 L49.82,117.71 L45.51,114.09 L41.74,110.18 L36.33,110.75 L30.7,110.75 L27.88,105.87 L25.68,100.91 L20.4,99.6 L15.11,97.67 L14.13,92.12 L13.75,86.7 L9.25,83.67 L4.93,80.04 L5.91,74.49 L7.41,69.27 L4.21,64.88 L1.4,60.0 L4.21,55.12 L7.41,50.73 L5.91,45.51 L4.93,39.96 L9.25,36.33 L13.75,33.3 L14.13,27.88 L15.11,22.33 L20.4,20.4 L25.68,19.09 L27.88,14.13 L30.7,9.25 L36.33,9.25 L41.74,9.82 L45.51,5.91 L49.82,2.29 L55.12,4.21 Z"
        />
        <path
          className="fresh-sticker-face"
          d="M60.0,11.0 L64.46,8.99 L69.27,7.41 L73.25,10.54 L76.76,13.96 L81.64,13.6 L86.7,13.75 L89.37,18.06 L91.5,22.46 L96.2,23.8 L100.91,25.68 L101.94,30.63 L102.44,35.5 L106.4,38.36 L110.18,41.74 L109.46,46.75 L108.26,51.49 L111.01,55.54 L113.4,60.0 L111.01,64.46 L108.26,68.51 L109.46,73.25 L110.18,78.26 L106.4,81.64 L102.44,84.5 L101.94,89.37 L100.91,94.32 L96.2,96.2 L91.5,97.54 L89.37,101.94 L86.7,106.25 L81.64,106.4 L76.76,106.04 L73.25,109.46 L69.27,112.59 L64.46,111.01 L60.0,109.0 L55.54,111.01 L50.73,112.59 L46.75,109.46 L43.24,106.04 L38.36,106.4 L33.3,106.25 L30.63,101.94 L28.5,97.54 L23.8,96.2 L19.09,94.32 L18.06,89.37 L17.56,84.5 L13.6,81.64 L9.82,78.26 L10.54,73.25 L11.74,68.51 L8.99,64.46 L6.6,60.0 L8.99,55.54 L11.74,51.49 L10.54,46.75 L9.82,41.74 L13.6,38.36 L17.56,35.5 L18.06,30.63 L19.09,25.68 L23.8,23.8 L28.5,22.46 L30.63,18.06 L33.3,13.75 L38.36,13.6 L43.24,13.96 L46.75,10.54 L50.73,7.41 L55.54,8.99 Z"
        />
        <circle className="fresh-sticker-ring" cx="60" cy="60" r="36" />
        <path id="fresh-arc-top" d="M28,64 A32,32 0 0 1 92,64" fill="none" />
        <path id="fresh-arc-bot" d="M26,66 A34,34 0 0 0 94,66" fill="none" />
        <text className="fresh-sticker-type fresh-sticker-arc">
          <textPath href="#fresh-arc-top" startOffset="50%" textAnchor="middle">
            FRESH JOBS
          </textPath>
        </text>
        <text className="fresh-sticker-type fresh-sticker-arc">
          <textPath href="#fresh-arc-bot" startOffset="50%" textAnchor="middle">
            GUARANTEED
          </textPath>
        </text>
        <text className="fresh-sticker-type fresh-sticker-plu" x="60" y="58" textAnchor="middle">
          30
        </text>
        <text className="fresh-sticker-type fresh-sticker-day" x="60" y="72" textAnchor="middle">
          DAY
        </text>
        <ellipse className="fresh-sticker-gloss" cx="44" cy="38" rx="16" ry="9" />
      </svg>
    </span>
  );
}
