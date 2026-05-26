import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppStore } from '../store/useAppStore';
import { nextRequestId } from '../utils/requestFactory';
import { UNITS, MEDIA_TYPES } from '../constants/formOptions';
import SignatureMatrix from '../components/SignatureMatrix';
import { nowStamp } from '../utils/statusHelpers';

const requestFormSchema = z.object({
  employeeName: z.string().min(1, 'Employee name is required'),
  email: z.string().email('Valid email is required'),
  personalNo: z.string().min(1, 'Personal number is required'),
  designation: z.string().min(1, 'Designation is required'),
  department: z.string().min(1, 'Department is required'),
  unit: z.string().min(1, 'Please select a unit'),
  mediaType: z.string().min(1, 'Please select media type'),
  fromDate: z.string().min(1, 'From date is required'),
  toDate: z.string().min(1, 'To date is required'),
  justification: z.string().min(1, 'Justification is required'),
}).refine(
  (data) => new Date(data.toDate) >= new Date(data.fromDate),
  { message: 'To date must be after from date', path: ['toDate'] }
);

export default function RequestForm() {
  const role = useAppStore(state => state.role);
  const showToast = useAppStore(state => state.showToast);
  const requests = useAppStore(state => state.requests);
  const openWorkflow = useAppStore(state => state.openWorkflow);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(requestFormSchema)
  });

  const onSubmit = (data) => {
    if (role !== 'Employee' && role !== 'IT Admin') {
      showToast('Only Employee or IT Admin can submit a new request.');
      return;
    }

    const draft = {
      id: nextRequestId(requests),
      employeeName: data.employeeName,
      email: data.email,
      personalNo: data.personalNo,
      designation: data.designation,
      department: data.department,
      unit: data.unit,
      media: data.mediaType,
      fromDate: data.fromDate,
      toDate: data.toDate,
      justification: data.justification,
      status: 'DRAFT',
      assignedTo: 'Employee',
      priority: 'medium',
      lastUpdated: nowStamp()
    };

    openWorkflow('submit', null, draft);
  };

  useEffect(() => {
    const unsubscribe = useAppStore.subscribe(
      (state) => state.workflow.isOpen,
      (isOpen, prevIsOpen) => {
        if (!isOpen && prevIsOpen && useAppStore.getState().workflow.action === 'submit') {
          if (!useAppStore.getState().workflow.draft) {
             reset();
          }
        }
      }
    );
    return unsubscribe;
  }, [reset]);


  return (
    <div className="w-full">
      <form className="bg-white p-2" onSubmit={handleSubmit(onSubmit)}>
        {/* Header */}
        <div className="flex items-start justify-between border-b border-enterprise-line pb-6 mb-8">
          <div>
            <h3 className="text-2xl font-bold text-nalco-blue tracking-tight">NALCO External Storage Media Access Form</h3>
            <p className="text-enterprise-muted mt-1 text-sm font-medium">Employee submission with digital signature</p>
          </div>
          <span className="bg-orange-50 text-orange-700 border border-orange-100 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
            Draft
          </span>
        </div>

        {/* Top Grid - 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="flex flex-col">
            <label className="text-xs font-bold text-enterprise-muted mb-2 ml-1">Employee Name</label>
            <input className="input-field" {...register('employeeName')} placeholder="Employee name" />
            {errors.employeeName && <span className="text-red-500 text-xs mt-1">{errors.employeeName.message}</span>}
          </div>
          <div className="flex flex-col">
            <label className="text-xs font-bold text-enterprise-muted mb-2 ml-1">Email</label>
            <input className="input-field" type="email" {...register('email')} placeholder="Email address" />
            {errors.email && <span className="text-red-500 text-xs mt-1">{errors.email.message}</span>}
          </div>
          <div className="flex flex-col">
            <label className="text-xs font-bold text-enterprise-muted mb-2 ml-1">Personal No</label>
            <input className="input-field" {...register('personalNo')} placeholder="Personal number" />
            {errors.personalNo && <span className="text-red-500 text-xs mt-1">{errors.personalNo.message}</span>}
          </div>
          <div className="flex flex-col">
            <label className="text-xs font-bold text-enterprise-muted mb-2 ml-1">Designation</label>
            <input className="input-field" {...register('designation')} placeholder="Designation" />
            {errors.designation && <span className="text-red-500 text-xs mt-1">{errors.designation.message}</span>}
          </div>
          <div className="flex flex-col">
            <label className="text-xs font-bold text-enterprise-muted mb-2 ml-1">Department</label>
            <input className="input-field" {...register('department')} placeholder="Department" />
            {errors.department && <span className="text-red-500 text-xs mt-1">{errors.department.message}</span>}
          </div>
        </div>

        {/* Middle Grid - 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="flex flex-col">
            <label className="text-xs font-bold text-enterprise-muted mb-2 ml-1">Unit</label>
            <select className="input-field bg-white" {...register('unit')}>
              <option value="">Select unit</option>
              {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
            {errors.unit && <span className="text-red-500 text-xs mt-1">{errors.unit.message}</span>}
          </div>
          <div className="flex flex-col">
            <label className="text-xs font-bold text-enterprise-muted mb-2 ml-1">Media Type</label>
            <select className="input-field bg-white" {...register('mediaType')}>
              <option value="">Select media</option>
              {MEDIA_TYPES.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            {errors.mediaType && <span className="text-red-500 text-xs mt-1">{errors.mediaType.message}</span>}
          </div>
          <div className="flex flex-col">
            <label className="text-xs font-bold text-enterprise-muted mb-2 ml-1">From Date</label>
            <input className="input-field" type="date" {...register('fromDate')} />
            {errors.fromDate && <span className="text-red-500 text-xs mt-1">{errors.fromDate.message}</span>}
          </div>
          <div className="flex flex-col">
            <label className="text-xs font-bold text-enterprise-muted mb-2 ml-1">To Date</label>
            <input className="input-field" type="date" {...register('toDate')} />
            {errors.toDate && <span className="text-red-500 text-xs mt-1">{errors.toDate.message}</span>}
          </div>
        </div>

        {/* Justification - Full Width */}
        <div className="flex flex-col mb-8">
          <label className="text-xs font-bold text-enterprise-muted mb-2 ml-1">Justification</label>
          <textarea 
            className="input-field min-h-[100px] resize-y" 
            {...register('justification')} 
            rows="4" 
            placeholder="Business justification for external media access"
          ></textarea>
          {errors.justification && <span className="text-red-500 text-xs mt-1">{errors.justification.message}</span>}
        </div>



        {/* Actions */}
        <div className="flex items-center justify-end space-x-4 border-t border-enterprise-line pt-6">
          <button 
            className="px-6 py-2.5 font-bold text-nalco-blue bg-white border border-enterprise-line rounded-lg hover:bg-enterprise-soft transition-colors" 
            type="button" 
            onClick={() => reset()}
          >
            Clear
          </button>
          <button 
            className="px-6 py-2.5 font-bold text-white bg-nalco-blue rounded-lg hover:bg-nalco-blue-dark transition-colors shadow-sm" 
            type="submit"
          >
            Submit & Digitally Sign
          </button>
        </div>
      </form>
    </div>
  );
}

