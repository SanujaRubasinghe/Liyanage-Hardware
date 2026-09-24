'use client';
import React, { useState, useEffect, useRef } from 'react';
import ProductCard from './ProductCard';
import API from '../api';
import { getImageUrl } from '../utils/imageUrl';
import Link from 'next/link';

const OfferItemsSection = () => {
  const [rowConfig, setRowConfig] = useState(null);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchOfferConfigAndProducts = async () => {
      try {
        setIsLoading(true);
        const offerRes = await API.get('/content/offer-banner');
        const offerRow = offerRes.data || {
          name: 'Offer Items',
          category_id: 'offers',
          is_active: true,
          image_url: '/images/offer5.png'
        };
        setRowConfig(offerRow);

        const categoryId = offerRow.category_id || 'offers';
        const prodRes = await API.get(`/products?categoryId=${categoryId}&limit=10`);
        setProducts(prodRes.data?.products || []);
      } catch (error) {
        console.error('Error fetching offer section data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOfferConfigAndProducts();
  }, []);

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (rowConfig && rowConfig.is_active === false) return null;

  const bannerImg = rowConfig?.image_url ? getImageUrl(rowConfig.image_url) : '/images/offer5.png';

  return (
    <div className="w-full mb-8 max-w-[1400px] mx-auto px-4 sm:px-6">
      <style>{`
        .offer-scroll-container::-webkit-scrollbar { display: none; }
        .offer-scroll-container { scrollbar-width: none; -ms-overflow-style: none; }
      `}</style>
      
      {/* Section Header */}
      <div className="flex justify-between items-end mb-4">
        <div>
          <p className="text-[#cc0000] font-bold text-xs tracking-widest uppercase mb-1">
            SPECIAL OFFERS
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            {rowConfig?.name || 'Offer Items'}
          </h2>
        </div>
        <Link
          href={
            rowConfig?.category_id && !['offers', 'new_arrivals'].includes(rowConfig.category_id)
              ? `/category/${rowConfig.category_id}`
              : '/products'
          }
          className="text-[#cc0000] font-bold text-sm hover:underline flex items-center gap-1 cursor-pointer shrink-0"
        >
          View all <i className="fas fa-arrow-right text-xs"></i>
        </Link>
      </div>

      {/* Main Content Layout */}
      <div className="flex flex-col lg:flex-row gap-4 items-stretch">
        {/* Left Promo Card */}
        <div className="w-full lg:w-[280px] lg:min-w-[280px] bg-black rounded-2xl p-6 text-white shrink-0 flex flex-col justify-between shadow-md relative overflow-hidden group min-h-[380px]">
          {/* Background Image Banner */}
          <div className="absolute inset-0 z-0 opacity-80 group-hover:opacity-100 transition-opacity duration-500">
            <img 
              src={bannerImg} 
              alt={rowConfig?.name || "Offer Items Banner"} 
              className="w-full h-full object-cover"
            />
            {/* Gradient overlay for contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30 pointer-events-none" />
          </div>

          {/* Subtle grid pattern background */}
          <div 
            className="absolute inset-0 opacity-[0.1] pointer-events-none z-0" 
            style={{ 
              backgroundImage: 'linear-gradient(rgb(255, 255, 255) 1px, transparent 1px), linear-gradient(90deg, rgb(255, 255, 255) 1px, transparent 1px)', 
              backgroundSize: '20px 20px' 
            }} 
          />
          
          <div className="relative z-10 h-full flex flex-col">
            <div className="mb-4 text-[#ffeb3b]">
              <i className="fas fa-tags text-4xl"></i>
            </div>
            
            <div className="mt-auto mb-6">
              <p className="text-[#ffeb3b] font-bold text-[10px] uppercase tracking-[0.2em] mb-3">
                HOT DEALS
              </p>
              <h3 className="text-2xl sm:text-3xl font-extrabold leading-tight mb-3 whitespace-pre-line">
                {`Mega Savings.\nBest Deals.`}
              </h3>
              <p className="text-gray-200 text-sm leading-relaxed">
                Discover our special discount offers on high quality hardware tools & supplies.
              </p>
            </div>

            <div className="flex justify-end">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                <i className="fas fa-arrow-right text-lg group-hover:translate-x-1 transition-transform"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Right Scrollable Product List */}
        <div className="relative flex-1 flex items-center min-w-0">
          <button 
            className="absolute -left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white text-[#cc0000] border border-gray-200 shadow-md flex items-center justify-center cursor-pointer z-10 transition-all duration-300 hover:bg-[#cc0000] hover:text-white hover:border-[#cc0000]"
            onClick={() => handleScroll('left')}
            aria-label="Scroll left"
          >
            <i className="fas fa-chevron-left text-sm"></i>
          </button>

          <div 
            className="offer-scroll-container flex-1 flex overflow-x-auto gap-4 py-2 px-1 scroll-smooth snap-x snap-mandatory"
            ref={scrollRef}
          >
            {products.map((product, index) => (
              <div key={product.product_id || index} className="flex-none snap-start">
                <ProductCard product={product} />
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center justify-center w-full min-h-[300px]">
                <div className="flex flex-col items-center gap-3 text-gray-400">
                  <div className="w-10 h-10 border-4 border-gray-200 border-t-[#cc0000] rounded-full animate-spin"></div>
                  <span className="text-sm">Loading offer items...</span>
                </div>
              </div>
            )}
          </div>

          <button 
            className="absolute -right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white text-[#cc0000] border border-gray-200 shadow-md flex items-center justify-center cursor-pointer z-10 transition-all duration-300 hover:bg-[#cc0000] hover:text-white hover:border-[#cc0000]"
            onClick={() => handleScroll('right')}
            aria-label="Scroll right"
          >
            <i className="fas fa-chevron-right text-sm"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default OfferItemsSection;
