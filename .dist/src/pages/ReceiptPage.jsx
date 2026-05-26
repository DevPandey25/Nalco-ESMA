import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { motion } from 'framer-motion';
import { apiClient } from '../api/client';
import { useAppStore } from '../store/useAppStore';

// Receipt sub-components
import ReceiptHeader from '../components/receipt/ReceiptHeader';
import ApprovalTable from '../components/receipt/ApprovalTable';
import SignatureSection from '../components/receipt/SignatureSection';
import ReceiptFooter from '../components/receipt/ReceiptFooter';

export default function ReceiptPage({ isAdmin = false }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const showToast = useAppStore(state => state.showToast);
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const componentRef = useRef(null);

  useEffect(() => {
    const loadRequest = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await apiClient.get(`/requests/${id}`);
        // Map backend keys to standard app names
        const mapped = {
          ...data,
          id: data.requestId || data.id || data._id,
          media: data.mediaType || data.media,
          employee: typeof data.employee === 'string' 
            ? { name: data.employee, title: data.designation || 'Staff', personalNo: data.employeeId || '' } 
            : {
                name: data.employee?.name || data.employee || '',
                title: data.employee?.title || data.designation || 'Staff',
                personalNo: data.employee?.personalNo || data.employeeId || ''
              },
          timestamps: data.timestamps || {
            submitted: data.createdAt || new Date().toISOString(),
            lastUpdated: data.updatedAt || new Date().toISOString()
          }
        };
        setRequest(mapped);
      } catch (err) {
        console.error('Error fetching request:', err);
        setError('Unable to load receipt. Please verify the request ID or your credentials.');
        showToast('Error loading receipt data');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadRequest();
    }
  }, [id, showToast]);

  // Print function using react-to-print
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `NALCO-ESMA-Receipt-${id}`,
  });

  // PDF Export function using html2canvas & jsPDF
  const handleExportPDF = async () => {
    const element = componentRef.current;
    if (!element) return;
    
    showToast('Generating PDF receipt...');
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgWidth = 210; // A4 size width in mm
      const pageHeight = 295; // A4 size height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
      
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      pdf.save(`NALCO-ESMA-${id}.pdf`);
      showToast('PDF exported successfully');
    } catch (err) {
      console.error('PDF export failed:', err);
      showToast('Failed to export PDF');
    }
  };

  // Download receipt as image (PNG)
  const handleDownloadImage = async () => {
    const element = componentRef.current;
    if (!element) return;
    
    showToast('Capturing receipt image...');
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false
      });
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `NALCO-ESMA-Receipt-${id}.png`;
      link.href = url;
      link.click();
      showToast('Receipt image downloaded');
    } catch (err) {
      console.error('Image capture failed:', err);
      showToast('Failed to download receipt image');
    }
  };

  const handleBackToPortal = () => {
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white">
        <div className="w-16 h-16 border-4 border-nalco-red/20 border-t-nalco-red rounded-full animate-spin mb-4" />
        <p className="font-bold tracking-widest text-sm uppercase text-slate-400">Loading Approval Sheet...</p>
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 px-6 text-center text-white">
        <svg className="w-16 h-16 text-nalco-red mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h3 className="text-xl font-black mb-2 text-nalco-red">ERROR LOADING RECEIPT</h3>
        <p className="text-sm text-slate-400 max-w-md mb-6">{error || 'Receipt not found.'}</p>
        <button 
          onClick={handleBackToPortal}
          className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg text-xs uppercase tracking-wider transition-all"
        >
          Back to Portal
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900/95 py-8 px-4 flex flex-col items-center overflow-y-auto">
      {/* Top Navigation Panel */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-[800px] bg-slate-800 border border-slate-700 rounded-xl px-6 py-4 flex flex-wrap items-center justify-between gap-4 mb-6 shadow-xl select-none"
      >
        <div className="flex items-center space-x-3">
          <button 
            onClick={handleBackToPortal}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-slate-700 hover:bg-slate-600 active:scale-95 text-white font-bold rounded-lg text-xs uppercase tracking-wider transition-all border border-slate-600"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Portal</span>
          </button>
          
          <div className="h-6 w-px bg-slate-700 hidden sm:block" />
          <span className="hidden sm:inline-block text-xs font-black text-slate-400 tracking-wider uppercase">
            Receipt: <span className="text-white font-mono">{request.id}</span>
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {/* Print Button */}
          <button 
            onClick={handlePrint}
            className="flex items-center space-x-1.5 px-4 py-2 bg-nalco-blue hover:bg-slate-900 active:scale-95 text-white font-bold rounded-lg text-xs uppercase tracking-wider transition-all border border-slate-600 shadow-md shadow-nalco-blue/20"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            <span>Print</span>
          </button>

          {/* Export PDF Button */}
          <button 
            onClick={handleExportPDF}
            className="flex items-center space-x-1.5 px-4 py-2 bg-nalco-red hover:bg-red-700 active:scale-95 text-white font-bold rounded-lg text-xs uppercase tracking-wider transition-all shadow-md shadow-nalco-red/20"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Export PDF</span>
          </button>

          {/* Download Receipt Image Button */}
          <button 
            onClick={handleDownloadImage}
            className="flex items-center space-x-1.5 px-4 py-2 bg-orange-600 hover:bg-orange-700 active:scale-95 text-white font-bold rounded-lg text-xs uppercase tracking-wider transition-all shadow-md shadow-orange-600/20"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Download</span>
          </button>
        </div>
      </motion.div>

      {/* Printable A4 Mockup Sheet */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="w-full max-w-[800px] shadow-2xl bg-white border border-slate-300 rounded-xl my-4 overflow-hidden"
      >
        {/* A4 Content Canvas */}
        <div 
          ref={componentRef} 
          className="bg-white p-8 md:p-14 lg:p-16 flex flex-col justify-between w-full aspect-[1/1.414] min-h-[1050px]"
          style={{ boxSizing: 'border-box' }}
        >
          {/* Header */}
          <ReceiptHeader request={request} />

          {/* Body Tables */}
          <div className="flex-1">
            <ApprovalTable request={request} />
          </div>

          {/* Signatures */}
          <SignatureSection request={request} />

          {/* Footer */}
          <ReceiptFooter request={request} />
        </div>
      </motion.div>
    </div>
  );
}
