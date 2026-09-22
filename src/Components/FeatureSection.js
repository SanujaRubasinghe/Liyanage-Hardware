import React from "react";

const FeatureSection = () => {
  const features = [
    {
      icon: "fas fa-headset",
      title: "A GREAT CUSTOMER SERVICE TEAM",
      desc: "Our dedicated customer service team are always happy to help with any enquiry."
    },
    {
      icon: "fas fa-tags",
      title: "Rs.1,000 OFF ON ORDERS OVER Rs.25,000",
      desc: "Spend over Rs.25,000 today and receive an automatic Rs.1,000 discount at checkout."
    },
    {
      icon: "fas fa-star",
      title: "EXCELLENT REVIEWS – \"GREAT QUALITY & PRICE\"",
      desc: "Happy customers and fantastic products result in excellent reviews."
    }
  ];

  return (
    <div className="bg-[#cc0000] text-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-0">
          {features.map((feature, index) => (
            <React.Fragment key={index}>
              <div className="flex-1 flex flex-col items-center text-center px-4 py-2 sm:px-6 sm:py-4">
                <i className={`${feature.icon} text-2xl mb-3 text-red-200`}></i>
                <h3 className="text-sm font-bold mb-2 leading-tight">{feature.title}</h3>
                <p className="text-xs text-red-100 leading-relaxed">{feature.desc}</p>
              </div>
              {index < features.length - 1 && (
                <div className="hidden md:block w-px h-16 bg-white/30 self-center flex-shrink-0"></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};


export default FeatureSection;
