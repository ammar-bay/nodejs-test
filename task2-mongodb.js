require("dotenv").config();
const fs = require("fs");
const csv = require("csv-parser");
const MongoClient = require("mongodb").MongoClient;
const XLSX = require("xlsx");

const url = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.9mbke.mongodb.net/`;
const dbName = "task2";

const sample1FilePath = "sample_file_1.csv";
const sample2FilePath = "sample_file_2.xlsx";

const importData = async () => {
  const data = [];
  fs.createReadStream(sample1FilePath)
    .pipe(csv())
    .on("data", (row) => {
      data.push(row);
    })
    .on("end", () => {
      saveToDatabase(data);
    });
};

const saveToDatabase = async (data) => {
  const client = new MongoClient(url);
  try {
    await client.connect();
    const db = client.db(dbName);
    await db.collection("stock").deleteMany({});
    const collection = db.collection("stock");
    console.log("Imporitng Data...");
    data.forEach((document, index) => {
      document._id = index;
    });
    await collection.insertMany(data);
    await generateSample2File(collection);
  } catch (error) {
    console.error("Error saving to database:", error);
  } finally {
    console.log("Closing connection...");
    client.close();
  }
};

const generateSample2File = async (collection) => {
  const cursor = collection.aggregate([
    {
      $group: {
        _id: "$variant",
        ids: { $push: { $toString: "$_id" } },
      },
    },
  ]);
  console.log('Generating "Sample 2" file...');

  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.aoa_to_sheet([["sku", "stock_ids"]]);

  console.log("Writing to file...");

  await cursor
    .forEach((document) => {
      const stockIds = document.ids.join("|");
      const row = [document._id, stockIds];
      XLSX.utils.sheet_add_aoa(worksheet, [row], { origin: -1 });
    })
    .then(() => {
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
      XLSX.writeFile(workbook, sample2FilePath);
      console.log('"Sample 2" file generated successfully.');
    });
};

importData();
