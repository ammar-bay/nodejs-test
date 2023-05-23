import React, { useState } from "react";
import Papa from "papaparse";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const CSVUploader = () => {
  const [data, setData] = useState([]);
  const axiosPrivate = useAxiosPrivate();

  const handleFileChange = (event) => {
    Papa.parse(event.target.files[0], {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        setData(results.data);
      },
    });
  };

  const handleUpload = async () => {
    if (data.length === 0) {
      console.log("No data to upload");
      return;
    }
    try {
      console.log(data);
      const res = await axiosPrivate.post("/stock", data);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="wrapper">
      <input
        className="input-stock"
        type="file"
        accept=".csv"
        onChange={handleFileChange}
      />
      <button className="button-stock" onClick={handleUpload}>
        Upload to DB
      </button>
    </div>
  );
};

export default CSVUploader;
