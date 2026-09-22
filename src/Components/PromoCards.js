import React from 'react';

const PromoCards = () => {
  return (
    <div className="w-full overflow-x-auto py-2 scrollbar-none snap-x snap-mandatory">
      <div className="flex md:flex-wrap justify-start md:justify-center gap-4 px-4 max-w-[1400px] mx-auto min-w-max md:min-w-0">
        <div 
          className="flex-shrink-0 md:flex-1 w-[82vw] sm:w-[320px] md:w-auto min-w-[260px] max-w-[360px] h-[340px] sm:h-[400px] rounded-2xl bg-[#d62828] bg-cover bg-center shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl snap-center"
          style={{ backgroundImage: "url('/images/offer5.png')" }}
        >
        </div>

        <div 
          className="flex-shrink-0 md:flex-1 w-[82vw] sm:w-[320px] md:w-auto min-w-[260px] max-w-[360px] h-[340px] sm:h-[400px] rounded-2xl bg-[#fcbf49] bg-cover bg-center shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl relative overflow-hidden group snap-center"
          style={{ backgroundImage: "url('/images/offer6.png')" }}
        >
        </div>

        <div 
          className="flex-shrink-0 md:flex-1 w-[82vw] sm:w-[320px] md:w-auto min-w-[260px] max-w-[360px] h-[340px] sm:h-[400px] rounded-2xl bg-[#f77f00] bg-cover bg-center shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl relative overflow-hidden group snap-center"
          style={{ backgroundImage: "url('/images/offer2.png')" }}
        >
        </div>
      </div>
    </div>
  );
};

export default PromoCards;

