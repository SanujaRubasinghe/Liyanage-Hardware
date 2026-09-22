'use client';
import React from "react";
import { useNavigate } from "../router-compat";
import { useProductViewTracker } from "../hooks/useProductViewTracker";
import { getImageUrl } from "../utils/imageUrl";
import Image from 'next/image';

const ProductCard = ({ product, isNewArrival = false }) => {
  const navigate = useNavigate();
  const viewRef = useProductViewTracker(product?.product_id);

  const handleBuyNow = () => {
    navigate("/buying", {
      state: {
        product: {
          product_id: product.product_id,
          name: product.name,
          sku: product.sku,
          price: product.price,
          quantity: 1,
          image: product.primary_image,
          delivery_available: product.delivery_available,
          cod_only: product.only_cod,
          colombo_only: product.only_colombo
        }
      },
    });
  };

  const handleDetails = (productId) => {
    navigate(`/products/${productId}`);
  };

  if (!product) {
    return (
      <div className="bg-white p-4 sm:p-5 border border-gray-200 flex flex-col h-[460px] w-[260px] sm:w-[280px]">
        <div className="w-full h-48 bg-gray-100 animate-pulse mb-6"></div>
        <div className="flex-1 flex flex-col">
          <div className="h-3 bg-gray-100 animate-pulse w-1/4 mb-3"></div>
          <div className="h-4 bg-gray-100 animate-pulse w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-100 animate-pulse w-1/2 mb-6"></div>
          
          <div className="h-6 bg-gray-100 animate-pulse w-24 rounded-full mb-4"></div>
          <div className="h-6 bg-gray-100 animate-pulse w-1/2 mb-4 mt-auto"></div>
          <div className="flex gap-2">
            <div className="h-10 bg-gray-100 animate-pulse w-1/2"></div>
            <div className="h-10 bg-gray-100 animate-pulse w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="bg-white p-4 sm:p-5 border border-gray-200 flex flex-col h-[480px] w-[260px] sm:w-[280px] transition-shadow duration-300 hover:shadow-lg group" 
      ref={viewRef}
    >
      {/* Header (Badge) */}
      <div className="flex justify-end items-start mb-2 h-6">
        {isNewArrival && (
          <span className="bg-[#b35959] text-white text-[9px] font-bold px-2 py-1 rounded-full uppercase tracking-wide">
            New Arrival
          </span>
        )}
      </div>

      {/* Image */}
      <div className="w-full h-44 sm:h-48 overflow-hidden mb-5 cursor-pointer flex items-center justify-center relative bg-white">
        <Image
          src={getImageUrl(product.primary_image)} 
          alt={product.name} 
          fill
          sizes="(max-width: 640px) 260px, 280px"
          className="object-contain transition-transform duration-500 group-hover:scale-105" 
          onClick={() => handleDetails(product.product_id)}
          onError={(event) => { event.currentTarget.src = '/images/Sample.jpg'; }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        {/* Title */}
        <h3 
          className="text-[#333333] text-[13px] leading-snug mb-3 line-clamp-2 cursor-pointer hover:text-[#9e3b40] transition-colors" 
          title={product.name}
          onClick={() => handleDetails(product.product_id)}
        >
          {product.name}
        </h3>
        
        {/* Stock Badge */}
        {product.stock_quantity > 0 || product.stock_status === 'in_stock' ? (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#e8f3ec] text-[#2e7d32] text-[10px] font-bold w-fit mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2e7d32]"></span>
            IN STOCK
          </div>
        ) : (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 text-red-600 text-[10px] font-bold w-fit mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
            OUT OF STOCK
          </div>
        )}

        {/* Price & Action */}
        <div className="mt-auto">
          <div className="flex items-baseline gap-1.5 mb-4">
            <span className="text-[11px] text-gray-500 font-medium">From</span>
            <span className="text-[18px] text-[#333333] font-medium">
              Rs {Number(product.price).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
            </span>
            <span className="text-[9px] text-gray-400 uppercase font-medium tracking-wide">inc. VAT</span>
          </div>
          
          <div className="flex gap-2">
            <button 
              className="flex-1 border border-[#CC0100] bg-[#CC0100] text-white py-2 text-[13px] font-medium hover:bg-[#b30000] transition-colors duration-300"
              onClick={handleBuyNow}
            >
              Buy Now
            </button>
            <button 
              className="flex-1 border border-gray-300 text-gray-600 py-2 bg-white text-[13px] font-medium hover:bg-gray-50 hover:text-gray-900 transition-colors duration-300"
              onClick={() => handleDetails(product.product_id)}
            >
              Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
