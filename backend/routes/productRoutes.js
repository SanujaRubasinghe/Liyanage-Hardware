const express = require("express")
const router = express.Router()
const { purchaseProducts, getAllProducts, getProduct } = require("../controllers/productController")

router.post("/purchase", purchaseProducts)
router.get("/", getAllProducts)
router.get("/:id", getProduct)

module.exports = router