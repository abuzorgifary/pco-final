"use client";
import React, { useState, FunctionComponent, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import {
  FaFastBackward,
  FaBackward,
  FaForward,
  FaFastForward,
  FaSearchMinus,
  FaSearchPlus,
  FaFileDownload,
  FaPrint,
} from "react-icons/fa";

const worker = require("pdfjs-dist/build/pdf.worker.mjs");

pdfjs.GlobalWorkerOptions.workerSrc = worker.toString();

interface LoaderProps {
  isLoading: boolean;
}

const Loader: FunctionComponent<LoaderProps> = ({ isLoading }) => {
  if (!isLoading) return null;
  return (
    <div
      id="loader"
      className="d-flex justify-content-center align-items-center flex-column"
    >
      <img
        src="https://react-pdf.org/images/logo.png"
        alt="loader"
        className="mb-5 App-logo"
      />
      <p>Loading...</p>
    </div>
  );
};

interface PDFPrinterProps {
  file: string;
}

const PDFPrinter: FunctionComponent<PDFPrinterProps> = ({ file }) => {
  const print = () => {
    const pdfFrame = document.createElement("iframe");
    pdfFrame.style.visibility = "hidden";
    pdfFrame.src = file;

    document.body.appendChild(pdfFrame);

    pdfFrame.contentWindow.focus();
    pdfFrame.contentWindow.print();
  };
  return (
    <FaPrint className="cursor-pointer" onClick={print} title="download" />
  );
};

interface ControlPanelProps {
  file: string;
  pageNumber: number;
  numPages: number | null;
  setPageNumber: (num: number) => void;
  scale: number;
  setScale: (scale: number) => void;
}

const ControlPanel: FunctionComponent<ControlPanelProps> = ({
  file,
  pageNumber,
  numPages,
  setPageNumber,
  scale,
  setScale,
}) => {
  const isFirstPage = pageNumber === 1;
  const isLastPage = pageNumber === numPages;

  const firstPageClass = isFirstPage ? "disabled" : "clickable";
  const lastPageClass = isLastPage ? "disabled" : "clickable";

  const goToFirstPage = () => {
    if (!isFirstPage) setPageNumber(1);
  };
  const goToPreviousPage = () => {
    if (!isFirstPage) setPageNumber(pageNumber - 1);
  };
  const goToNextPage = () => {
    if (!isLastPage) setPageNumber(pageNumber + 1);
  };
  const goToLastPage = () => {
    if (!isLastPage) setPageNumber(numPages);
  };

  const onPageChange = (e) => {
    const { value } = e.target;
    setPageNumber(Number(value));
  };

  const isMinZoom = scale < 0.6;
  const isMaxZoom = scale >= 2.0;

  const zoomOutClass = isMinZoom ? "disabled" : "clickable";
  const zoomInClass = isMaxZoom ? "disabled" : "clickable";

  const zoomOut = () => {
    if (!isMinZoom) setScale(scale - 0.1);
  };

  const zoomIn = () => {
    if (!isMaxZoom) setScale(scale + 0.1);
  };

  return (
    <div className="control-panel m-3 p-3 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <FaFastBackward
          className={`mx-3 ${
            isFirstPage ? "text-gray-400 cursor-not-allowed" : "cursor-pointer"
          }`}
          onClick={goToFirstPage}
        />
        <FaBackward
          className={`mx-3 ${
            isFirstPage ? "text-gray-400 cursor-not-allowed" : "cursor-pointer"
          }`}
          onClick={goToPreviousPage}
        />
        <span>
          Page{" "}
          <input
            name="pageNumber"
            type="number"
            min={1}
            max={numPages || 1}
            className="p-0 pl-1 mx-2"
            value={pageNumber}
            onChange={onPageChange}
          />{" "}
          of {numPages}
        </span>
        <FaForward
          className={`mx-3 ${
            isLastPage ? "text-gray-400 cursor-not-allowed" : "cursor-pointer"
          }`}
          onClick={goToNextPage}
        />
        <FaFastForward
          className={`mx-3 ${
            isLastPage ? "text-gray-400 cursor-not-allowed" : "cursor-pointer"
          }`}
          onClick={goToLastPage}
        />
      </div>
      <div className="flex items-center space-x-3">
        <FaSearchMinus
          className={`mx-3 ${
            isMinZoom ? "text-gray-400 cursor-not-allowed" : "cursor-pointer"
          }`}
          onClick={zoomOut}
        />
        <span>{(scale * 100).toFixed()}%</span>
        <FaSearchPlus
          className={`mx-3 ${
            isMaxZoom ? "text-gray-400 cursor-not-allowed" : "cursor-pointer"
          }`}
          onClick={zoomIn}
        />
      </div>
      <div className="flex items-center space-x-3">
        <a href="/assets/docs/file-sample.pdf" download={true} title="download">
          <FaFileDownload className="cursor-pointer" />
        </a>
        <PDFPrinter file={file} />
      </div>
    </div>
  );
};

interface PDFReaderProps {
  file: string;
}

const PDFReader: FunctionComponent<PDFReaderProps> = ({ file }) => {
  const [scale, setScale] = useState(1.0);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setIsLoading(false);
  }

  return (
    <div>
      <Loader isLoading={isLoading} />
      <section
        id="pdf-section"
        className="d-flex flex-column align-items-center w-100"
      >
        <ControlPanel
          file={file}
          pageNumber={pageNumber}
          numPages={numPages}
          setPageNumber={setPageNumber}
          scale={scale}
          setScale={setScale}
        />
        <div className="w-full h-[36rem] flex overflow-auto">
          <Document
            className="mx-auto"
            file={file}
            onLoadSuccess={onDocumentLoadSuccess}
          >
            <Page pageNumber={pageNumber} scale={scale} />
          </Document>
        </div>
      </section>
    </div>
  );
};

export default PDFReader;
