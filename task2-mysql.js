require("dotenv").config();
const fs = require("fs");
const csv = require("csv-parser");
const mysql = require("mysql2");
const XLSX = require("xlsx");

const url = {
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

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
  const connection = mysql.createConnection(url);
  try {
    await connection.connect();
    console.log("Connected to MySQL database");

    // Delete existing records
    await connection.query("DELETE FROM stock");

    // Insert new records
    const values = data.map((document, index) => {
      document._id = index;
      return Object.values(document);
    });
    await connection.query("INSERT INTO stock VALUES ?", [values]);

    await generateSample2File(connection);
  } catch (error) {
    console.error("Error saving to database:", error);
  } finally {
    console.log("Closing connection...");
    connection.end();
  }
};

const generateSample2File = async (connection) => {
  const query =
    "SELECT variant, GROUP_CONCAT(_id SEPARATOR '|') AS stock_ids FROM stock GROUP BY variant";
  const [rows] = await connection.query(query);

  console.log('Generating "Sample 2" file...');

  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.aoa_to_sheet([["sku", "stock_ids"]]);

  console.log("Writing to file...");

  rows.forEach((row) => {
    const stockIds = row.stock_ids;
    const rowData = [row.variant, stockIds];
    XLSX.utils.sheet_add_aoa(worksheet, [rowData], { origin: -1 });
  });

  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  XLSX.writeFile(workbook, sample2FilePath);
  console.log('"Sample 2" file generated successfully.');
};

importData();
