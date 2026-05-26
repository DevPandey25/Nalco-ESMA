import { useEffect, useRef, useState } from 'react';

export default function SignaturePad({ onModeChange }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000000';
    // fill white bg so toDataURL doesn't export transparency
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const getCoordinates = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * canvas.width,
      y: ((event.clientY - rect.top) / rect.height) * canvas.height
    };
  };

  const handlePointerDown = (e) => {
    setIsDrawing(true);
    onModeChange('draw');
    const ctx = canvasRef.current.getContext('2d');
    const point = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(point.x, point.y);
  };

  const handlePointerMove = (e) => {
    if (!isDrawing) return;
    const ctx = canvasRef.current.getContext('2d');
    const point = getCoordinates(e);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
  };

  const handlePointerUp = () => {
    setIsDrawing(false);
  };

  const clearPad = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    onModeChange('auto');
  };

  return (
    <div className="flex flex-col w-full">
      <span className="text-xs font-bold text-enterprise-muted mb-2 ml-1">Signature Pad</span>
      <div className="border border-dashed border-enterprise-muted rounded-lg overflow-hidden bg-white mb-3">
        <canvas 
          id="signaturePad" 
          ref={canvasRef}
          className="w-full h-[150px] cursor-crosshair touch-none"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        />
      </div>
      <div className="flex items-center space-x-3">
        <button 
          className="px-4 py-2 text-sm font-bold text-nalco-blue bg-white border border-enterprise-line rounded-md hover:bg-enterprise-soft transition-colors" 
          type="button" 
          onClick={clearPad}
        >
          Clear Pad
        </button>
        <button 
          className="px-4 py-2 text-sm font-bold text-nalco-blue bg-white border border-enterprise-line rounded-md hover:bg-enterprise-soft transition-colors" 
          type="button" 
          onClick={() => onModeChange('auto')}
        >
          Auto Signature
        </button>
      </div>
    </div>
  );
}
