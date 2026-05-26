const roles = {
  Employee: { name: "Probina Kumar Ray", title: "Employee" },
  HOD: { name: "A. K. Das", title: "Head of Department" },
  "Competent Authority": { name: "R. Mohanty", title: "Competent Authority" },
  "Network Admin": { name: "Prakash Behera", title: "Network Administrator" },
  "IT Admin": { name: "ESMA System Admin", title: "IT Administrator" }
};

const assignees = ["Employee", "HOD", "Competent Authority", "Network Admin", "IT Admin"];
const workflowTabs = [
  { label: "All Work", value: "all" },
  { label: "Draft", value: "DRAFT" },
  { label: "Submitted", value: "SUBMITTED" },
  { label: "Recommended", value: "RECOMMENDED" },
  { label: "Approved", value: "APPROVED" },
  { label: "Implemented", value: "IMPLEMENTED" },
  { label: "Rejected", value: "rejected" }
];
const boardColumns = ["DRAFT", "SUBMITTED", "RECOMMENDED", "APPROVED", "IMPLEMENTED", "REJECTED"];
const pageTitles = {
  dashboard: ["Dashboard", "ESMA Command Center"],
  request: ["Request Form", "External Storage Media Access Form"],
  data: ["Data Management / All Requests", "ESMA Work Queue"],
  approvals: ["Approvals", "Role-Based Approval Queue"],
  reports: ["Reports", "ESMA Workflow Reports"]
};
const signatureSlots = [
  ["employeeSign", "Employee"],
  ["hodSign", "HOD Recommendation"],
  ["caSign", "Authority Approval"],
  ["naSign", "Implementation"]
];

let requests = [
  createRequest({
    id: "ESMA-2026-0063",
    employeeName: "Probina Kumar Ray",
    personalNo: "10845",
    designation: "DM (HR)",
    department: "Administration",
    unit: "CPP",
    media: "USB",
    fromDate: "2026-04-10",
    toDate: "2026-04-19",
    status: "IMPLEMENTED",
    assignedTo: "Network Admin",
    priority: "medium",
    justification: "Transfer basis",
    lastUpdated: "2026-04-19 17:20",
    signatures: {
      employeeSign: signSeed("Probina Kumar Ray", "2026-04-09 10:15"),
      hodSign: signSeed("A. K. Das", "2026-04-11 12:10", "Recommended for approved HR transfer activity."),
      caSign: signSeed("R. Mohanty", "2026-04-11 15:35", "Approved with normal security controls."),
      naSign: signSeed("Prakash Behera", "2026-04-19 17:20", "Implemented and media access closed.")
    },
    comments: {
      hod: "Recommended for approved HR transfer activity.",
      ca: "Approved with normal security controls.",
      na: "Implemented and media access closed."
    }
  }),
  createRequest({
    id: "ESMA-2026-0064",
    employeeName: "Anita Das",
    personalNo: "11308",
    designation: "Assistant Manager",
    department: "Finance",
    unit: "Smelter",
    media: "USB",
    fromDate: "2026-05-12",
    toDate: "2026-05-14",
    status: "SUBMITTED",
    assignedTo: "HOD",
    priority: "high",
    justification: "Statutory audit data transfer",
    lastUpdated: "2026-05-10 09:15",
    signatures: {
      employeeSign: signSeed("Anita Das", "2026-05-10 09:15")
    }
  }),
  createRequest({
    id: "ESMA-2026-0065",
    employeeName: "Rahul Mishra",
    personalNo: "11954",
    designation: "Manager",
    department: "IT",
    unit: "Refinery",
    media: "External HDD",
    fromDate: "2026-05-16",
    toDate: "2026-05-18",
    status: "RECOMMENDED",
    assignedTo: "Competent Authority",
    priority: "medium",
    justification: "Patch archive transfer to isolated system",
    lastUpdated: "2026-05-10 11:40",
    signatures: {
      employeeSign: signSeed("Rahul Mishra", "2026-05-10 10:22"),
      hodSign: signSeed("A. K. Das", "2026-05-10 11:40", "Recommended for controlled transfer.")
    },
    comments: { hod: "Recommended for controlled transfer." }
  }),
  createRequest({
    id: "ESMA-2026-0066",
    employeeName: "Sushmita Sahoo",
    personalNo: "12041",
    designation: "Officer",
    department: "HR",
    unit: "Mines",
    media: "CD",
    fromDate: "2026-05-07",
    toDate: "2026-05-08",
    status: "REJECTED_L1",
    assignedTo: "Employee",
    priority: "low",
    justification: "Employee records copy",
    lastUpdated: "2026-05-09 16:05",
    rejectionReason: "Business justification does not match approved media access purpose.",
    signatures: {
      employeeSign: signSeed("Sushmita Sahoo", "2026-05-07 08:45"),
      hodSign: signSeed("A. K. Das", "2026-05-09 16:05", "Business justification does not match approved media access purpose.")
    },
    comments: { hod: "Business justification does not match approved media access purpose." }
  }),
  createRequest({
    id: "ESMA-2026-0067",
    employeeName: "Biswajit Nayak",
    personalNo: "11776",
    designation: "Senior Engineer",
    department: "Projects",
    unit: "Corporate Office",
    media: "USB",
    fromDate: "2026-05-15",
    toDate: "2026-05-20",
    status: "APPROVED",
    assignedTo: "Network Admin",
    priority: "high",
    justification: "Vendor commissioning files",
    lastUpdated: "2026-05-10 13:25",
    signatures: {
      employeeSign: signSeed("Biswajit Nayak", "2026-05-09 14:05"),
      hodSign: signSeed("A. K. Das", "2026-05-10 10:00", "Recommended for project commissioning."),
      caSign: signSeed("R. Mohanty", "2026-05-10 13:25", "Approved for defined date range.")
    },
    comments: {
      hod: "Recommended for project commissioning.",
      ca: "Approved for defined date range."
    }
  }),
  createRequest({
    id: "ESMA-2026-0068",
    employeeName: "Madhumita Pradhan",
    personalNo: "12280",
    designation: "Executive",
    department: "Commercial",
    unit: "New Delhi",
    media: "Others",
    fromDate: "2026-05-21",
    toDate: "2026-05-22",
    status: "DRAFT",
    assignedTo: "Employee",
    priority: "low",
    justification: "Quotation archive preparation",
    lastUpdated: "2026-05-10 15:12"
  }),
  createRequest({
    id: "ESMA-2026-0069",
    employeeName: "Debasis Mohanty",
    personalNo: "12501",
    designation: "Engineer",
    department: "Operations",
    unit: "Damanjodi",
    media: "USB",
    fromDate: "2026-05-18",
    toDate: "2026-05-19",
    status: "SUBMITTED",
    assignedTo: "HOD",
    priority: "medium",
    justification: "Shift log transfer",
    lastUpdated: "2026-05-10 16:50",
    signatures: {
      employeeSign: signSeed("Debasis Mohanty", "2026-05-10 16:50")
    }
  }),
  createRequest({
    id: "ESMA-2026-0070",
    employeeName: "Nirmal Patnaik",
    personalNo: "12823",
    designation: "Technician",
    department: "Maintenance",
    unit: "Angul",
    media: "External SSD",
    fromDate: "2026-05-11",
    toDate: "2026-05-13",
    status: "APPROVED",
    assignedTo: "Network Admin",
    priority: "high",
    justification: "Machine diagnostic logs",
    lastUpdated: "2026-05-10 17:35",
    signatures: {
      employeeSign: signSeed("Nirmal Patnaik", "2026-05-10 12:25"),
      hodSign: signSeed("A. K. Das", "2026-05-10 14:30", "Recommended for diagnostic review."),
      caSign: signSeed("R. Mohanty", "2026-05-10 17:35", "Approved.")
    },
    comments: {
      hod: "Recommended for diagnostic review.",
      ca: "Approved."
    }
  })
];

const state = {
  activePage: "dashboard",
  role: "Employee",
  search: "",
  filter: "all",
  activeTab: "all",
  sort: "dateDesc",
  page: 1,
  pageSize: 5,
  view: "table",
  pendingAction: null,
  pendingRequestDraft: null,
  signatureMode: "auto",
  isDrawing: false
};

const els = {
  pageCrumb: document.getElementById("pageCrumb"),
  pageTitle: document.getElementById("pageTitle"),
  roleSelect: document.getElementById("roleSelect"),
  summaryCards: document.getElementById("summaryCards"),
  recentActivity: document.getElementById("recentActivity"),
  myRequests: document.getElementById("myRequests"),
  requestForm: document.getElementById("requestForm"),
  formSignatureMatrix: document.getElementById("formSignatureMatrix"),
  resultMeta: document.getElementById("resultMeta"),
  searchInput: document.getElementById("searchInput"),
  statusFilter: document.getElementById("statusFilter"),
  sortSelect: document.getElementById("sortSelect"),
  workflowTabs: document.getElementById("workflowTabs"),
  tablePanel: document.getElementById("tablePanel"),
  boardPanel: document.getElementById("boardPanel"),
  tableBody: document.getElementById("requestTableBody"),
  pageInfo: document.getElementById("pageInfo"),
  prevPageBtn: document.getElementById("prevPageBtn"),
  nextPageBtn: document.getElementById("nextPageBtn"),
  tableViewBtn: document.getElementById("tableViewBtn"),
  boardViewBtn: document.getElementById("boardViewBtn"),
  approvalMeta: document.getElementById("approvalMeta"),
  roleScopeBadge: document.getElementById("roleScopeBadge"),
  approvalTableBody: document.getElementById("approvalTableBody"),
  monthlyChart: document.getElementById("monthlyChart"),
  rateCards: document.getElementById("rateCards"),
  reportTable: document.getElementById("reportTable"),
  detailModal: document.getElementById("detailModal"),
  detailTitle: document.getElementById("detailTitle"),
  detailContent: document.getElementById("detailContent"),
  detailSignatureMatrix: document.getElementById("detailSignatureMatrix"),
  workflowModal: document.getElementById("workflowModal"),
  workflowForm: document.getElementById("workflowForm"),
  workflowTitle: document.getElementById("workflowTitle"),
  workflowCommentLabel: document.getElementById("workflowCommentLabel"),
  workflowCommentInput: document.getElementById("workflowCommentInput"),
  signaturePad: document.getElementById("signaturePad"),
  clearSignatureBtn: document.getElementById("clearSignatureBtn"),
  autoSignatureBtn: document.getElementById("autoSignatureBtn"),
  signaturePreview: document.getElementById("signaturePreview"),
  confirmWorkflowBtn: document.getElementById("confirmWorkflowBtn"),
  emailModal: document.getElementById("emailModal"),
  emailPreview: document.getElementById("emailPreview"),
  mailToLink: document.getElementById("mailToLink"),
  toastRegion: document.getElementById("toastRegion")
};

function createRequest(input) {
  return {
    id: input.id,
    employee: {
      name: input.employeeName,
      personalNo: input.personalNo,
      designation: input.designation
    },
    department: input.department,
    unit: input.unit,
    media: input.media,
    fromDate: input.fromDate,
    toDate: input.toDate,
    status: input.status,
    assignedTo: input.assignedTo,
    priority: input.priority || "medium",
    justification: input.justification || "",
    rejectionReason: input.rejectionReason || "",
    signatures: {
      employeeSign: null,
      hodSign: null,
      caSign: null,
      naSign: null,
      ...(input.signatures || {})
    },
    comments: input.comments || {},
    timestamps: {
      created: input.created || input.lastUpdated,
      submitted: input.submitted || "",
      lastUpdated: input.lastUpdated
    }
  };
}

function signSeed(name, timestamp, comment = "") {
  return { name, timestamp, comment, mode: "auto" };
}

function formatDate(value) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(value));
}

function nowStamp() {
  const date = new Date();
  const dateText = date.toISOString().slice(0, 10);
  const timeText = date.toTimeString().slice(0, 5);
  return `${dateText} ${timeText}`;
}

function statusClass(status) {
  return `status-${status}`;
}

function statusLabel(status) {
  const labels = {
    DRAFT: "Draft",
    SUBMITTED: "Submitted",
    RECOMMENDED: "Recommended",
    APPROVED: "Approved",
    IMPLEMENTED: "Implemented",
    REJECTED_L1: "Rejected L1",
    REJECTED_FINAL: "Rejected Final"
  };
  return labels[status] || status;
}

function isRejected(request) {
  return request.status === "REJECTED_L1" || request.status === "REJECTED_FINAL";
}

function getUser() {
  return roles[state.role];
}

function getEffectiveStatusFilter() {
  if (state.filter !== "all") return state.filter;
  if (state.activeTab !== "all") return state.activeTab;
  return "all";
}

function getFilteredRequests() {
  const query = state.search.trim().toLowerCase();
  const status = getEffectiveStatusFilter();

  return requests
    .filter((request) => {
      const searchable = [
        request.employee.name,
        request.id,
        request.department,
        request.unit,
        request.media
      ].join(" ").toLowerCase();
      return !query || searchable.includes(query);
    })
    .filter((request) => {
      if (status === "all") return true;
      if (status === "rejected") return isRejected(request);
      return request.status === status;
    })
    .sort((a, b) => {
      if (state.sort === "statusAsc") {
        return a.status.localeCompare(b.status) || b.timestamps.lastUpdated.localeCompare(a.timestamps.lastUpdated);
      }
      return b.timestamps.lastUpdated.localeCompare(a.timestamps.lastUpdated);
    });
}

function countByStatus(status) {
  if (status === "pending") {
    return requests.filter((request) => ["SUBMITTED", "RECOMMENDED"].includes(request.status)).length;
  }
  if (status === "rejected") {
    return requests.filter(isRejected).length;
  }
  return requests.filter((request) => request.status === status).length;
}

function render() {
  renderPageFrame();
  renderSummary();
  renderDashboard();
  renderRequestFormMatrix();
  renderTabs();
  renderDataTable();
  renderBoard();
  renderApprovalQueue();
  renderReports();
}

function renderPageFrame() {
  const [crumb, title] = pageTitles[state.activePage];
  els.pageCrumb.textContent = crumb;
  els.pageTitle.textContent = title;
  document.querySelectorAll("[data-page]").forEach((page) => {
    page.classList.toggle("active", page.dataset.page === state.activePage);
  });
  document.querySelectorAll("[data-page-link]").forEach((link) => {
    link.classList.toggle("active", link.dataset.pageLink === state.activePage);
  });
}

function renderSummary() {
  const summary = [
    { label: "Total Requests", value: requests.length, tone: "total" },
    { label: "Pending", value: countByStatus("pending"), tone: "pending" },
    { label: "Approved", value: countByStatus("APPROVED"), tone: "approved" },
    { label: "Rejected", value: countByStatus("rejected"), tone: "rejected" },
    { label: "Implemented", value: countByStatus("IMPLEMENTED"), tone: "implemented" }
  ];

  els.summaryCards.innerHTML = summary.map((item) => `
    <article class="summary-card" data-tone="${item.tone}">
      <span>${item.label}</span>
      <strong>${item.value}</strong>
    </article>
  `).join("");
}

function renderDashboard() {
  const recent = [...requests]
    .sort((a, b) => b.timestamps.lastUpdated.localeCompare(a.timestamps.lastUpdated))
    .slice(0, 6);

  els.recentActivity.innerHTML = recent.map((request) => `
    <div class="activity-item">
      <time>${request.timestamps.lastUpdated}</time>
      <div>
        <strong>${request.id}</strong> moved to <span class="status-badge ${statusClass(request.status)}">${statusLabel(request.status)}</span>
        <div class="mini-meta">${request.employee.name} | ${request.department}</div>
      </div>
    </div>
  `).join("");

  const scoped = state.role === "Employee"
    ? requests.filter((request) => request.employee.name === getUser().name)
    : getApprovalQueue().slice(0, 5);
  els.myRequests.innerHTML = renderMiniRequestTable(scoped);
}

function renderMiniRequestTable(rows) {
  if (!rows.length) return `<div class="empty-state">No records for this role.</div>`;
  return `
    <div class="table-wrap">
      <table>
        <thead>
          <tr><th>Request</th><th>Employee</th><th>Status</th><th>Assigned</th></tr>
        </thead>
        <tbody>
          ${rows.map((request) => `
            <tr>
              <td><strong>${request.id}</strong></td>
              <td>${request.employee.name}</td>
              <td><span class="status-badge ${statusClass(request.status)}">${statusLabel(request.status)}</span></td>
              <td>${request.assignedTo}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderRequestFormMatrix() {
  els.formSignatureMatrix.innerHTML = renderSignatureMatrix({
    signatures: { employeeSign: null, hodSign: null, caSign: null, naSign: null }
  });
}

function renderTabs() {
  els.workflowTabs.innerHTML = workflowTabs.map((tab) => {
    const count = tab.value === "all"
      ? requests.length
      : tab.value === "rejected"
        ? countByStatus("rejected")
        : countByStatus(tab.value);
    return `
      <button class="tab-btn ${state.activeTab === tab.value ? "active" : ""}"
        type="button"
        data-tab="${tab.value}">
        ${tab.label} (${count})
      </button>
    `;
  }).join("");
}

function renderDataTable() {
  const filtered = getFilteredRequests();
  const totalPages = Math.max(1, Math.ceil(filtered.length / state.pageSize));
  state.page = Math.min(state.page, totalPages);
  const start = (state.page - 1) * state.pageSize;
  const visibleRows = filtered.slice(start, start + state.pageSize);

  els.resultMeta.textContent = `${filtered.length} records`;
  els.pageInfo.textContent = `Page ${state.page} of ${totalPages}`;
  els.prevPageBtn.disabled = state.page === 1;
  els.nextPageBtn.disabled = state.page === totalPages;

  if (!visibleRows.length) {
    els.tableBody.innerHTML = `<tr><td colspan="14">No requests found.</td></tr>`;
  } else {
    els.tableBody.innerHTML = visibleRows.map((request, index) => `
      <tr class="${isRejected(request) ? "rejected-row" : ""}">
        <td>${start + index + 1}</td>
        <td><strong>${request.id}</strong></td>
        <td>${request.employee.name}</td>
        <td>${request.department}</td>
        <td>${request.unit}</td>
        <td>${request.media}</td>
        <td>${formatDate(request.fromDate)} - ${formatDate(request.toDate)}</td>
        <td><span class="status-badge ${statusClass(request.status)}">${statusLabel(request.status)}</span></td>
        <td>${renderSignatureTrail(request)}</td>
        <td>${renderAssignmentDropdown(request)}</td>
        <td><span class="stage-text">${approvalStage(request)}</span></td>
        <td>${request.timestamps.lastUpdated}</td>
        <td class="reason-cell">${renderReason(request)}</td>
        <td>${renderActions(request)}</td>
      </tr>
    `).join("");
  }

  els.tablePanel.classList.toggle("active", state.view === "table");
  els.boardPanel.classList.toggle("active", state.view === "board");
  els.tableViewBtn.classList.toggle("active", state.view === "table");
  els.boardViewBtn.classList.toggle("active", state.view === "board");
}

function renderAssignmentDropdown(request) {
  const disabled = state.role !== "IT Admin" ? "disabled" : "";
  return `
    <select class="assignment-dropdown" data-action="assign" data-id="${request.id}" ${disabled}>
      ${assignees.map((name) => `
        <option value="${name}" ${request.assignedTo === name ? "selected" : ""}>${name}</option>
      `).join("")}
    </select>
  `;
}

function renderReason(request) {
  if (!request.rejectionReason) return "-";
  return `<span class="reason-text" title="${escapeHtml(request.rejectionReason)}">${escapeHtml(request.rejectionReason)}</span>`;
}

function approvalStage(request) {
  const stages = {
    DRAFT: "Employee draft",
    SUBMITTED: "HOD recommendation",
    RECOMMENDED: "Authority approval",
    APPROVED: "Network implementation",
    IMPLEMENTED: "Closed",
    REJECTED_L1: "Rejected by HOD",
    REJECTED_FINAL: "Final rejection"
  };
  return stages[request.status] || request.status;
}

function renderSignatureTrail(request) {
  return `
    <div class="signature-trail">
      ${signatureSlots.map(([slot, label]) => `
        <span class="signature-dot ${request.signatures[slot] ? "signed" : ""}" title="${label}">
          ${label.split(" ")[0]} ${request.signatures[slot] ? "Signed" : "Pending"}
        </span>
      `).join("")}
    </div>
  `;
}

function renderActions(request) {
  const buttons = [`<button class="btn ghost" type="button" data-action="view" data-id="${request.id}">View</button>`];

  if (canRun("submit", request)) buttons.push(button("Submit", "submit", request.id, "primary"));
  if (canRun("recommend", request)) buttons.push(button("Recommend", "recommend", request.id, "ghost"));
  if (canRun("return", request)) buttons.push(button("Return", "return", request.id, "ghost"));
  if (canRun("approve", request)) buttons.push(button("Approve", "approve", request.id, "primary"));
  if (canRun("reject", request)) buttons.push(button("Reject", "reject", request.id, "danger"));
  if (canRun("implement", request)) buttons.push(button("Implement", "implement", request.id, "secondary"));
  if (isRejected(request)) buttons.push(button("Send Mail", "mail", request.id, "secondary"));

  return `<div class="action-panel">${buttons.join("")}</div>`;
}

function button(label, action, id, tone) {
  return `<button class="btn ${tone}" type="button" data-action="${action}" data-id="${id}">${label}</button>`;
}

function canRun(action, request) {
  if (state.role === "IT Admin") {
    if (action === "submit") return request.status === "DRAFT";
    if (action === "recommend" || action === "return") return request.status === "SUBMITTED";
    if (action === "approve") return request.status === "RECOMMENDED";
    if (action === "reject") return ["SUBMITTED", "RECOMMENDED"].includes(request.status);
    if (action === "implement") return request.status === "APPROVED";
    return false;
  }
  if (state.role === "Employee") return action === "submit" && request.status === "DRAFT";
  if (state.role === "HOD") return ["recommend", "return", "reject"].includes(action) && request.status === "SUBMITTED";
  if (state.role === "Competent Authority") return ["approve", "reject"].includes(action) && request.status === "RECOMMENDED";
  if (state.role === "Network Admin") return action === "implement" && request.status === "APPROVED";
  return false;
}

function renderBoard() {
  const filtered = getFilteredRequests();
  els.boardPanel.innerHTML = boardColumns.map((column) => {
    const cards = filtered.filter((request) => {
      if (column === "REJECTED") return isRejected(request);
      return request.status === column;
    });
    return `
      <section class="kanban-column" data-column="${column}">
        <header>
          <span>${statusLabel(column)}</span>
          <span>${cards.length}</span>
        </header>
        <div class="kanban-list">
          ${cards.map(renderKanbanCard).join("") || "<span>No requests</span>"}
        </div>
      </section>
    `;
  }).join("");
}

function renderKanbanCard(request) {
  return `
    <article class="kanban-card" draggable="true" data-id="${request.id}">
      <strong>${request.id}</strong>
      <span>${request.employee.name}</span>
      <span>${request.media} | ${formatDate(request.fromDate)} - ${formatDate(request.toDate)}</span>
      <span class="status-badge ${statusClass(request.status)}">${statusLabel(request.status)}</span>
      <span>${approvalStage(request)}</span>
    </article>
  `;
}

function getApprovalQueue() {
  if (state.role === "HOD") return requests.filter((request) => request.status === "SUBMITTED");
  if (state.role === "Competent Authority") return requests.filter((request) => request.status === "RECOMMENDED");
  if (state.role === "Network Admin") return requests.filter((request) => request.status === "APPROVED");
  if (state.role === "IT Admin") return requests.filter((request) => ["SUBMITTED", "RECOMMENDED", "APPROVED"].includes(request.status));
  return [];
}

function renderApprovalQueue() {
  const queue = getApprovalQueue();
  els.roleScopeBadge.textContent = state.role;
  els.approvalMeta.textContent = `${queue.length} requests requiring action for ${state.role}`;

  if (!queue.length) {
    els.approvalTableBody.innerHTML = `<tr><td colspan="7">No approval items for this role.</td></tr>`;
    return;
  }

  els.approvalTableBody.innerHTML = queue.map((request) => `
    <tr>
      <td><strong>${request.id}</strong><div class="mini-meta">${formatDate(request.fromDate)} - ${formatDate(request.toDate)}</div></td>
      <td>${request.employee.name}</td>
      <td>${request.department}</td>
      <td><span class="status-badge ${statusClass(request.status)}">${statusLabel(request.status)}</span></td>
      <td>${request.assignedTo}</td>
      <td>${renderSignatureTrail(request)}</td>
      <td>${renderActions(request)}</td>
    </tr>
  `).join("");
}

function renderReports() {
  const monthCounts = requests.reduce((acc, request) => {
    const key = request.fromDate.slice(0, 7);
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const max = Math.max(1, ...Object.values(monthCounts));
  els.monthlyChart.innerHTML = Object.entries(monthCounts).map(([month, count]) => `
    <div class="bar-row">
      <span>${month}</span>
      <div class="bar-track"><div class="bar-fill" style="width:${(count / max) * 100}%"></div></div>
      <strong>${count}</strong>
    </div>
  `).join("");

  const completed = requests.filter((request) => ["APPROVED", "IMPLEMENTED"].includes(request.status)).length;
  const rejected = countByStatus("rejected");
  const approvalRate = Math.round((completed / Math.max(1, requests.length)) * 100);
  const rejectionRate = Math.round((rejected / Math.max(1, requests.length)) * 100);
  els.rateCards.innerHTML = `
    <article class="rate-card"><span>Approval Rate</span><strong>${approvalRate}%</strong></article>
    <article class="rate-card"><span>Rejection Rate</span><strong>${rejectionRate}%</strong></article>
  `;

  els.reportTable.innerHTML = renderMiniRequestTable(requests);
}

function renderSignatureMatrix(request) {
  return signatureSlots.map(([slot, label]) => {
    const sign = request.signatures[slot];
    return `
      <article class="signature-card">
        <strong>${label}</strong>
        <span>Name: ${sign ? escapeHtml(sign.name) : "-"}</span>
        <span>Date: ${sign ? sign.timestamp : "-"}</span>
        <p>${sign && (sign.comment || sign.note) ? escapeHtml(sign.comment || sign.note) : "Awaiting digital signature"}</p>
        <span class="signature-status ${sign ? "signed" : ""}">${sign ? "Signed" : "Pending"}</span>
      </article>
    `;
  }).join("");
}

function updateRequest(id, updater) {
  requests = requests.map((request) => {
    if (request.id !== id) return request;
    const patch = typeof updater === "function" ? updater(request) : updater;
    return {
      ...request,
      ...patch,
      signatures: { ...request.signatures, ...(patch.signatures || {}) },
      comments: { ...request.comments, ...(patch.comments || {}) },
      timestamps: {
        ...request.timestamps,
        ...(patch.timestamps || {}),
        lastUpdated: nowStamp()
      }
    };
  });
  render();
}

function openDetail(id) {
  const request = requests.find((item) => item.id === id);
  if (!request) return;

  els.detailTitle.textContent = request.id;
  const detailItems = [
    ["Employee Name", request.employee.name],
    ["Personal No", request.employee.personalNo],
    ["Designation", request.employee.designation],
    ["Department", request.department],
    ["Unit", request.unit],
    ["Media Type", request.media],
    ["From Date", formatDate(request.fromDate)],
    ["To Date", formatDate(request.toDate)],
    ["Status", statusLabel(request.status)],
    ["Assigned To", request.assignedTo],
    ["Approval Stage", approvalStage(request)],
    ["Last Updated", request.timestamps.lastUpdated],
    ["Justification", request.justification],
    ["Rejection Reason", request.rejectionReason || "-"],
    ["Direct Edit Link", getDirectEditLink(request.id)]
  ];

  els.detailContent.innerHTML = detailItems.map(([label, value]) => `
    <div class="detail-item">
      <span>${label}</span>
      <strong>${escapeHtml(value)}</strong>
    </div>
  `).join("");
  els.detailSignatureMatrix.innerHTML = renderSignatureMatrix(request);
  els.detailModal.showModal();
}

function openEmailPreview(id) {
  const request = requests.find((item) => item.id === id);
  if (!request) return;

  const subject = "Request Rejected - Action Required";
  const body = [
    `Employee Name: ${request.employee.name}`,
    `Request ID: ${request.id}`,
    `Reason: ${request.rejectionReason || "Not specified"}`,
    `Direct edit link: ${getDirectEditLink(request.id)}`
  ].join("\n");

  els.emailPreview.innerHTML = `
    <p><strong>Subject:</strong> ${subject}</p>
    <div class="email-box">${escapeHtml(body)}</div>
  `;
  els.mailToLink.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  els.emailModal.showModal();
}

function openWorkflow(action, id, draft = null) {
  const request = id ? requests.find((item) => item.id === id) : null;
  const config = workflowConfig(action, request);
  state.pendingAction = { action, id };
  state.pendingRequestDraft = draft;
  state.signatureMode = "auto";
  els.workflowTitle.textContent = config.title;
  els.workflowCommentLabel.textContent = config.commentLabel;
  els.workflowCommentInput.placeholder = config.placeholder;
  els.workflowCommentInput.value = config.defaultComment || "";
  els.confirmWorkflowBtn.textContent = config.confirmText;
  clearSignaturePad();
  updateSignaturePreview();
  els.workflowModal.showModal();
}

function workflowConfig(action, request) {
  const target = request ? request.id : "new request";
  const configs = {
    submit: {
      title: `Submit ${target}`,
      commentLabel: "Employee Declaration",
      placeholder: "Confirm declaration before submitting",
      defaultComment: "I confirm that the submitted details are accurate and required for official work.",
      confirmText: "Submit & Sign"
    },
    recommend: {
      title: `Recommend ${target}`,
      commentLabel: "HOD Comment",
      placeholder: "Recommendation comment",
      confirmText: "Recommend & Sign"
    },
    return: {
      title: `Return ${target}`,
      commentLabel: "Return Comment",
      placeholder: "Reason for returning to employee",
      confirmText: "Return & Sign"
    },
    approve: {
      title: `Approve ${target}`,
      commentLabel: "Authority Comment",
      placeholder: "Final approval comment",
      confirmText: "Approve & Sign"
    },
    reject: {
      title: `Reject ${target}`,
      commentLabel: "Rejection Reason",
      placeholder: "Mandatory rejection reason",
      confirmText: "Reject & Sign"
    },
    implement: {
      title: `Implement ${target}`,
      commentLabel: "Implementation Note",
      placeholder: "Implementation note",
      confirmText: "Implement & Sign"
    }
  };
  return configs[action];
}

function applyWorkflowAction() {
  const pending = state.pendingAction;
  if (!pending) return;

  const comment = els.workflowCommentInput.value.trim();
  if (!comment) {
    showToast("Comment is mandatory for digital signing.");
    return;
  }

  const signature = buildSignature(comment);
  if (pending.action === "submit" && state.pendingRequestDraft) {
    const newRequest = {
      ...state.pendingRequestDraft,
      status: "SUBMITTED",
      assignedTo: "HOD",
      signatures: { ...state.pendingRequestDraft.signatures, employeeSign: signature },
      comments: { employee: comment },
      timestamps: {
        ...state.pendingRequestDraft.timestamps,
        submitted: signature.timestamp,
        lastUpdated: signature.timestamp
      }
    };
    requests = [newRequest, ...requests];
    els.requestForm.reset();
    state.activePage = "data";
    showToast(`${newRequest.id} submitted and signed by ${signature.name}.`);
  } else {
    const request = requests.find((item) => item.id === pending.id);
    if (!request) return;
    updateRequest(pending.id, workflowPatch(pending.action, request, signature, comment));
    showToast(`${request.id} ${workflowToastVerb(pending.action)} by ${signature.name}.`);
  }

  els.workflowModal.close();
  state.pendingAction = null;
  state.pendingRequestDraft = null;
  render();
}

function workflowPatch(action, request, signature, comment) {
  if (action === "submit") {
    return {
      status: "SUBMITTED",
      assignedTo: "HOD",
      signatures: { employeeSign: signature },
      comments: { employee: comment },
      rejectionReason: "",
      timestamps: { submitted: signature.timestamp }
    };
  }
  if (action === "recommend") {
    return {
      status: "RECOMMENDED",
      assignedTo: "Competent Authority",
      signatures: { hodSign: signature },
      comments: { hod: comment },
      rejectionReason: ""
    };
  }
  if (action === "return") {
    return {
      status: "DRAFT",
      assignedTo: "Employee",
      signatures: { hodSign: signature },
      comments: { hod: comment },
      rejectionReason: ""
    };
  }
  if (action === "approve") {
    return {
      status: "APPROVED",
      assignedTo: "Network Admin",
      signatures: { caSign: signature },
      comments: { ca: comment },
      rejectionReason: ""
    };
  }
  if (action === "reject") {
    const finalReject = request.status === "RECOMMENDED" || state.role === "Competent Authority";
    return {
      status: finalReject ? "REJECTED_FINAL" : "REJECTED_L1",
      assignedTo: "Employee",
      signatures: finalReject ? { caSign: signature } : { hodSign: signature },
      comments: finalReject ? { ca: comment } : { hod: comment },
      rejectionReason: comment
    };
  }
  if (action === "implement") {
    return {
      status: "IMPLEMENTED",
      assignedTo: "Network Admin",
      signatures: { naSign: { ...signature, note: comment } },
      comments: { na: comment },
      rejectionReason: ""
    };
  }
  return {};
}

function workflowToastVerb(action) {
  return {
    submit: "submitted",
    recommend: "recommended",
    return: "returned",
    approve: "approved",
    reject: "rejected",
    implement: "implemented"
  }[action];
}

function buildSignature(comment) {
  const image = state.signatureMode === "draw" ? els.signaturePad.toDataURL("image/png") : "";
  return {
    name: getUser().name,
    timestamp: nowStamp(),
    comment,
    mode: state.signatureMode,
    image
  };
}

function getDirectEditLink(id) {
  const currentUrl = window.location.href.split("#")[0];
  const baseUrl = window.location.origin === "null"
    ? currentUrl
    : `${window.location.origin}${window.location.pathname}`;
  return `${baseUrl}#request-${id}`;
}

function exportCsv(rows = getFilteredRequests(), filename = "nalco-esma-requests.csv") {
  const header = [
    "Request ID",
    "Employee Name",
    "Department",
    "Unit",
    "Media",
    "From Date",
    "To Date",
    "Status",
    "Assigned To",
    "Approval Stage",
    "Last Updated",
    "Rejection Reason"
  ];
  const csv = [
    header,
    ...rows.map((request) => [
      request.id,
      request.employee.name,
      request.department,
      request.unit,
      request.media,
      request.fromDate,
      request.toDate,
      statusLabel(request.status),
      request.assignedTo,
      approvalStage(request),
      request.timestamps.lastUpdated,
      request.rejectionReason
    ].map(csvValue))
  ].map((row) => row.join(",")).join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function csvValue(value) {
  return `"${String(value || "").replaceAll('"', '""')}"`;
}

function createDraftFromForm(form) {
  const data = new FormData(form);
  const nextNumber = String(Math.max(...requests.map((request) => Number(request.id.split("-").pop()))) + 1).padStart(4, "0");
  const employeeName = data.get("employeeName").trim();
  return createRequest({
    id: `ESMA-2026-${nextNumber}`,
    employeeName,
    personalNo: data.get("personalNo").trim(),
    designation: data.get("designation").trim(),
    department: data.get("department").trim(),
    unit: data.get("unit"),
    media: data.get("mediaType"),
    fromDate: data.get("fromDate"),
    toDate: data.get("toDate"),
    status: "DRAFT",
    assignedTo: "Employee",
    priority: "medium",
    justification: data.get("justification").trim(),
    lastUpdated: nowStamp()
  });
}

function addMockRequest() {
  state.activePage = "request";
  render();
  showToast("Request form is ready for a new digitally signed submission.");
}

function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  els.toastRegion.appendChild(toast);
  setTimeout(() => toast.remove(), 3600);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function initSignaturePad() {
  const canvas = els.signaturePad;
  const ctx = canvas.getContext("2d");
  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  ctx.strokeStyle = "#063865";

  const pointer = (event) => {
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * canvas.width,
      y: ((event.clientY - rect.top) / rect.height) * canvas.height
    };
  };

  canvas.addEventListener("pointerdown", (event) => {
    state.isDrawing = true;
    state.signatureMode = "draw";
    const point = pointer(event);
    ctx.beginPath();
    ctx.moveTo(point.x, point.y);
    updateSignaturePreview();
  });

  canvas.addEventListener("pointermove", (event) => {
    if (!state.isDrawing) return;
    const point = pointer(event);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
  });

  window.addEventListener("pointerup", () => {
    state.isDrawing = false;
  });
}

function clearSignaturePad() {
  const canvas = els.signaturePad;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function updateSignaturePreview() {
  const user = getUser();
  els.signaturePreview.innerHTML = `
    <strong>${escapeHtml(user.name)}</strong>
    <p>${escapeHtml(user.title)}</p>
    <p>${state.signatureMode === "draw" ? "Drawn signature will be stored with timestamp." : "Auto signature will store name and timestamp."}</p>
    <span class="signature-status signed">Ready to Sign</span>
  `;
}

function wireEvents() {
  window.addEventListener("hashchange", syncPageFromHash);

  els.roleSelect.addEventListener("change", (event) => {
    state.role = event.target.value;
    updateSignaturePreview();
    render();
    showToast(`Role switched to ${state.role}.`);
  });

  els.searchInput.addEventListener("input", (event) => {
    state.search = event.target.value;
    state.page = 1;
    render();
  });

  els.statusFilter.addEventListener("change", (event) => {
    state.filter = event.target.value;
    state.activeTab = "all";
    state.page = 1;
    render();
  });

  els.sortSelect.addEventListener("change", (event) => {
    state.sort = event.target.value;
    state.page = 1;
    render();
  });

  els.workflowTabs.addEventListener("click", (event) => {
    const tab = event.target.closest("[data-tab]");
    if (!tab) return;
    state.activeTab = tab.dataset.tab;
    state.filter = "all";
    els.statusFilter.value = "all";
    state.page = 1;
    render();
  });

  document.addEventListener("click", (event) => {
    const action = event.target.closest("[data-action]");
    if (action) handleAction(action.dataset.action, action.dataset.id);

    const closeButton = event.target.closest("[data-close]");
    if (closeButton) document.getElementById(closeButton.dataset.close).close();
  });

  els.tableBody.addEventListener("change", (event) => {
    const select = event.target.closest('[data-action="assign"]');
    if (!select) return;
    updateRequest(select.dataset.id, { assignedTo: select.value });
    showToast(`${select.dataset.id} assigned to ${select.value}.`);
  });

  els.prevPageBtn.addEventListener("click", () => {
    state.page -= 1;
    render();
  });

  els.nextPageBtn.addEventListener("click", () => {
    state.page += 1;
    render();
  });

  els.tableViewBtn.addEventListener("click", () => {
    state.view = "table";
    render();
  });

  els.boardViewBtn.addEventListener("click", () => {
    state.view = "board";
    render();
  });

  els.requestForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (state.role !== "Employee" && state.role !== "IT Admin") {
      showToast("Only Employee or IT Admin can submit a new request.");
      return;
    }
    const draft = createDraftFromForm(els.requestForm);
    state.pendingRequestDraft = draft;
    openWorkflow("submit", "", draft);
  });

  els.workflowForm.addEventListener("submit", (event) => {
    event.preventDefault();
    applyWorkflowAction();
  });

  els.clearSignatureBtn.addEventListener("click", () => {
    state.signatureMode = "auto";
    clearSignaturePad();
    updateSignaturePreview();
  });

  els.autoSignatureBtn.addEventListener("click", () => {
    state.signatureMode = "auto";
    clearSignaturePad();
    updateSignaturePreview();
  });

  els.boardPanel.addEventListener("dragstart", (event) => {
    const card = event.target.closest(".kanban-card");
    if (!card) return;
    event.dataTransfer.setData("text/plain", card.dataset.id);
  });

  els.boardPanel.addEventListener("dragover", (event) => {
    if (event.target.closest(".kanban-column")) event.preventDefault();
  });

  els.boardPanel.addEventListener("drop", (event) => {
    const column = event.target.closest(".kanban-column");
    if (!column || state.role !== "IT Admin") {
      showToast("Only IT Admin can manage workflow status by board drag.");
      return;
    }
    event.preventDefault();
    const id = event.dataTransfer.getData("text/plain");
    const status = column.dataset.column === "REJECTED" ? "REJECTED_FINAL" : column.dataset.column;
    updateRequest(id, { status, assignedTo: statusToAssignee(status) });
    showToast(`${id} moved to ${statusLabel(status)}.`);
  });

  document.getElementById("exportBtn").addEventListener("click", () => exportCsv());
  document.getElementById("reportExportBtn").addEventListener("click", () => exportCsv(requests, "nalco-esma-workflow-report.csv"));
  document.getElementById("newRequestBtn").addEventListener("click", addMockRequest);
}

function handleAction(action, id) {
  if (action === "view") openDetail(id);
  if (action === "mail") openEmailPreview(id);
  if (["submit", "recommend", "return", "approve", "reject", "implement"].includes(action)) {
    const request = requests.find((item) => item.id === id);
    if (!request || !canRun(action, request)) {
      showToast(`${state.role} cannot perform this action at the current stage.`);
      return;
    }
    openWorkflow(action, id);
  }
}

function statusToAssignee(status) {
  return {
    DRAFT: "Employee",
    SUBMITTED: "HOD",
    RECOMMENDED: "Competent Authority",
    APPROVED: "Network Admin",
    IMPLEMENTED: "Network Admin",
    REJECTED_L1: "Employee",
    REJECTED_FINAL: "Employee"
  }[status] || "IT Admin";
}

function syncPageFromHash() {
  const page = window.location.hash.replace("#", "") || "dashboard";
  if (pageTitles[page]) state.activePage = page;
  render();
}

initSignaturePad();
wireEvents();
syncPageFromHash();
