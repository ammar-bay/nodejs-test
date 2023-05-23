import React from "react";
import { useNavigate } from "react-router-dom";
import FileDownload from "../components/FileDownload";
import FileUploadComponent from "../components/FileUpload";
import useLogout from "../hooks/useLogout";

const Stock = () => {
  const logout = useLogout();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div>
      <FileUploadComponent />
      <FileDownload />
      <div className="wrapper">
        <button className="button-stock" onClick={handleLogout}>
          Log out
        </button>
      </div>
    </div>
  );
};

export default Stock;
