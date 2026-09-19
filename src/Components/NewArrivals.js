import React, { useState, useEffect, useRef } from "react";
import ProductCard from "./ProductCard";
import PromotionalBanner from "./PromotionalBanner";
import API from "../api";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [rowConfig, setRowConfig] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchRowAndProducts = async () => {
      try {
        const rowsRes = await API.get('/content/homepage-rows');
        const rConfig = rowsRes.data?.find(r => r.location === 'home-row-1' || r.location === 'home-page-new-arrivals') || rowsRes.data?.[0];
        setRowConfig(rConfig);

        const categoryId = rConfig?.category_id || 'new_arrivals';
        let prodRes;
        if (categoryId === 'new_arrivals') {
          prodRes = await API.get('/products/new-arrivals');
        } else {
          prodRes = await API.get(`/products?categoryId=${categoryId}`);
        }
        setProducts(prodRes.data || []);
      } catch (error) {
        console.log(error);
      }
    };
    fetchRowAndProducts();
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

  return (
    <div className="w-full mb-10 max-w-[1400px] mx-auto px-4 sm:px-6">
      <h2 className="text-center text-3xl sm:text-4xl font-extrabold mb-6">
        <span className="text-[#cc0000]">{rowConfig?.name || 'New Arrivals'}</span>
      </h2>

      <div className="flex flex-col lg:flex-row gap-6 p-4 sm:p-6 bg-white rounded-2xl items-stretch border border-gray-100 shadow-sm">
        <div className="w-full lg:w-[260px] min-w-[260px] bg-[#e53935] rounded-2xl p-5 text-center shrink-0 flex items-center justify-center shadow-inner">
          <PromotionalBanner location={rowConfig?.location || 'home-page-new-arrivals'} />
        </div>

        <div className="relative flex-1 flex items-center min-w-0">
          <button
            className="absolute -left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white text-[#cc0000] border border-gray-200 shadow-md flex items-center justify-center text-lg cursor-pointer z-10 transition-all duration-300 hover:bg-[#cc0000] hover:text-white hover:border-[#cc0000] hover:shadow-lg sm:-left-3"
            onClick={() => handleScroll('left')}
            aria-label="Scroll left"
          >
            <i className="fas fa-chevron-left"></i>
          </button>

          <div 
            className="flex-1 flex overflow-x-auto gap-4 py-2 px-1 scroll-smooth snap-x snap-mandatory" 
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            ref={scrollRef}
          >
            {/* Hide scrollbar for webkit */}
            <style>{`
              .flex-1::-webkit-scrollbar { display: none; }
            `}</style>
            
            {products.map((product, index) => (
              <div key={index} className="flex-none snap-start">
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          <button
            className="absolute -right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white text-[#cc0000] border border-gray-200 shadow-md flex items-center justify-center text-lg cursor-pointer z-10 transition-all duration-300 hover:bg-[#cc0000] hover:text-white hover:border-[#cc0000] hover:shadow-lg sm:-right-3"
            onClick={() => handleScroll('right')}
            aria-label="Scroll right"
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductList;