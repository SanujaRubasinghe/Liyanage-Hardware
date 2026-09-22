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

  // Rotate every 3 seconds (3000ms) if cards count > 3 and not hovered
  useEffect(() => {
    if (allCards.length <= 3 || isHovered) return;

    const timer = setInterval(() => {
      setStartIndex(prev => (prev + 1) % allCards.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [allCards.length, isHovered]);

  // Compute 3 visible cards
  const visibleCards = React.useMemo(() => {
    if (allCards.length <= 3) {
      return allCards.map((c, i) => ({ ...c, slotIndex: i }));
    }
    return [0, 1, 2].map((offset) => {
      const idx = (startIndex + offset) % allCards.length;
      return {
        ...allCards[idx],
        slotIndex: offset
      };
    });
  }, [allCards, startIndex]);

  return (
    <div 
      className="w-full overflow-x-auto py-4 scrollbar-none snap-x snap-mandatory"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex md:flex-wrap justify-start md:justify-center gap-4 px-4 max-w-[1400px] mx-auto min-w-max md:min-w-0">
        <AnimatePresence mode="popLayout">
          {visibleCards.map((card, idx) => (
            <motion.div
              key={`${card.id}-${card.slotIndex}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="flex-shrink-0 md:flex-1 w-[82vw] sm:w-[320px] md:w-auto min-w-[260px] max-w-[360px] h-[340px] sm:h-[400px] rounded-2xl bg-cover bg-center shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl snap-center relative overflow-hidden group"
              style={{ 
                backgroundColor: card.bg_color || CARD_COLORS[idx % CARD_COLORS.length],
                backgroundImage: `url('${card.image_url}')` 
              }}
            >
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Slide Indicators if total cards > 3 */}
      {allCards.length > 3 && (
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



