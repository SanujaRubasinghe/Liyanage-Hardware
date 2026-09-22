import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../api';
import { getImageUrl } from '../utils/imageUrl';

const DEFAULT_CARDS = [
  { id: 'def-1', image_url: '/images/offer5.png', bg_color: '#d62828' },
  { id: 'def-2', image_url: '/images/offer6.png', bg_color: '#fcbf49' },
  { id: 'def-3', image_url: '/images/offer2.png', bg_color: '#f77f00' },
];

const CARD_COLORS = ['#d62828', '#fcbf49', '#f77f00', '#2a9d8f', '#e76f51', '#457b9d'];

const PromoCards = () => {
  const [cards, setCards] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPromoCards = async () => {
      try {
        const response = await API.get('/content/banners/active');
        if (response.data && response.data.length > 0) {
          const promoItems = response.data.flatMap((banner, bannerIdx) => {
            if (banner.images && banner.images.length > 0) {
              return banner.images.map((img, imgIdx) => ({
                id: img.id || `${banner.id}-${imgIdx}`,
                image_url: getImageUrl(img.image_url),
                alt_text: img.alt_text || banner.name,
                bg_color: CARD_COLORS[(bannerIdx + imgIdx) % CARD_COLORS.length]
              }));
            }
            return [];
          });

          if (promoItems.length > 0) {
            setCards(promoItems);
          } else {
            setCards(DEFAULT_CARDS);
          }
        } else {
          setCards(DEFAULT_CARDS);
        }
      } catch (err) {
        console.error('Error loading promo cards:', err);
        setCards(DEFAULT_CARDS);
      } finally {
        setLoading(false);
      }
    };

    fetchPromoCards();
  }, []);

  const allCards = cards.length > 0 ? cards : DEFAULT_CARDS;

  // Rotate every 3 seconds (3000ms) whenever there is more than 1 card
  useEffect(() => {
    if (allCards.length <= 1) return;

    const timer = setInterval(() => {
      setStartIndex((prev) => (prev + 1) % allCards.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [allCards.length]);

  // Compute 3 visible cards
  const visibleCards = React.useMemo(() => {
    if (allCards.length === 0) return [];
    if (allCards.length === 1) {
      return [{ ...allCards[0], slotIndex: 0 }];
    }
    if (allCards.length === 2) {
      return [
        { ...allCards[startIndex % 2], slotIndex: 0 },
        { ...allCards[(startIndex + 1) % 2], slotIndex: 1 },
      ];
    }
    return [0, 1, 2].map((offset) => {
      const idx = (startIndex + offset) % allCards.length;
      return {
        ...allCards[idx],
        slotIndex: offset
      };
    });
  }, [allCards, startIndex]);

  const handlePrev = () => {
    setStartIndex((prev) => (prev - 1 + allCards.length) % allCards.length);
  };

  const handleNext = () => {
    setStartIndex((prev) => (prev + 1) % allCards.length);
  };

  return (
    <div className="w-full relative py-4">
      <div className="max-w-[1400px] mx-auto px-4 relative flex items-center">
        {/* Left Arrow Button (Black icon) */}
        {allCards.length > 1 && (
          <button
            onClick={handlePrev}
            className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center text-black hover:bg-gray-100 hover:scale-110 transition-all cursor-pointer"
            aria-label="Previous cards"
          >
            <i className="fas fa-chevron-left text-black text-base"></i>
          </button>
        )}

        <div className="w-full overflow-x-auto scrollbar-none snap-x snap-mandatory">
          <div className="flex md:flex-wrap justify-start md:justify-center gap-4 px-2 sm:px-6 min-w-max md:min-w-0">
            {visibleCards.map((card, idx) => (
              <div
                key={`slot-${card.slotIndex}`}
                className="flex-shrink-0 md:flex-1 w-[82vw] sm:w-[320px] md:w-auto min-w-[260px] max-w-[360px] h-[340px] sm:h-[400px] rounded-2xl bg-cover bg-center shadow-md transition-all duration-700 ease-in-out hover:-translate-y-2 hover:shadow-xl snap-center relative overflow-hidden group"
                style={{ 
                  backgroundColor: card.bg_color || CARD_COLORS[idx % CARD_COLORS.length],
                  backgroundImage: `url('${card.image_url}')` 
                }}
              />
            ))}
          </div>
        </div>

        {/* Right Arrow Button (Black icon) */}
        {allCards.length > 1 && (
          <button
            onClick={handleNext}
            className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center text-black hover:bg-gray-100 hover:scale-110 transition-all cursor-pointer"
            aria-label="Next cards"
          >
            <i className="fas fa-chevron-right text-black text-base"></i>
          </button>
        )}
      </div>

      {/* Slide Indicators if total cards > 1 */}
      {allCards.length > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4">
          {allCards.map((_, i) => (
            <button
              key={i}
              onClick={() => setStartIndex(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                startIndex === i ? 'w-6 bg-red-600' : 'w-2 bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PromoCards;



