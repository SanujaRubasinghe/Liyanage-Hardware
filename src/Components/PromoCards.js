import React, { useState, useEffect } from 'react';
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPromoCards = async () => {
      try {
        const response = await API.get('/content/banners/active');
        if (response.data && response.data.length > 0) {
          const promoItems = response.data.flatMap((banner, index) => {
            if (banner.images && banner.images.length > 0) {
              return banner.images.map(img => ({
                id: img.id || `${banner.id}-${img.image_url}`,
                image_url: getImageUrl(img.image_url),
                alt_text: img.alt_text || banner.name,
                bg_color: CARD_COLORS[index % CARD_COLORS.length]
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

  const displayCards = cards.length > 0 ? cards : DEFAULT_CARDS;

  return (
    <div className="w-full overflow-x-auto py-2 scrollbar-none snap-x snap-mandatory">
      <div className="flex md:flex-wrap justify-start md:justify-center gap-4 px-4 max-w-[1400px] mx-auto min-w-max md:min-w-0">
        {displayCards.map((card, idx) => (
          <div
            key={card.id || idx}
            className="flex-shrink-0 md:flex-1 w-[82vw] sm:w-[320px] md:w-auto min-w-[260px] max-w-[360px] h-[340px] sm:h-[400px] rounded-2xl bg-cover bg-center shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl snap-center relative overflow-hidden group"
            style={{ 
              backgroundColor: card.bg_color || CARD_COLORS[idx % CARD_COLORS.length],
              backgroundImage: `url('${card.image_url}')` 
            }}
          >
          </div>
        ))}
      </div>
    </div>
  );
};

export default PromoCards;


