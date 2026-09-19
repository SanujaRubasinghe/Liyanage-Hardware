import React from 'react';

const PromoCards = () => {
  return (
    <div className="flex flex-wrap justify-center gap-4 py-4 px-4 max-w-[1400px] mx-auto">
      <div 
        className="flex-1 min-w-[260px] max-w-[360px] h-[320px] p-8 rounded-2xl flex flex-col justify-between text-center bg-[#d62828] text-white bg-cover bg-center shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
        style={{ backgroundImage: "url('/images/offer5.png')" }}
      >
        <div>
          <h2 className="text-3xl font-bold mb-3 drop-shadow-md">New Liyanage<br /><strong>New Prices</strong></h2>
          <p className="text-lg mb-4 drop-shadow-md">Get what you need for <span className="text-[#fff176] font-extrabold">less</span></p>
        </div>
        <button className="mt-auto mb-2 py-3 px-6 bg-transparent text-white border-[3px] border-white font-bold rounded-full cursor-pointer transition-all duration-300 hover:bg-white hover:text-black shadow-sm">
          Shop now & save!
        </button>
      </div>

      <div 
        className="flex-1 min-w-[260px] max-w-[360px] h-[320px] p-8 rounded-2xl flex flex-col justify-between text-center bg-[#fcbf49] text-black bg-cover bg-center shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl relative overflow-hidden group"
        style={{ backgroundImage: "url('/images/offer6.png')" }}
      >
        {/* Optional overlay for text readability if active */}
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300 rounded-2xl"></div>
        <div className="relative z-10">
          {/* <h3 className="text-3xl font-bold mb-3">It pays to refer</h3>
          <p className="text-lg mb-4"><strong>Get 20% OFF</strong><br />for you and your friend.</p> */}
        </div>
        <button className="relative z-10 mt-auto mb-2 py-3 px-6 bg-transparent text-white border-[3px] border-white font-bold rounded-full cursor-pointer transition-all duration-300 hover:bg-white hover:text-black shadow-sm backdrop-blur-sm">
          See offers
        </button>
      </div>

      <div 
        className="flex-1 min-w-[260px] max-w-[360px] h-[320px] p-8 rounded-2xl flex flex-col justify-between text-center bg-[#f77f00] text-white bg-cover bg-center shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl relative overflow-hidden group"
        style={{ backgroundImage: "url('/images/offer2.png')" }}
      >
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300 rounded-2xl"></div>
        <div className="relative z-10">
          {/* <h3 className="text-3xl font-bold mb-3 drop-shadow-md">Want more from a trade account?</h3>
          <p className="text-lg mb-4 drop-shadow-md">Get <strong>Xtra</strong> with <strong>TradeXtra</strong><br />exclusive to the trade.</p> */}
        </div>
        <button className="relative z-10 mt-auto mb-2 py-3 px-6 bg-transparent text-white border-[3px] border-white font-bold rounded-full cursor-pointer transition-all duration-300 hover:bg-white hover:text-black shadow-sm backdrop-blur-sm">
          Find out more
        </button>
      </div>
    </div>
  );
};

export default PromoCards;
