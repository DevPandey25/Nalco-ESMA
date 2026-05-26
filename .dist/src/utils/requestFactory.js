import { nowStamp } from './statusHelpers.js';

let _counter = 71;

export function createRequest(input) {
  return {
    id: input.id,
    employee: {
      name: input.employeeName,
      email: input.email || `${input.employeeName.toLowerCase().replace(/\s+/g, '.')}@nalcoindia.co.in`,
      personalNo: input.personalNo,
      designation: input.designation,
    },
    department: input.department,
    unit: input.unit,
    media: input.media,
    fromDate: input.fromDate,
    toDate: input.toDate,
    status: input.status,
    assignedTo: input.assignedTo,
    priority: input.priority || 'medium',
    justification: input.justification || '',
    rejectionReason: input.rejectionReason || '',
    signatures: {
      employeeSign: null,
      hodSign: null,
      caSign: null,
      naSign: null,
      ...(input.signatures || {}),
    },
    comments: input.comments || {},
    timestamps: {
      created: input.created || input.lastUpdated,
      submitted: input.submitted || '',
      lastUpdated: input.lastUpdated,
    },
  };
}

export function signSeed(name, timestamp, comment = '') {
  return { name, timestamp, comment, mode: 'auto' };
}

export function buildSignature(user, mode, canvasDataUrl = '') {
  return {
    name: user.name,
    timestamp: nowStamp(),
    comment: '',
    mode,
    image: mode === 'draw' ? canvasDataUrl : '',
  };
}

export function nextRequestId(requests) {
  const nums = requests.map((r) => Number(r.id.split('-').pop())).filter(Boolean);
  const max = nums.length ? Math.max(...nums) : _counter - 1;
  return `ESMA-2026-${String(max + 1).padStart(4, '0')}`;
}
