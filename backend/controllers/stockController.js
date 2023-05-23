const Stock = require("../model/Stock");

const postStock = async (req, res) => {
  try {
    req.body?.forEach((document, index) => {
      document._id = index;
    });
    const result = await Stock.insertMany(req.body);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

const getStocks = async (req, res) => {
  try {
    const result = await Stock.aggregate([
      {
        $group: {
          _id: "$variant",
          stock_ids: { $push: "$_id" },
        },
      },
    ]);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

module.exports = {
  postStock,
  getStocks,
};
