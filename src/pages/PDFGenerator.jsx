import React from "react";
import { PDFLogic } from "./PDFLogic";

const PDFGenerator = ({ resumeHtml,firebase, navigate, path }) => {
  const handleGeneratePDF = () => {
    PDFLogic(resumeHtml, firebase,navigate, path);
  };

  return (
    <button
      onClick={handleGeneratePDF}
     className="px-2 flex mx-auto mb-5 bg-gray-600 text-white p-1 rounded-md"
    >
      Generate PDF
    </button>
  );
};

export default PDFGenerator;
