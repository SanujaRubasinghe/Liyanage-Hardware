import React from 'react';

const PromoCards = () => {
  return (
    <div className="flex flex-wrap justify-center gap-4 py-4 px-4 max-w-[1400px] mx-auto">
      <div 
        className="flex-1 min-w-[260px] max-w-[360px] h-[400px] rounded-2xl bg-[#d62828] bg-cover bg-center shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
        style={{ backgroundImage: "url('/images/offer5.png')" }}
      >
      </div>

      <div 
        className="flex-1 min-w-[260px] max-w-[360px] h-[400px] rounded-2xl bg-[#fcbf49] bg-cover bg-center shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl relative overflow-hidden group"
        style={{ backgroundImage: "url('/images/offer6.png')" }}
      >
      </div>

      <div 
        className="flex-1 min-w-[260px] max-w-[360px] h-[400px] rounded-2xl bg-[#f77f00] bg-cover bg-center shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl relative overflow-hidden group"
        style={{ backgroundImage: "url('/images/offer2.png')" }}
      >
      </div>
    </div>
  );
};

export default PromoCards;
