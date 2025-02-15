import './BrandContainer.css'

function BrandContainer() {
    const brandLogos = [
        {id: 1, image: '/images/b1.png', alt: 'messi'},
        {id: 2, image: '/images/b1.png', alt: 'messi'},
        {id: 3, image: '/images/b1.png', alt: 'messi'},
        {id: 4, image: '/images/b1.png', alt: 'messi'},
        {id: 5, image: '/images/b1.png', alt: 'messi'},
        {id: 6, image: '/images/b1.png', alt: 'messi'},
        {id: 7, image: '/images/b1.png', alt: 'messi'},
        {id: 8, image: '/images/b1.png', alt: 'messi'},
        {id: 9, image: '/images/b1.png', alt: 'messi'},
        {id: 10, image: '/images/b2.png', alt: 'messi'}
    ]
    return(
        <div className="brand-container">
            {brandLogos.map((logo) => (
                <div key={logo.id} className={`item item-${logo.id}`}><img src={logo.image} alt={logo.alt}></img></div>
            ))}
        </div>
    )
}

export default BrandContainer