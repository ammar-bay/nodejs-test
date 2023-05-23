const express = require("express");
const router = express.Router();
const stockController = require("../controllers/stockController");

router.get("/", stockController.getStocks);
router.post("/", stockController.postStock);

module.exports = router;
