import './BrandContainer.css'

function BrandContainer() {
    const brandLogos = [
        {id: 1, image: '/images/messi.webp', alt: 'messi'}
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