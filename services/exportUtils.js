// exportUtils.js
import { jsPDF } from "jspdf"; // For PDF export
import autoTable from "jspdf-autotable";
import PizZip from "pizzip"; // For DOCX export
import Docxtemplater from "docxtemplater"; // For DOCX export
import html2pdf from "html2pdf.js";
import headerImg from "/header.png";
import footerImg from "/footer.png";

// Helper function to compute summary statistics
const getSummaryStats = (data) => {
  return {
    reportDateTime: new Date().toISOString().split("T")[0],
    totalUsers: data.users?.length || 0,
    totalDevices: (data.devices || []).filter(
      (device) => (device.status || "").toLowerCase() === "paired"
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
};

// PDF Export using html2pdf and jsPDF
export const exportToPDF = async () => {
  const element = document.getElementById("report-template");
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

  const worker = html2pdf()
    .set({
      margin: 0,
      filename: `wisenergy_report_${timestamp}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      pagebreak: { mode: ["avoid-all", "css", "legacy"] },
    })
    .from(element);

  const pdf = await worker.toPdf().get("pdf");
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  // Load both images first to get natural sizes
  const loadImage = (src) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });

  const header = await loadImage(headerImg);
  const footer = await loadImage(footerImg);

  const headerRatio = header.height / header.width;
  const footerRatio = footer.height / footer.width;

  const headerHeight = pageWidth * headerRatio;
  const footerHeight = pageWidth * footerRatio;

  const pageCount = pdf.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i);

    // Header at top
    pdf.addImage(headerImg, "PNG", 0, 0, pageWidth, headerHeight);

    // Footer at bottom
    pdf.addImage(
      footerImg,
      "PNG",
      0,
      pageHeight - footerHeight,
      pageWidth,
      footerHeight
    );
  }

  pdf.save(`wisenergy_report_${timestamp}.pdf`);
};

// DOCX Export using docxtemplater
export const exportToDOCX = async (data) => {
  try {
    // Initialize default arrays if data is missing or invalid
    if (
      !data ||
      !Array.isArray(data.users) ||
      !Array.isArray(data.devices) ||
      !Array.isArray(data.reviews) ||
      !Array.isArray(data.feedback)
    ) {
      console.warn("Invalid data detected, initializing default arrays");
      data = {
        users: data?.users ?? [],
        devices: data?.devices ?? [],
        reviews: data?.reviews ?? [],
        feedback: data?.feedback ?? [],
      };
    }

    // Log data for debugging
    console.log("Data passed to template:", JSON.stringify(data, null, 2));

    // Fetch the DOCX template
    const response = await fetch("/assets/template.docx", { method: "GET" });
    console.log("Fetch status:", response.status);
    console.log("Fetch Content-Type:", response.headers.get("Content-Type"));

    // Log response text for debugging
    const responseText = await response.clone().text();
    console.log(
      "Fetch response text:",
      responseText.substring(0, 200) + (responseText.length > 200 ? "..." : "")
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch DOCX template: ${response.status} ${response.statusText}`
      );
    }

    // Check if response is likely a ZIP file (DOCX) even if Content-Type is missing
    const isZipFile = responseText.startsWith("PK");
    if (
      !isZipFile &&
      !response.headers
        .get("Content-Type")
        ?.includes(
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        )
    ) {
      throw new Error(
        `Fetched file is not a valid DOCX file (Content-Type: ${
          response.headers.get("Content-Type") || "none"
        })`
      );
    }

    // Get arrayBuffer
    const arrayBuffer = await response.arrayBuffer();
    // console.log("ArrayBuffer size:", arrayBuffer.byteLength);
    if (arrayBuffer.byteLength === 0) {
      throw new Error("Fetched DOCX template is empty");
    }

    // Log first few bytes of arrayBuffer to verify ZIP header
    const uint8Array = new Uint8Array(arrayBuffer.slice(0, 4));
    // console.log(
    //   "ArrayBuffer first bytes:",
    //   Array.from(uint8Array)
    //     .map((b) => b.toString(16).padStart(2, "0"))
    //     .join("")
    // );

    // Load the template into PizZip
    let zip;
    try {
      zip = new PizZip(arrayBuffer);
    } catch (zipError) {
      console.error("PizZip error details:", zipError);
      throw new Error("Invalid DOCX template: Not a valid ZIP file");
    }

    // Prepare data for the template
    const templateData = {
      reportDateTime: getSummaryStats(data).reportDateTime,
      totalUsers: getSummaryStats(data).totalUsers,
      totalDevices: getSummaryStats(data).totalDevices,
      averageRating: getSummaryStats(data).averageRating,
      totalFeedback: getSummaryStats(data).totalFeedback,
      users: data.users,
      devices: data.devices,
      reviews: data.reviews,
      feedback: data.feedback,
    };

    // Log template data
    console.log("Template data:", JSON.stringify(templateData, null, 2));

    // Initialize Docxtemplater with zip and options
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });

    // Render the document with data
    try {
      doc.render(templateData);
    } catch (renderError) {
      console.error("Template render error:", renderError);
      throw new Error("Failed to render template: " + renderError.message);
    }

    // Generate the DOCX file
    const buffer = doc.getZip().generate({ type: "arraybuffer" });
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });

    // Create download link with unique filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `wisenergy_analytics_report_${timestamp}.docx`;
    link.click();
  } catch (error) {
    console.error("Error generating DOCX:", error);
    throw new Error(`Failed to generate DOCX report: ${error.message}`);
  }
};
