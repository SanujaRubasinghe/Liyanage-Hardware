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
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        `

        const values = [
            1, firstName, lastName, companyName, country, city,
            streetAddress, apartment, postcode, phone, email, orderNotes, paymentMethod
        ];

        const result = await pool.execute(query, values)
        res.status(201).json({message: "Order placed successfully"})
        
    } catch (err) {
        res.status(500).json({err: "Internal server error"})
        console.log(err.message)
    }
}

exports.getAllProducts = async (req, res) => {
    try {
        const [rows] = await pool.execute("select * from product_data")
        res.json(rows)
    } catch (err) {
        console.error(err)
        res.status(500).json({error: "Internal Server Error"})
    }
}

exports.getProduct = async (req, res) => {
    try {
        const productId = req.params.id
        const [rows] = await pool.execute("select * from product_data where prtdid=?", [productId])

        if (rows.length === 0) {
            return res.status(404).json({error: "Product not found"})
        }
        res.json(rows)
    } catch (err) {
        console.error(err.message)
        res.status(500).json({error: "Internal Server Error"})
    }
}

exports.addNewProduct = async (req, res) => {
    const {
        productName, productId, sku, code, unit, brand, category, subcategory,
        deliveryStatus, deliveryAllowed, stock, alertQuantity, weight, desc, price
    } = req.body

    try {
        const addProductQuery = `
            insert into product(prdtid, catid, scatid, delid, delalwd, wght1, delchg)
            values(?,?,?,?,?,?,?)
        `
        const addProductdata = `
            insert into product_data(name, sku, price, images, sizes, colors, unit, prtdid)
            values(?,?,?,?,?,?,?,?)
        `
        const productValues = [productId, category, subcategory, deliveryStatus, deliveryAllowed, weight, 0]
        const productDataValues = [
            productName, sku, price, '["/images/p1.jpg", "/images/p1.jpg"]', '["size1", "size2"]',
            '["color1", "color2"]', unit, productId
        ]
        await pool.query(addProductQuery, productValues)
        await pool.query(addProductdata, productDataValues)
        res.status(201).json({message: "Product added successfully"})
    } catch (err) {
        res.status(500).json({err: "Internal server error"})
        console.log(err.message)
    }
}