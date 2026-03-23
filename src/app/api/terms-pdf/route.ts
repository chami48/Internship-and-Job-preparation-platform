import fs from "fs";
import path from "path";
import { Buffer } from "buffer";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import type { PDFFont, PDFPage } from "pdf-lib";

export const runtime = "nodejs";

const sections = [
  {
    title: "Agreement to Terms",
    body:
      "By accessing HireSmart, you agree to these Terms & Conditions and our Privacy Policy.",
  },
  {
    title: "Account Responsibilities",
    body:
      "You are responsible for maintaining accurate profile information and safeguarding your login credentials.",
  },
  {
    title: "Assessments & Integrity",
    body:
      "Assessments may include identity verification and proctoring. Any violations may result in disqualification.",
  },
  {
    title: "User Content",
    body:
      "You retain ownership of your content but grant HireSmart permission to display it for recruitment and assessment purposes.",
  },
  {
    title: "Acceptable Use",
    body:
      "Do not misuse the platform, attempt to bypass security, or infringe on the rights of others.",
  },
  {
    title: "Service Availability",
    body:
      "We strive for continuous availability, but downtime may occur for maintenance or updates.",
  },
  {
    title: "Termination",
    body:
      "We may suspend or terminate accounts that violate these terms or compromise platform integrity.",
  },
  {
    title: "Changes to Terms",
    body:
      "We may update these terms from time to time. Continued use indicates acceptance of updates.",
  },
];

export async function GET() {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const pageWidth = 595.28;
  const pageHeight = 841.89;
  const margin = 50;
  const footerHeight = 36;

  let page = pdfDoc.addPage([pageWidth, pageHeight]);
  let y = pageHeight - margin;

  const colorInk = rgb(0.06, 0.09, 0.16);
  const colorBody = rgb(0.2, 0.25, 0.34);
  const colorLine = rgb(0.89, 0.91, 0.94);
  const colorHeaderFill = rgb(0.93, 0.96, 0.99);
  const colorAccent = rgb(0.12, 0.37, 0.7);

  const printDate = new Date().toLocaleString("en-GB", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  const logoPath = path.join(process.cwd(), "public", "uploads", "logo (3).png");
  let logoWidth = 0;
  let logoHeight = 0;

  const headerHeight = 78;
  const headerY = y - headerHeight;

  page.drawRectangle({
    x: margin,
    y: headerY,
    width: pageWidth - margin * 2,
    height: headerHeight,
    color: colorHeaderFill,
  });

  page.drawRectangle({
    x: margin + 10,
    y: headerY + 10,
    width: 6,
    height: headerHeight - 20,
    color: colorAccent,
  });

  const logoBoxSize = 36;
  const logoBoxX = margin + 24;
  const logoBoxY = headerY + headerHeight - logoBoxSize - 16;

  if (fs.existsSync(logoPath)) {
    const logoBytes = fs.readFileSync(logoPath);
    const logoImage = await pdfDoc.embedPng(logoBytes);
    logoWidth = 30;
    logoHeight = 30;
    page.drawRectangle({
      x: logoBoxX - 4,
      y: logoBoxY - 4,
      width: logoBoxSize + 8,
      height: logoBoxSize + 8,
      color: rgb(1, 1, 1),
    });
    page.drawImage(logoImage, {
      x: logoBoxX,
      y: logoBoxY,
      width: logoWidth,
      height: logoHeight,
    });
  }

  const titleX = logoWidth ? logoBoxX + logoWidth + 16 : margin + 24;
  page.drawText("HireSmart", {
    x: titleX,
    y: headerY + headerHeight - 26,
    size: 18,
    font: fontBold,
    color: colorInk,
  });

  page.drawText("Smart Screening Platform", {
    x: titleX,
    y: headerY + headerHeight - 42,
    size: 9,
    font,
    color: colorBody,
  });

  page.drawText("Terms & Conditions", {
    x: titleX,
    y: headerY + 14,
    size: 12,
    font: fontBold,
    color: colorAccent,
  });

  const rightBlock = `Email: hiresmart31@gmail.com\nFax: +94 112 345 678\nPrinted on ${printDate}`;
  const rightBlockWidth = 180;
  page.drawText(rightBlock, {
    x: pageWidth - margin - rightBlockWidth - 8,
    y: headerY + headerHeight - 26,
    size: 9,
    font,
    color: colorBody,
    lineHeight: 12,
  });

  y = headerY - 22;
  page.drawLine({
    start: { x: margin, y },
    end: { x: pageWidth - margin, y },
    thickness: 1,
    color: colorLine,
  });

  y -= 22;
  y = drawParagraph(
    page,
    font,
    11,
    colorBody,
    "These terms outline the rules and responsibilities for using HireSmart. Please read them carefully.",
    margin,
    y,
    pageWidth - margin * 2,
    16
  );

  y -= 10;

  sections.forEach((section, index) => {
    if (y < margin + footerHeight + 90) {
      page = pdfDoc.addPage([pageWidth, pageHeight]);
      y = pageHeight - margin;
    }

    page.drawText(`${index + 1}. ${section.title}`, {
      x: margin,
      y,
      size: 12,
      font,
      color: colorBody,
    });

    y -= 18;
    y = drawParagraph(
      page,
      font,
      11,
      colorBody,
      section.body,
      margin,
      y,
      pageWidth - margin * 2,
      16
    );

    y -= 14;
  });

  const totalPages = pdfDoc.getPageCount();
  pdfDoc.getPages().forEach((pdfPage, index) => {
    drawFooter(
      pdfPage,
      index + 1,
      totalPages,
      pageWidth,
      margin,
      footerHeight,
      font,
      colorLine,
      colorBody
    );
  });

  const pdfBytes = await pdfDoc.save();

  return new Response(Buffer.from(pdfBytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=HireSmart-Terms-and-Conditions.pdf",
    },
  });
}

function drawParagraph(
  page: PDFPage,
  font: PDFFont,
  fontSize: number,
  color: ReturnType<typeof rgb>,
  text: string,
  x: number,
  y: number,
  width: number,
  lineHeight: number
) {
  const words = text.split(" ");
  let line = "";
  let currentY = y;

  for (const word of words) {
    const testLine = line ? `${line} ${word}` : word;
    const lineWidth = font.widthOfTextAtSize(testLine, fontSize);
    if (lineWidth > width) {
      page.drawText(line, { x, y: currentY, size: fontSize, font, color });
      currentY -= lineHeight;
      line = word;
    } else {
      line = testLine;
    }
  }

  if (line) {
    page.drawText(line, { x, y: currentY, size: fontSize, font, color });
    currentY -= lineHeight;
  }

  return currentY;
}

function drawFooter(
  page: PDFPage,
  pageNumber: number,
  totalPages: number,
  pageWidth: number,
  margin: number,
  footerHeight: number,
  font: PDFFont,
  colorLine: ReturnType<typeof rgb>,
  colorBody: ReturnType<typeof rgb>
) {
  const footerY = margin - 6;

  page.drawLine({
    start: { x: margin, y: footerY + footerHeight - 8 },
    end: { x: pageWidth - margin, y: footerY + footerHeight - 8 },
    thickness: 1,
    color: colorLine,
  });

  page.drawText("HireSmart | Terms & Conditions", {
    x: margin,
    y: footerY + 4,
    size: 9,
    font,
    color: colorBody,
  });

  const pageLabel = `Page ${pageNumber} of ${totalPages}`;
  const pageLabelWidth = font.widthOfTextAtSize(pageLabel, 9);
  page.drawText(pageLabel, {
    x: pageWidth - margin - pageLabelWidth,
    y: footerY + 4,
    size: 9,
    font,
    color: colorBody,
  });
}
