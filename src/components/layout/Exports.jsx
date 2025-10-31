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

  useEffect(() => {
    document.title = "Exports | WisEnergy";
  }, []);
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
    <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-xl p-8 mt-10 border border-gray-100">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">
        Export Reports
      </h1>

      <div className="mb-8">
        <label
          htmlFor="fileType"
          className="block text-gray-700 font-medium mb-2"
        >
          Choose file type
        </label>
        <select
          id="fileType"
          value={fileType}
          onChange={(e) => setFileType(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
        >
          <option value="pdf">PDF</option>
          <option value="docx">DOCX</option>
        </select>
      </div>

      {/* Hidden report template */}
      <div className="hidden">
        <ReportTemplate data={{ users, devices, feedback, reviews }} />
      </div>

      <button
        onClick={handleExport}
        className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md shadow-sm transition-all duration-200"
      >
        Export
      </button>
    </div>

  );
}

export default Exports;
