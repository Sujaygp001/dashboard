// src/ReportSummaryPage.js
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import * as XLSX from 'xlsx';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import './ReportSummaryPage.css';

const ReportSummaryPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { selectedEHR, filters } = location.state || {
    selectedEHR: null,
    filters: {
      graphType: null,
      ehr: null,
      agency: [],
      botType: null,
      dateRange: null,
      customRange: { start: '', end: '' },
    },
  };

  const [exportDropdownVisible, setExportDropdownVisible] = useState({
    failed: false,
    successful: false,
  });

  const failedButtonRef = useRef(null);
  const successfulButtonRef = useRef(null);
  const failedDropdownRef = useRef(null);
  const successfulDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        failedDropdownRef.current &&
        !failedDropdownRef.current.contains(event.target) &&
        failedButtonRef.current &&
        !failedButtonRef.current.contains(event.target)
      ) {
        setExportDropdownVisible((prev) => ({ ...prev, failed: false }));
      }

      if (
        successfulDropdownRef.current &&
        !successfulDropdownRef.current.contains(event.target) &&
        successfulButtonRef.current &&
        !successfulButtonRef.current.contains(event.target)
      ) {
        setExportDropdownVisible((prev) => ({ ...prev, successful: false }));
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleExportClick = (type) => {
    setExportDropdownVisible((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const handleExport = (type, format) => {
    const dataToExport = type === 'failed' ? failedDocumentUploads : successfulDocumentUploads;
    if (format === 'csv' || format === 'txt') {
      const csvContent = convertToCSV(dataToExport);
      downloadFile(csvContent, `${type}_document_uploads.${format}`, format);
    } else if (format === 'xlsx') {
      exportToExcel(dataToExport, `${type}_document_uploads.xlsx`);
    } else if (format === 'json') {
      const jsonContent = JSON.stringify(dataToExport, null, 2);
      downloadFile(jsonContent, `${type}_document_uploads.json`, 'json');
    }
    setExportDropdownVisible((prev) => ({
      ...prev,
      [type]: false,
    }));
  };

  const convertToCSV = (data) => {
    const header = Object.keys(data[0]).join(',');
    const rows = data.map((row) => Object.values(row).join(','));
    return [header, ...rows].join('\n');
  };

  const downloadFile = (content, filename, format) => {
    const blob = new Blob([content], { type: format === 'json' ? 'application/json' : 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  const exportToExcel = (data, filename) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, filename);
  };

  // Dummy data for failed document uploads
  const failedDocumentUploads = [
    {
      ehr: 'HCHB',
      account: 'HCHB-Bayada-PLF',
      date: '2024-11-22',
      orderNumber: '12345',
      documentId: '98765',
      remarks: 'Patient record not found',
      wavStatus: 'Failed',
      pdfLink: 'Order12345.pdf',
    },
    {
      ehr: 'HCHB',
      account: 'HCHB-Bayada-Canton',
      date: '2024-11-23',
      orderNumber: '67890',
      documentId: '54321',
      remarks: 'Invalid document format',
      wavStatus: 'Failed',
      pdfLink: 'Order67890.pdf',
    },
  ];

  // Dummy data for successful document uploads
  const successfulDocumentUploads = [
    {
      ehr: 'HCHB',
      account: 'HCHB-Bayada-Canton',
      date: '2024-11-22',
      orderNumber: '11223',
      documentId: '66789',
      remarks: 'Upload successful',
      wavStatus: 'Successful',
    },
    {
      ehr: 'HCHB',
      account: 'HCHB-Bayada-PLF',
      date: '2024-11-23',
      orderNumber: '44556',
      documentId: '77890',
      remarks: 'Uploaded on first attempt',
      wavStatus: 'Successful',
    },
  ];

  // Function to handle bulk download of PDFs for the selected EHR
  const handleBulkDownloadPDFs = () => {
    const zip = new JSZip();
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD format
    const folderName = `${selectedEHR}-${today}`;

    const filteredFailedUploads = failedDocumentUploads.filter(
      (doc) => doc.ehr === selectedEHR
    );

    const filteredSuccessfulUploads = successfulDocumentUploads.filter(
      (doc) => doc.ehr === selectedEHR
    );

    filteredFailedUploads.forEach((document) => {
      zip.folder(folderName).file(
        `${document.pdfLink}`,
        'PDF content for demonstration'
      );
    });

    filteredSuccessfulUploads.forEach((document) => {
      zip.folder(folderName).file(
        `${document.pdfLink}`,
        'PDF content for demonstration'
      );
    });

    if (filteredFailedUploads.length === 0 && filteredSuccessfulUploads.length === 0) {
      alert('No documents available for the selected EHR.');
      return;
    }

    zip.generateAsync({ type: 'blob' }).then((content) => {
      saveAs(content, `${folderName}.zip`);
    });
  };

  return (
    <div className="report-summary-page">
      <h1 className="title">Report Summary Page</h1>

      {/* Back Button */}
      <div className="back-button-container">
        <button
          onClick={() => navigate('/', { state: { filters, selectedEHR } })}
          className="back-button"
        >
          Back to Dashboard
        </button>
      </div>

      {/* Failed Document Upload Table */}
      <h2 className="section-title">Failed Document Uploads</h2>
      <div className="table-container">
        <table className="document-table">
          <thead>
            <tr className="table-header">
              <th>EHR</th>
              <th>Account</th>
              <th>Date</th>
              <th>Order Number</th>
              <th>Document ID</th>
              <th>Remarks</th>
              <th>WAV Document Upload Status</th>
              <th>Document/Order PDF Link</th>
            </tr>
          </thead>
          <tbody>
            {failedDocumentUploads.map((row, index) => (
              <tr key={index}>
                <td>{row.ehr}</td>
                <td>{row.account}</td>
                <td>{row.date}</td>
                <td>{row.orderNumber}</td>
                <td>{row.documentId}</td>
                <td>{row.remarks}</td>
                <td>{row.wavStatus}</td>
                <td>
                  <a href={`#${row.pdfLink}`} className="pdf-link">
                    {row.pdfLink}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="buttons-container">
        {/* Export Failed Document Table Button */}
        <div className="export-button-container">
          <button
            ref={failedButtonRef}
            onClick={() => handleExportClick('failed')}
            className="export-button"
          >
            Export Failed Table
          </button>
          {exportDropdownVisible.failed && (
            <div ref={failedDropdownRef} className="dropdown-menu">
              {['csv', 'txt', 'xlsx', 'json'].map((format) => (
                <button
                  key={format}
                  onClick={() => handleExport('failed', format)}
                  className="dropdown-item"
                >
                  {format.toUpperCase()}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Bulk Download PDF Button */}
        <button onClick={handleBulkDownloadPDFs} className="bulk-download-button">
          Bulk Download
        </button>
      </div>

      {/* Successful Document Upload Table */}
      <h2 className="section-title">Successful Document Uploads</h2>
      <div className="table-container">
        <table className="document-table">
          <thead>
            <tr className="table-header">
              <th>EHR</th>
              <th>Account</th>
              <th>Date</th>
              <th>Order Number</th>
              <th>Document ID</th>
              <th>Remarks</th>
              <th>WAV Document Upload Status</th>
            </tr>
          </thead>
          <tbody>
            {successfulDocumentUploads.map((row, index) => (
              <tr key={index}>
                <td>{row.ehr}</td>
                <td>{row.account}</td>
                <td>{row.date}</td>
                <td>{row.orderNumber}</td>
                <td>{row.documentId}</td>
                <td>{row.remarks}</td>
                <td>{row.wavStatus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Export Successful Document Table Button */}
      <div className="export-button-container">
        <button
          ref={successfulButtonRef}
          onClick={() => handleExportClick('successful')}
          className="export-button"
        >
          Export Successful Table
        </button>
        {exportDropdownVisible.successful && (
          <div ref={successfulDropdownRef} className="dropdown-menu">
            {['csv', 'txt', 'xlsx', 'json'].map((format) => (
              <button
                key={format}
                onClick={() => handleExport('successful', format)}
                className="dropdown-item"
              >
                {format.toUpperCase()}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportSummaryPage;
