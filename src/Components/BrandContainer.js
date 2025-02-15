import './BrandContainer.css'

function BrandContainer() {
    const brandLogos = [
        {id: 1, image: '/images/b1.png', alt: 'messi'},
        {id: 2, image: '/images/b2.png', alt: 'messi'}
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