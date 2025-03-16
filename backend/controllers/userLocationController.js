const pool = require("../db")

exports.getDeliveryCharges = async (req, res) => {
    const {latitude, longitude} = req.body

    const haversineDistance = (lat1, lon1, lat2, lon2) => {
        const toRad = (value) => (value * Math.PI) / 180;
        const R = 6371; 
        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
                    Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    if (!latitude || !longitude) {
        return res.status(400).json({success: false, message: "Invalid location data"})
    }

    const centerLat = 6.936086128959122 
    const centerLng = 79.9325137093315
    const maxDistance = 20
    const baseCharge = 300
    let deliveryCharge;

    const distance = haversineDistance(latitude, longitude, centerLat, centerLng)

    if (distance <= maxDistance) {
        deliveryCharge = baseCharge
    } else if (distance <= maxDistance + 20) {
        deliveryCharge = 450
    } else if (distance <= maxDistance + 40) {
        deliveryCharge = 500
    } else if (distance <= maxDistance + 60) {
        deliveryCharge = 700
    } else {
        deliveryCharge = 1000
    }

    return res.json({success: true, charge: deliveryCharge})
}