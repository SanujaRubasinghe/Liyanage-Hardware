const express = require("express")
const router = express.Router()
const { purchaseProducts, getAllProducts, getProduct, addNewProduct } = require("../controllers/productController")

router.post("/purchase", purchaseProducts)
router.get("/", getAllProducts)
router.get("/:id", getProduct)
router.post("/addproduct", addNewProduct)

module.exports = router