import React, { useState } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

const XLSXDownloader = () => {
  const [data, setData] = useState([]);
  const axiosPrivate = useAxiosPrivate();
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fetchData = async () => {
    try {
      const response = await axiosPrivate.get("/stock");
      response.data.forEach((item) => {
        item.stock_ids = item.stock_ids.join(" | ");
      });
      setData(response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDownload = (apiData) => {
    const ws = XLSX.utils.json_to_sheet(apiData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, "sample_2.xlsx");
  };

  return (
    <div className="wrapper">
      <button className="button-stock mb-20" onClick={fetchData}>
        Fetch Data
      </button>
      <button
        className="button-stock mb-20"
        onClick={() => handleDownload(data)}
      >
        Download XLSX
      </button>
      {data.length > 0 && (
        <table>
          <thead>
            <tr>
              <th className="mr-20">SKU</th>
              <th>Stock IDs</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td >{item._id}</td>
                <td>{item.stock_ids}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default XLSXDownloader;
