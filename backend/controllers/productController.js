const pool = require("../db")

exports.purchaseProducts = async (req, res) => {

    const {
        firstName, lastName, companyName, country, city,
        streetAddress, apartment, postcode, phone, email, orderNotes, paymentMethod
    } = req.body;

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
        console.log(err.message)
    }
}

exports.getAllProducts = async (req, res) => {
    try {
        const {rows} = await pool.query("select * from products")
        res.json(rows)
    } catch (err) {
        console.error(err.message)
        res.status(500).json({error: "Internal Server Error"})
    }
}

exports.getProduct = async (req, res) => {
    try {
        const productId = req.params.id
        const {rows} = await pool.query("select * from products where id=$1", [productId])

        if (rows.length === 0) {
            return res.status(404).json({error: "Product not found"})
        }
        res.json(rows[0])
    } catch (err) {
        console.error(err.message)
        res.status(500).json({error: "Internal Server Error"})
    }
}