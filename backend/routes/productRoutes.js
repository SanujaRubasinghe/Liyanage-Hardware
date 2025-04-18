const express = require("express")
const router = express.Router()
const { purchaseProducts, getAllProducts, getProduct, addNewProduct, filterProducts } = require("../controllers/productController")

router.post("/purchase", purchaseProducts)
router.get("/", getAllProducts)
router.get("/:id", getProduct)
router.post("/addproduct", addNewProduct)
router.post("/filter", filterProducts)

module.exports = router