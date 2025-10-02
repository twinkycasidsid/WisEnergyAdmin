import React, { useEffect, useState } from "react";
import { exportToPDF, exportToDOCX } from "../../../services/exportUtils";
import {
  fetchAllDevices,
  fetchAllFeedbacks,
  fetchAllReviews,
  fetchAllUsers,
} from "../../../services/apiService";
import ReportTemplate from "../../../utils/ReportTemplate";

function Exports() {
  const [fileType, setFileType] = useState("pdf");
  const [users, setUsers] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [devices, setDevices] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const result = await fetchAllUsers();
      setUsers(result);
    };
    fetchUsers();

    const fetchDevices = async () => {
      const result = await fetchAllDevices();
      setDevices(result);
    };
    fetchDevices();

    const fetchFeedback = async () => {
      const result = await fetchAllFeedbacks();
      setFeedback(result);
    };
    fetchFeedback();

    const fetchReviews = async () => {
      const result = await fetchAllReviews();
      setReviews(result);
    };
    fetchReviews();


  }, []);

  const handleExport = () => {
    const data = { users, devices, reviews, feedback };
    console.log(data);

    if (fileType === "pdf") exportToPDF();
    else if (fileType === "docx") exportToDOCX(data);
  };

  return (
    <div className="container p-6">
      <h1 className="text-2xl font-bold mb-4">Export Reports</h1>
      <div className="mb-4">
        <label htmlFor="fileType" className="mr-2">
          Choose file type:
        </label>
        <select
          id="fileType"
          value={fileType}
          onChange={(e) => setFileType(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="pdf">PDF</option>
          <option value="docx">DOCX</option>
        </select>
      </div>

      {/* Report Template (hidden in UI but needed for export) */}
      <div className="hidden">
        <ReportTemplate data={{ users, devices, feedback, reviews }} />
      </div>

      <button
        onClick={handleExport}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Export
      </button>
    </div>
  );
}

export default Exports;
