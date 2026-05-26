import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';
import { useWorkflowActions } from '../../hooks/useWorkflowActions';
import { WORKFLOW_CONFIGS } from '../../constants/workflow';
import SignaturePad from '../SignaturePad';

export default function WorkflowModal() {
  const { isOpen, action, requestId, draft } = useAppStore(state => state.workflow);
  const closeWorkflow = useAppStore(state => state.closeWorkflow);
  const user = useAppStore(state => state.user);
  const showToast = useAppStore(state => state.showToast);
  const { applyWorkflow } = useWorkflowActions();
  
  const [comment, setComment] = useState('');
  const [signatureMode, setSignatureMode] = useState('auto');

  const config = WORKFLOW_CONFIGS[action] || {};
  const target = draft ? draft.id : (requestId || 'new request');

  useEffect(() => {
    if (isOpen) {
      setComment(config.defaultComment || '');
      setSignatureMode('auto');
    }
  }, [isOpen, config.defaultComment]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      showToast('Comment is mandatory for digital signing.');
      return;
    }

    const canvas = document.getElementById('signaturePad');
    const canvasDataUrl = signatureMode === 'draw' && canvas ? canvas.toDataURL('image/png') : '';
    
    applyWorkflow(action, requestId, draft, comment, signatureMode, canvasDataUrl);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
        onClick={closeWorkflow}
      />
      
      {/* Modal Content */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-4xl relative z-10 overflow-hidden border-l-[12px] border-[#003B70]"
      >
        <form onSubmit={handleSubmit} className="flex flex-col h-full max-h-[90vh]">
          {/* Header */}
          <div className="p-6 pb-4 flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold text-[#003B70] uppercase tracking-widest mb-1">Digital Signature</p>
              <h3 className="text-2xl font-black text-enterprise-ink">
                {config.title && config.title(target).includes('new request') ? 'Submit new request' : config.title && config.title(target)}
              </h3>
            </div>
            <button 
              className="w-8 h-8 flex items-center justify-center bg-enterprise-soft rounded-lg text-enterprise-ink hover:bg-enterprise-line transition-colors" 
              type="button" 
              onClick={closeWorkflow} 
              aria-label="Close"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="p-6 pt-0 overflow-y-auto space-y-6">
            {/* Declaration/Comment */}
            <div className="flex flex-col">
              <label className="text-xs font-bold text-enterprise-muted mb-2 ml-1">{config.commentLabel}</label>
              <textarea 
                className="input-field min-h-[100px] resize-y"
                required 
                placeholder={config.placeholder}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
            
            {/* Signature Area */}
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1">
                <SignaturePad onModeChange={setSignatureMode} />
              </div>
              
              <div className="w-full lg:w-1/3 mt-6 lg:mt-6 bg-enterprise-soft/30 border border-enterprise-line rounded-lg p-5 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-enterprise-ink mb-1">{user.name}</h4>
                  <p className="text-sm text-enterprise-muted mb-4">{user.title}</p>
                  <p className="text-xs text-enterprise-muted">
                    {signatureMode === 'draw' 
                      ? 'Drawn signature will be stored with timestamp.' 
                      : 'Auto signature will store name and timestamp.'}
                  </p>
                </div>
                <div className="mt-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-200">
                    Ready to Sign
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Actions */}
          <div className="p-6 border-t border-enterprise-line bg-white flex items-center justify-end space-x-3">
            <button 
              className="px-6 py-2.5 font-bold text-nalco-blue bg-white border border-enterprise-line rounded-lg hover:bg-enterprise-soft transition-colors" 
              type="button" 
              onClick={closeWorkflow}
            >
              Cancel
            </button>
            <button 
              className="px-6 py-2.5 font-bold text-white bg-[#003B70] rounded-lg hover:bg-[#002244] transition-colors shadow-sm" 
              type="submit"
            >
              {config.confirmText}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
