const { default: axios } = require("axios")
const pool = require("../db")
require('dotenv').config()

exports.getDeliveryCharges = async (req, res) => {
   const {userAddress} = req.body

   try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/distancematrix/json', {
        params: {
            origins: process.env.STORE_ADDRESS,
            destinations: userAddress,
            key: process.env.GOOGLE_MAPS_API_KEY
        }
    })

    const element = response.data.rows[0].elements[0]

    if (element.status !== "OK") {
        return res.status(400).json({message: 'Invalid address or error calculating distance.'})
    }

    const distanceInmeters = element.distance.value
    const distanceInKm = distanceInmeters / 1000

    console.log(distanceInKm)

    const baseCost = 100
    const costPerKm = 20
    const shippingCost = baseCost + (distanceInKm * costPerKm)

    res.json({shippingCost: shippingCost.toFixed(2), distanceInKm: distanceInKm.toFixed(2)})
   } catch (error) {
    console.error('Error calculating shipping: ', error)
    res.status(500).json({message: 'Server error calculating shipping cost.'})
   }
}