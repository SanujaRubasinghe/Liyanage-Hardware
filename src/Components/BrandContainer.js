function BrandContainer() {
    const brandLogos = [
        {id: 1, image: '/images/b1.png', alt: 'Brand 1'},
        {id: 2, image: '/images/b1.png', alt: 'Brand 2'},
        {id: 3, image: '/images/b1.png', alt: 'Brand 3'},
        {id: 4, image: '/images/b1.png', alt: 'Brand 4'},
        {id: 5, image: '/images/b1.png', alt: 'Brand 5'},
        {id: 6, image: '/images/b1.png', alt: 'Brand 6'},
        {id: 7, image: '/images/b1.png', alt: 'Brand 7'},
        {id: 8, image: '/images/b1.png', alt: 'Brand 8'},
        {id: 9, image: '/images/b1.png', alt: 'Brand 9'},
        {id: 10, image: '/images/b2.png', alt: 'Brand 10'}
    ]
    return(
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-10">
            <div className="text-center mb-6">
                <p className="text-[#cc0000] font-bold text-sm tracking-wider uppercase mb-1">TRUSTED PARTNERS</p>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
                    Our <span className="text-[#cc0000]">Brands</span>
                </h2>
            </div>
            <div className="grid grid-cols-5 sm:grid-cols-5 md:grid-cols-10 gap-4 items-center bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                {brandLogos.map((logo) => (
                    <div 
                        key={logo.id} 
                        className="flex items-center justify-center p-3 grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100"
                    >
                        <img 
                            src={logo.image} 
                            alt={logo.alt} 
                            className="max-h-12 w-auto object-contain"
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default BrandContainer