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

  // Load images first so we can reserve exact space for them
  const loadImage = (src) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });

  const [header, footer] = await Promise.all([
    loadImage(headerImg),
    loadImage(footerImg),
  ]);

  // Use a temporary jsPDF to compute page dimensions up-front
  const temp = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageWidth = temp.internal.pageSize.getWidth();
  const pageHeight = temp.internal.pageSize.getHeight();

  // Compute header/footer heights keeping image aspect ratios, spanning full width
  const headerHeight = pageWidth * (header.height / header.width);
  const footerHeight = pageWidth * (footer.height / footer.width);
  // Extra whitespace below the content above the footer (in mm)
  const BOTTOM_EXTRA_MM = 8; // adjust as needed

  // Lean CSS-only behavior; let margins reserve header/footer space.
  const cleanupNodes = [];

  // Pre-calculate where page content can flow (accounting for header/footer)
  try {
    const mmProbe = document.createElement("div");
    mmProbe.style.position = "absolute";
    mmProbe.style.visibility = "hidden";
    mmProbe.style.width = "1mm";
    document.body.appendChild(mmProbe);
    const pxPerMM = mmProbe.getBoundingClientRect().width || 3.78; // fallback
    mmProbe.remove();

    const pageHeightPx = pageHeight * pxPerMM;
    const topMarginPx = headerHeight * pxPerMM;
    const bottomMarginPx = (footerHeight + BOTTOM_EXTRA_MM) * pxPerMM;
    const rootTop = element.getBoundingClientRect().top;

    const remainingUsableBelow = (topPx) => {
      const posInPage = topPx % pageHeightPx;
      const contentStart = Math.max(posInPage, topMarginPx);
      const contentEnd = pageHeightPx - bottomMarginPx;
      return Math.max(0, contentEnd - contentStart);
    };

    // 1) Keep each section title (h2) with its table header + first data row
    const headings = Array.from(element.querySelectorAll("h2"));
    headings.forEach((h2) => {
      // Find the next table after this heading
      let sib = h2.nextElementSibling;
      while (sib && sib.tagName !== "TABLE") sib = sib.nextElementSibling;
      if (!sib || sib.tagName !== "TABLE") return;

      const thead = sib.tHead;
      const firstBody = sib.tBodies && sib.tBodies[0];
      const firstRow = firstBody && firstBody.rows && firstBody.rows[0];

      const titleH = h2.getBoundingClientRect().height || 0;
      const headerH = thead ? thead.getBoundingClientRect().height : 0;
      const firstRowH = firstRow ? firstRow.getBoundingClientRect().height : 18;
      const need = titleH + headerH + firstRowH;
      const topPx = h2.getBoundingClientRect().top - rootTop;
      const remain = remainingUsableBelow(topPx);
      if (remain < need + 2) {
        const br = document.createElement("div");
        br.className = "html2pdf__page-break";
        br.style.pageBreakBefore = "always";
        br.style.breakBefore = "page";
        h2.parentNode.insertBefore(br, h2);
        cleanupNodes.push(br);
      }
    });

    // 2) Ensure a table header is kept with the first row for tables without titles
    const tables = Array.from(element.querySelectorAll("table"));
    tables.forEach((tbl) => {
      const thead = tbl.tHead;
      const firstBody = tbl.tBodies && tbl.tBodies[0];
      const firstRow = firstBody && firstBody.rows && firstBody.rows[0];
      if (thead) {
        const headerH = thead.getBoundingClientRect().height || 0;
        const firstRowH = firstRow ? firstRow.getBoundingClientRect().height : 18;
        const req = headerH + firstRowH;
        const topPx = thead.getBoundingClientRect().top - rootTop;
        const remain = remainingUsableBelow(topPx);
        if (remain < req + 2) {
          const br = document.createElement("div");
          br.className = "html2pdf__page-break";
          br.style.pageBreakBefore = "always";
          br.style.breakBefore = "page";
          tbl.parentNode.insertBefore(br, tbl);
          cleanupNodes.push(br);
        }
      }

      // 3) Prevent a page break within any row; if a row doesn't fit, move it
      const bodies = Array.from(tbl.tBodies || []);
      bodies.forEach((tbody) => {
        Array.from(tbody.rows || []).forEach((row) => {
          const rRect = row.getBoundingClientRect();
          const rTop = rRect.top - rootTop;
          const rH = rRect.height || 18;
          const remain = remainingUsableBelow(rTop);
          if (remain < rH + 2) {
            const br = document.createElement("tr");
            br.className = "html2pdf__page-break";
            br.style.pageBreakBefore = "always";
            br.style.breakBefore = "page";
            const td = document.createElement("td");
            td.colSpan = row.cells.length || 1;
            td.style.border = "none";
            td.style.padding = "0";
            td.style.height = "0";
            br.appendChild(td);
            row.parentNode.insertBefore(br, row);
            cleanupNodes.push(br);
          }
        });
      });
    });
  } catch (e) {
    // If measurement fails, continue without pre-injected breaks
  }

  try {
    // Build the PDF with margins reserving header/footer space
    // and minimal CSS allowing row splitting if necessary
    const tmpStyle = document.createElement("style");
    tmpStyle.setAttribute("data-export-style", "true");
    tmpStyle.textContent = `
      #report-template thead { display: table-header-group; }
      #report-template tfoot { display: table-footer-group; }
      #report-template tr, #report-template td, #report-template th { page-break-inside: avoid; break-inside: avoid; }
    `;
    document.head.appendChild(tmpStyle);
    const worker = html2pdf()
      .set({
        // Reserve space for header + footer per page
        margin: [headerHeight, 8, footerHeight + BOTTOM_EXTRA_MM, 8],
        filename: `wisenergy_report_${timestamp}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          // Let html2canvas determine width naturally to avoid layout shifts
        },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        // Use CSS-only pagebreak logic to avoid phantom last pages
        pagebreak: {
          mode: ["css"],
        },
      })
      .from(element);

    // Render to canvas first so we can estimate expected page count
    const canvas = await worker.toCanvas().get("canvas");
    const pdf = await worker.toPdf().get("pdf");

    // Remove extra trailing pages beyond what the canvas height requires
    const total = pdf.internal.getNumberOfPages();
    // Estimate how many A4 pages are needed for the canvas image
    const ratio = pageWidth / canvas.width;
    // Account for reserved margins reducing usable height per page
    const usablePerPage = pageHeight - headerHeight - (footerHeight + BOTTOM_EXTRA_MM);
    const imgHeight = canvas.height * ratio; // in mm because we scaled to pageWidth
    const expectedPages = Math.max(1, Math.ceil(imgHeight / usablePerPage));
    if (total > expectedPages) {
      for (let i = total; i > expectedPages; i--) {
        pdf.deletePage(i);
      }
    }
    // Also prune any trailing blank page introduced by rounding
    const pruneTrailingBlank = () => {
      let n = pdf.internal.getNumberOfPages();
      while (n > 1) {
        const ops = pdf.internal.pages?.[n];
        const isBlank = !ops || (Array.isArray(ops) ? ops.length <= 2 : false);
        if (isBlank) {
          pdf.deletePage(n);
          n--;
        } else {
          break;
        }
      }
    };
    pruneTrailingBlank();

    const finalPageCount = pdf.internal.getNumberOfPages();
    for (let i = 1; i <= finalPageCount; i++) {
      pdf.setPage(i);
      // Draw header/footer at their original positions
      pdf.addImage(headerImg, "PNG", 0, 0, pageWidth, headerHeight);
      pdf.addImage(footerImg, "PNG", 0, pageHeight - footerHeight, pageWidth, footerHeight);
    }

    pdf.save(`wisenergy_report_${timestamp}.pdf`);
  } finally {
    // Clean up any injected page-break nodes
    cleanupNodes.forEach((n) => n.remove());
    const s = document.querySelector('style[data-export-style="true"]');
    if (s) s.remove();
  }
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
