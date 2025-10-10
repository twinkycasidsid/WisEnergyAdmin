// ReportTemplate.jsx
import React, { useState } from "react";

export default function ReportTemplate({ data }) {
  const [headerHeight, setHeaderHeight] = useState(0);
  const [footerHeight, setFooterHeight] = useState(0);

  const stats = {
    reportDateTime: new Date().toISOString().split("T")[0],
    totalUsers: data.users?.length || 0,
    totalDevices: (data.devices || []).filter(
      (d) => (d.status || "").toLowerCase() === "paired"
    ).length,
    averageRating:
      data.reviews?.length > 0
        ? (
            data.reviews.reduce((acc, r) => acc + (r.rating || 0), 0) /
            data.reviews.length
          ).toFixed(2)
        : "N/A",
    totalFeedback: data.feedback?.length || 0,
  };

  return (
    <div
      id="report-template"
      style={{
        width: "210mm",
        minHeight: "297mm",
        fontFamily: "Arial",
        margin: 0,
        padding: "0 40px",
        boxSizing: "border-box",
      }}
    >
      {/* Content (safe margins based on header/footer height) */}
      <div
        style={{
          marginTop: "50mm", // leave space equal to header height in PDF
          marginBottom: "25mm",
          marginLeft: "8mm",
          marginRight: "8m", // leave space equal to footer height in PDF
        }}
      >
        <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
          WisEnergy Analytics Report
        </h1>

        <p
          style={{
            textAlign: "center",
            fontSize: "12px",
            marginBottom: "20px",
          }}
        >
          Generated on:{" "}
          {new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>

        <h2>Summary</h2>
        <p>Report Date: {stats.reportDateTime}</p>
        <p>Total Users: {stats.totalUsers}</p>
        <p>Total Devices: {stats.totalDevices}</p>
        <p>Average Rating: {stats.averageRating}</p>
        <p>Total Feedback: {stats.totalFeedback}</p>

        {/* Users */}
        <h2 style={{ marginTop: "20px" }}>Users</h2>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>First Name</th>
              <th style={thStyle}>Last Name</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Location</th>
              <th style={thStyle}>Role</th>
            </tr>
          </thead>
          <tbody>
            {data.users?.map((u, i) => (
              <tr key={i}>
                <td style={tdStyle}>{u.uid}</td>
                <td style={tdStyle}>{u.first_name}</td>
                <td style={tdStyle}>{u.last_name}</td>
                <td style={tdStyle}>{u.email}</td>
                <td style={tdStyle}>{u.location}</td>
                <td style={tdStyle}>{u.role}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Devices */}
        <h2 style={{ marginTop: "20px" }}>Devices</h2>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Device Name</th>
              <th style={thStyle}>Owner</th>
              <th style={thStyle}>Pairing Code</th>
              <th style={thStyle}>Paired At</th>
              <th style={thStyle}>Registered At</th>
              <th style={thStyle}>Status</th>
            </tr>
          </thead>
          <tbody>
            {data.devices?.map((d, i) => (
              <tr key={i}>
                <td style={tdStyle}>{d.id}</td>
                <td style={tdStyle}>{d.device_nickname}</td>
                <td style={tdStyle}>{d.owner}</td>
                <td style={tdStyle}>{d.pairing_code}</td>
                <td style={tdStyle}>{d.paired_at}</td>
                <td style={tdStyle}>{d.register_at}</td>
                <td style={tdStyle}>{d.status}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Reviews */}
        <h2 style={{ marginTop: "20px" }}>Reviews</h2>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Rating</th>
              <th style={thStyle}>Message</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Date Created</th>
            </tr>
          </thead>
          <tbody>
            {data.reviews?.map((r, i) => (
              <tr key={i}>
                <td style={tdStyle}>{r.id}</td>
                <td style={tdStyle}>{r.rating}</td>
                <td style={tdStyle}>{r.message}</td>
                <td style={tdStyle}>{r.email}</td>
                <td style={tdStyle}>{r.created_at}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Feedback */}
        <h2 style={{ marginTop: "20px" }}>Feedback</h2>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Type</th>
              <th style={thStyle}>Message</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Date Created</th>
              <th style={thStyle}>Status</th>
            </tr>
          </thead>
          <tbody>
            {data.feedback?.map((f, i) => (
              <tr key={i}>
                <td style={tdStyle}>{f.id}</td>
                <td style={tdStyle}>{f.type}</td>
                <td style={tdStyle}>{f.message}</td>
                <td style={tdStyle}>{f.email}</td>
                <td style={tdStyle}>{f.date_created}</td>
                <td style={tdStyle}>{f.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: "10px",
  fontSize: "12px",
};

const thStyle = {
  border: "1px solid #ccc",
  padding: "6px",
  backgroundColor: "rgb(229,231,235)",
};

const tdStyle = {
  border: "1px solid #ccc",
  padding: "6px",
};
