import React from "react";

const ConstructionSupplies = () => {
  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-10">
      <div className="text-center mb-6">
        <p className="text-[#cc0000] font-bold text-sm tracking-wider uppercase mb-1">WHO WE ARE</p>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
          About <span className="text-[#cc0000]">Us</span>
        </h2>
      </div>
      
      <div className="flex flex-col md:flex-row bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100">
        <div className="md:w-1/2 min-h-[300px] md:min-h-[400px]">
          <img 
            src="/images/frontlook.webp" 
            alt="Liyanage Hardware Storefront" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="md:w-1/2 p-8 md:p-10 bg-gray-50 flex flex-col justify-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Experts in <span className="text-[#f77f00]">Hardware</span> and <span className="text-[#f77f00]">Construction Products</span>
          </h3>
          <p className="text-gray-600 text-[15px] leading-relaxed mb-4">
            At Liyanage Hardware, we take pride in being your trusted partner for all construction and home improvement needs. With a strong commitment to quality, reliability, and customer satisfaction, we have been serving our community with top-notch hardware products for years.
          </p>
          <p className="text-gray-600 text-[15px] leading-relaxed mb-4">
            Our extensive range includes cement, steel, paints, plumbing materials, electrical fittings, tools, and more — everything you need to build, renovate, or enhance your space.
          </p>
          <p className="text-gray-600 text-[15px] leading-relaxed">
            We believe in building strong foundations — both in construction and in relationships. Visit us today and experience quality, affordability, and exceptional service all under one roof!
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConstructionSupplies;
