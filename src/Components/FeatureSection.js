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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
          {features.map((feature, index) => (
            <React.Fragment key={index}>
              <div className="flex flex-col items-center text-center px-6 py-4">
                <i className={`${feature.icon} text-2xl mb-3 text-red-200`}></i>
                <h3 className="text-sm font-bold mb-2 leading-tight">{feature.title}</h3>
                <p className="text-xs text-red-100 leading-relaxed">{feature.desc}</p>
              </div>
              {index < features.length - 1 && (
                <div className="hidden md:flex items-center justify-center">
                  <div className="w-px h-14 bg-white/30"></div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeatureSection;
