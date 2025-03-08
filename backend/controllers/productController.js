const pool = require("../db")

exports.purchaseProducts = async (req, res) => {
    const {
        firstName, lastName, companyName, country, city,
        streetAddress, apartment, postcode, phone, email, orderNotes, paymentMethod
    } = req.body;

    console.log(req.body)

    try {
        const query = `
            INSERT INTO orders (
                user_id, first_name, last_name, company_name, country, city, 
                street_address, apartment, postcode, phone, email, order_notes, payment_method
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13);
        `

        const values = [
            1, firstName, lastName, companyName, country, city,
            streetAddress, apartment, postcode, phone, email, orderNotes, paymentMethod
        ];

        const result = await pool.query(query, values)
        res.status(201).json({message: "Order placed successfully"})
        
    } catch (err) {
        res.status(500).json({err: "Internal server error"})
        console.log(err)
    }
}