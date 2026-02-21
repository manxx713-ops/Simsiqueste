import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './MagicalArtifact.css';

const BOOK_OPEN_DURATION = 2;
const BOOK_CLOSE_DURATION = 2;

/**
 * State machine: 'idle' (display art) | 'open' (book visible, then auto-opens) | 'closing' (book closing, then → idle)
 */
export default function MagicalArtifact({ displayArt, description }) {
  const [viewState, setViewState] = useState('idle');
  const [bookOpen, setBookOpen] = useState(false);

  // Once book is visible, trigger 2s opening animation automatically
  useEffect(() => {
    if (viewState !== 'open') return;
    const t = setTimeout(() => setBookOpen(true), 400);
    return () => clearTimeout(t);
  }, [viewState]);

  // When closing: play close animation (2s), then return to idle
  useEffect(() => {
    if (viewState !== 'closing') return;
    setBookOpen(false);
    const t = setTimeout(() => setViewState('idle'), BOOK_CLOSE_DURATION * 1000);
    return () => clearTimeout(t);
  }, [viewState]);

  const handleWaxSealClick = () => {
    setViewState('closing');
  };

  return (
    <div className="magical-artifact perspective-1000">
      <AnimatePresence>
        {/* PHASE 1: Original display art */}
        {viewState === 'idle' && (
          <motion.div
            key="art"
            initial={{ opacity: 1 }}
            exit={{
              opacity: 0,
              scale: 0.9,
              filter: 'blur(10px)',
              transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
            }}
            onClick={() => setViewState('open')}
            className="magical-artifact-art cursor-pointer"
          >
            <img src={displayArt} alt="Artifact" className="magical-artifact-art-img" />
          </motion.div>
        )}

        {/* PHASE 2: 3D book — fades in and scales up, then opens */}
        {(viewState === 'open' || viewState === 'closing') && (
          <motion.div
            key="book"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{
              opacity: 0,
              scale: 0.92,
              transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
            }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            className="magical-artifact-book-wrap"
          >
            <div className="magical-artifact-book-container">
              {/* Back cover (leather) */}
              <div className="magical-artifact-cover magical-artifact-cover-back leather-cover" aria-hidden="true" />
              {/* Inner spread: left page (art) + right page (text + wax seal) */}
              <div
                className="magical-artifact-inner"
                style={{
                  '--book-open': bookOpen ? 1 : 0,
                  '--open-duration': `${BOOK_OPEN_DURATION}s`,
                  '--close-duration': `${BOOK_CLOSE_DURATION}s`,
                }}
              >
                <div className="magical-artifact-page magical-artifact-page-left parchment-page">
                  <div
                    className="magical-artifact-page-art parchment-print"
                    style={{ backgroundImage: displayArt ? `url(${displayArt})` : undefined }}
                  />
                </div>
                <div className="magical-artifact-page magical-artifact-page-right parchment-page">
                  <div className="magical-artifact-page-desc parchment-content">
                    {description}
                  </div>
                  <button
                    type="button"
                    className="magical-artifact-wax-seal"
                    onClick={handleWaxSealClick}
                    aria-label="Close book"
                  >
                    <span className="magical-artifact-wax-seal-sigil">S</span>
                  </button>
                </div>
              </div>
              {/* Front cover (leather) — opens on bookOpen */}
              <div
                className="magical-artifact-cover magical-artifact-cover-front leather-cover"
                aria-hidden="true"
                data-open={bookOpen}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
