import React, { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import PromotionalBanner from "./PromotionalBanner";
import API from "../api";

const SECTION_THEMES = [
  { kicker: 'JUST LANDED', icon: 'fas fa-box-open', tagline: 'Fresh tools.\nBetter builds.', subtitle: 'Discover our newest additions for your next big job.' },
  { kicker: 'TOP PICKS', icon: 'fas fa-hard-hat', tagline: 'Build with\nconfidence.', subtitle: 'Premium materials trusted by professionals.' },
  { kicker: 'BEST SELLERS', icon: 'fas fa-tools', tagline: 'The right tool.\nEvery time.', subtitle: 'Our most popular products, loved by customers.' },
];

const CategoryRow = ({ rowConfig, themeIndex = 0 }) => {
  const [products, setProducts] = useState([]);
  const scrollRef = React.useRef(null);
  const theme = SECTION_THEMES[themeIndex % SECTION_THEMES.length];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const categoryId = rowConfig?.category_id || 'new_arrivals';
        let prodRes;
        if (categoryId === 'new_arrivals') {
          prodRes = await API.get('/products/new-arrivals');
        } else {
          prodRes = await API.get(`/products?categoryId=${categoryId}`);
        }
        setProducts(prodRes.data || []);
      } catch (error) {
        console.error(error);
      }
    };
    if (rowConfig) {
      fetchProducts();
    }
  }, [rowConfig]);

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (!rowConfig || !rowConfig.is_active) return null;

  return (
    <div className="w-full mb-8 max-w-[1400px] mx-auto px-4 sm:px-6">
      <div className="flex justify-between items-end mb-4">
        <div>
          <p className="text-[#cc0000] font-bold text-xs tracking-widest uppercase mb-1">
            {theme.kicker}
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            {rowConfig?.name || 'Category'}
          </h2>
        </div>
        <a 
          href={`/category/${rowConfig.category_id}/products`} 
          className="text-[#cc0000] font-bold text-sm hover:underline flex items-center gap-1 cursor-pointer shrink-0"
        >
          View all <i className="fas fa-arrow-right text-xs"></i>
        </a>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 items-stretch">
        {/* Sidebar Card */}
        <div className="w-full lg:w-[280px] lg:min-w-[280px] bg-[#cc0000] rounded-2xl p-6 text-white shrink-0 flex flex-col justify-between shadow-md relative overflow-hidden group min-h-[380px]">
          {/* Grid pattern overlay */}
          <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          
          <div className="relative z-10 h-full flex flex-col">
            <div className="mb-4 text-[#ffeb3b]">
              <i className={`${theme.icon} text-4xl`}></i>
            </div>
            
            <div className="mt-auto mb-6">
              <p className="text-[#ffeb3b] font-bold text-[10px] uppercase tracking-[0.2em] mb-3">LATEST STOCK</p>
              <h3 className="text-2xl sm:text-3xl font-extrabold leading-tight mb-3 whitespace-pre-line">
                {theme.tagline}
              </h3>
              <p className="text-red-200 text-sm leading-relaxed">
                {theme.subtitle}
              </p>
            </div>

            <div className="flex justify-end">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                <i className="fas fa-arrow-right text-lg group-hover:translate-x-1 transition-transform"></i>
              </div>
            </div>
          </div>
          
          {/* Background promotional image (hidden behind content) */}
          <div className="absolute inset-0 z-0 opacity-0">
             <PromotionalBanner location={rowConfig?.location || 'home-page-new-arrivals'} />
          </div>
        </div>

        {/* Product scroll area */}
        <div className="relative flex-1 flex items-center min-w-0">
          {/* Left arrow */}
          <button
            className="absolute -left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white text-[#cc0000] border border-gray-200 shadow-md flex items-center justify-center cursor-pointer z-10 transition-all duration-300 hover:bg-[#cc0000] hover:text-white hover:border-[#cc0000]"
            onClick={() => handleScroll('left')}
            aria-label="Scroll left"
          >
            <i className="fas fa-chevron-left text-sm"></i>
          </button>

          <div 
            className="category-scroll-container flex-1 flex overflow-x-auto gap-4 py-2 px-1 scroll-smooth snap-x snap-mandatory" 
            ref={scrollRef}
          >
            {products.map((product, index) => (
              <div key={index} className="flex-none snap-start">
                <ProductCard product={product} />
              </div>
            ))}
            
            {products.length === 0 && (
              <div className="flex items-center justify-center w-full min-h-[300px]">
                <div className="flex flex-col items-center gap-3 text-gray-400">
                  <div className="w-10 h-10 border-4 border-gray-200 border-t-[#cc0000] rounded-full animate-spin"></div>
                  <span className="text-sm">Loading products...</span>
                </div>
              </div>
            )}
          </div>

          {/* Right arrow */}
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

const CategorySections = () => {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const fetchRows = async () => {
      try {
        const rowsRes = await API.get('/content/homepage-rows');
        setRows(rowsRes.data || []);
      } catch (error) {
        console.error(error);
      }
    };
    fetchRows();
  }, []);

  return (
    <div className="py-4">
      {/* Hide scrollbars globally for category scroll containers */}
      <style>{`
        .category-scroll-container::-webkit-scrollbar { display: none; }
        .category-scroll-container { scrollbar-width: none; -ms-overflow-style: none; }
      `}</style>
      {rows.map((row, index) => (
        <CategoryRow key={row.id || index} rowConfig={row} themeIndex={index} />
      ))}
    </div>
  );
};

export default CategorySections;
