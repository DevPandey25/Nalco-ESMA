import React from 'react';
import nalcoLogo from '../../assets/nalco-logo.png';

export default function ReceiptHeader({ request }) {
  return (
    <div className="flex flex-col items-center select-none">
      {/* Top Branding and Logo Section */}
      <div className="flex items-center justify-center space-x-4 mb-2">
        <img 
          src={nalcoLogo} 
          alt="NALCO Logo" 
          className="h-16 w-auto object-contain"
        />
        <div className="text-center md:text-left">
          <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-none">
            नालको <span className="text-nalco-red">A</span> NALCO
          </h2>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider leading-none mt-1">
            राष्ट्रीय एल्युमिनियम कम्पनी लिमिटेड
          </p>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider leading-none mt-0.5">
            National Aluminium Company Limited
          </p>
        </div>
      </div>
      
      {/* Document Subtitle */}
      <h3 className="text-base md:text-lg font-black text-nalco-blue uppercase tracking-wider text-center mt-3 mb-1">
        External Storage Media Access Approval Receipt
      </h3>
      
      {/* Thick Divider line (PSU red theme) */}
      <div className="w-full border-t-4 border-nalco-red mt-2 mb-6" />
    </div>
  );
}
