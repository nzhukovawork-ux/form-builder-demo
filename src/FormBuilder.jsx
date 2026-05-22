import React, { useState, useRef } from "react";

/* ============================================================================
   FormBuilder — B2B SaaS form builder concept
   ----------------------------------------------------------------------------
   • Three-panel layout: Field Library · Form Canvas · Field Settings
   • Real drag & drop using the native HTML5 Drag and Drop API (no libraries)
       - Drag a field from the left library onto the canvas to add it
       - Drag an existing field within the form to reorder it
       - Drop zones highlight blue while dragging over
       - Dragged item shows 50% opacity; dropped field flashes light blue
   • React + Tailwind. Single-file, default export, no required props.
   ========================================================================== */

/* ----------------------------- Icons (inline SVG) ------------------------- */

const Svg = ({ children, className = "w-4 h-4" }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
);

/* Six-dot grip used as the drag handle */
const GripIcon = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    {[7, 12, 17].map((cy) =>
      [9, 15].map((cx) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="1.6" />)
    )}
  </svg>
);

const TrashIcon = (p) => (
  <Svg {...p}>
    <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h12l1-13M9 7V4h6v3" />
  </Svg>
);
const PencilIcon = (p) => (
  <Svg {...p}>
    <path d="M4 20h4L18.5 9.5a2 2 0 0 0-2.8-2.8L5 16v4z" />
    <path d="M13.5 6.2l4.3 4.3" />
  </Svg>
);
const CloseIcon = (p) => (
  <Svg {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </Svg>
);
const PlusIcon = (p) => (
  <Svg {...p}>
    <path d="M12 5v14M5 12h14" />
  </Svg>
);
const CheckIcon = (p) => (
  <Svg {...p}>
    <path d="M5 13l4 4L19 7" />
  </Svg>
);
const ChevronDownIcon = (p) => (
  <Svg {...p}>
    <path d="M6 9l6 6 6-6" />
  </Svg>
);
const CalendarIcon = (p) => (
  <Svg {...p}>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M3 10h18M8 3v4M16 3v4" />
  </Svg>
);
const UploadIcon = (p) => (
  <Svg {...p}>
    <path d="M12 16V4M7 9l5-5 5 5M5 20h14" />
  </Svg>
);
const SettingsIcon = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="3" />
    <path d="M12 2.5v3M12 18.5v3M4.4 4.4l2.1 2.1M17.5 17.5l2.1 2.1M2.5 12h3M18.5 12h3M4.4 19.6l2.1-2.1M17.5 6.5l2.1-2.1" />
  </Svg>
);
const SlidersIcon = (p) => (
  <Svg {...p}>
    <path d="M4 7h8M16 7h4M4 17h4M12 17h8M4 12h12M20 12h0" />
    <circle cx="15" cy="7" r="2.3" />
    <circle cx="9" cy="12" r="2.3" />
    <circle cx="9" cy="17" r="2.3" />
  </Svg>
);

/* Small type glyph shown on each library item */
const TypeIcon = ({ kind, className = "w-4 h-4" }) => {
  switch (kind) {
    case "textarea":
      return (
        <Svg className={className}>
          <path d="M4 7h16M4 12h16M4 17h9" />
        </Svg>
      );
    case "checkbox":
      return (
        <Svg className={className}>
          <rect x="4" y="4" width="16" height="16" rx="3.5" />
          <path d="M8.5 12l2.5 2.5L16 9" />
        </Svg>
      );
    case "multiselect":
      return (
        <Svg className={className}>
          <path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01" />
        </Svg>
      );
    case "select":
      return (
        <Svg className={className}>
          <rect x="3" y="5.5" width="18" height="13" rx="2.5" />
          <path d="M9 11l3 3 3-3" />
        </Svg>
      );
    case "date":
      return <CalendarIcon className={className} />;
    case "number":
      return (
        <Svg className={className}>
          <path d="M5 9h14M5 15h14M10.5 4L8 20M16 4l-2.5 16" />
        </Svg>
      );
    case "url":
      return (
        <Svg className={className}>
          <path d="M9.5 14.5l5-5M10 7l1.2-1.2a3.5 3.5 0 0 1 5 5L15 12M14 17l-1.2 1.2a3.5 3.5 0 0 1-5-5L9 12" />
        </Svg>
      );
    case "file":
      return (
        <Svg className={className}>
          <path d="M14 3v5h5M14 3H6v18h12V8z" />
          <path d="M12 17.5v-5M9.8 14.2L12 12l2.2 2.2" />
        </Svg>
      );
    case "email":
      return (
        <Svg className={className}>
          <rect x="3" y="5.5" width="18" height="13" rx="2.5" />
          <path d="M4 8l8 5 8-5" />
        </Svg>
      );
    case "tel":
      return (
        <Svg className={className}>
          <path d="M6.5 3.5h3.5l1.7 4.3-2.4 1.6a12 12 0 0 0 5.3 5.3l1.6-2.4 4.3 1.7v3.5a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.5 5.7a2 2 0 0 1 2-2.2z" />
        </Svg>
      );
    default: /* text */
      return (
        <Svg className={className}>
          <path d="M5 7V5h14v2M12 5v14M9.5 19h5" />
        </Svg>
      );
  }
};

/* ------------------------------- Data ------------------------------------- */

/* Visitor = blue badge, Account = purple badge */
const DEFAULT_PROPERTIES = [
  { id: "dp-email", name: "Email", category: "Visitor", typeName: "Email", inputKind: "email" },
  { id: "dp-first", name: "First Name", category: "Visitor", typeName: "Text", inputKind: "text" },
  { id: "dp-last", name: "Last Name", category: "Visitor", typeName: "Text", inputKind: "text" },
  { id: "dp-full", name: "Full Name", category: "Visitor", typeName: "Text", inputKind: "text" },
  { id: "dp-phone", name: "Phone", category: "Visitor", typeName: "Phone", inputKind: "tel" },
  { id: "dp-job", name: "Job Title", category: "Visitor", typeName: "Text", inputKind: "text" },
  { id: "dp-company", name: "Company Name", category: "Account", typeName: "Text", inputKind: "text" },
  { id: "dp-industry", name: "Industry", category: "Account", typeName: "Select", inputKind: "select" },
  { id: "dp-size", name: "Size", category: "Account", typeName: "Select", inputKind: "select" },
];

const NEW_PROPERTY_TYPES = [
  { id: "np-text", name: "Text", typeName: "Text", inputKind: "text" },
  { id: "np-textarea", name: "Text Area", typeName: "Text Area", inputKind: "textarea" },
  { id: "np-checkbox", name: "Checkbox", typeName: "Checkbox", inputKind: "checkbox" },
  { id: "np-multiselect", name: "Multiselect", typeName: "Multiselect", inputKind: "multiselect" },
  { id: "np-select", name: "Select", typeName: "Select", inputKind: "select" },
  { id: "np-date", name: "Date", typeName: "Date", inputKind: "date" },
  { id: "np-number", name: "Number", typeName: "Number", inputKind: "number" },
  { id: "np-url", name: "URL", typeName: "URL", inputKind: "url" },
  { id: "np-file", name: "File Upload", typeName: "File Upload", inputKind: "file" },
];

const OPTIONS_BY_NAME = {
  Industry: ["Healthcare", "Technology", "Finance", "Education", "Other"],
  Size: ["1–10", "11–50", "51–200", "201–500", "500+"],
};

/* Four fields are pre-added to the canvas */
const INITIAL_FIELDS = [
  { id: "f-1", typeName: "Text", inputKind: "text", label: "First Name", placeholder: "Jane", description: "", required: true },
  { id: "f-2", typeName: "Text", inputKind: "text", label: "Last Name", placeholder: "Doe", description: "", required: true },
  { id: "f-3", typeName: "Date", inputKind: "date", label: "Date of Birth", placeholder: "", description: "", required: false },
  {
    id: "f-4",
    typeName: "Select",
    inputKind: "select",
    label: "Insurance Provider",
    placeholder: "Select a provider",
    description: "",
    required: false,
    options: ["Aetna", "Blue Cross Blue Shield", "Cigna", "UnitedHealthcare", "Other"],
  },
];

/* Placeholder hints shown when a field has no custom placeholder */
const HINTS = {
  text: "Short answer text",
  email: "name@example.com",
  tel: "(555) 000-0000",
  number: "0",
  url: "https://example.com",
  date: "mm / dd / yyyy",
  textarea: "Long answer text",
  select: "Select an option",
  multiselect: "Select options",
  checkbox: "Checkbox label",
  file: "Upload a file",
};

/* ---------------------------- Small components ---------------------------- */

const Badge = ({ category }) => {
  const visitor = category === "Visitor";
  return (
    <span
      className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold leading-none ${
        visitor ? "bg-[#DBEAFE] text-[#1D4ED8]" : "bg-[#EDE9FE] text-[#6D28D9]"
      }`}
    >
      {category}
    </span>
  );
};

const TabButton = ({ active, children, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`-mb-px border-b-2 pb-2.5 text-sm font-semibold transition-colors duration-150 motion-reduce:transition-none focus:outline-none focus-visible:text-[#0066CC] ${
      active
        ? "border-[#0066CC] text-[#0066CC]"
        : "border-transparent text-slate-500 hover:text-slate-800"
    }`}
  >
    {children}
  </button>
);

const Toggle = ({ checked, onChange, label }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label}
    onClick={onChange}
    className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-150 motion-reduce:transition-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0066CC] focus-visible:ring-offset-2 ${
      checked ? "bg-[#0066CC]" : "bg-slate-300"
    }`}
  >
    <span
      className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-150 motion-reduce:transition-none ${
        checked ? "translate-x-5" : "translate-x-0"
      }`}
    />
  </button>
);

const Insertion = ({ show }) =>
  show ? <div className="mb-2 h-[3px] rounded-full bg-[#0066CC]" /> : null;

/* Non-interactive input preview shown inside a field card (Build tab) */
const FieldPreview = ({ field }) => {
  const ph = field.placeholder || HINTS[field.inputKind] || "";
  const box =
    "w-full select-none rounded-md border border-[#E2E8F0] bg-white px-3 py-2 text-sm text-slate-400";
  switch (field.inputKind) {
    case "textarea":
      return <div className={`${box} h-16`}>{ph}</div>;
    case "checkbox":
      return (
        <span className="flex select-none items-center gap-2">
          <span className="h-[18px] w-[18px] rounded border border-[#CBD5E1] bg-white" />
          <span className="text-sm text-slate-500">{field.placeholder || "Checkbox label"}</span>
        </span>
      );
    case "select":
    case "multiselect":
      return (
        <div className={`${box} flex items-center justify-between`}>
          <span>{ph}</span>
          <ChevronDownIcon className="w-4 h-4 shrink-0 text-slate-400" />
        </div>
      );
    case "date":
      return (
        <div className={`${box} flex items-center justify-between`}>
          <span>{ph}</span>
          <CalendarIcon className="w-4 h-4 shrink-0 text-slate-400" />
        </div>
      );
    case "file":
      return (
        <div className="flex w-full select-none items-center gap-2 rounded-md border border-dashed border-[#CBD5E1] bg-[#F8FAFC] px-3 py-2.5 text-sm text-slate-400">
          <UploadIcon className="w-4 h-4 shrink-0" />
          <span>{field.placeholder || "Click to upload or drag a file"}</span>
        </div>
      );
    default:
      return <div className={box}>{ph}</div>;
  }
};

/* Real, interactive input rendered in the Preview tab */
const LiveField = ({ field }) => {
  const ph = field.placeholder || HINTS[field.inputKind] || "";
  const inp =
    "w-full rounded-md border border-[#CBD5E1] bg-white px-3 py-2 text-sm text-slate-800 outline-none transition-colors duration-150 motion-reduce:transition-none focus:border-[#0066CC] focus:ring-2 focus:ring-[#0066CC]/25";
  switch (field.inputKind) {
    case "textarea":
      return <textarea rows={3} placeholder={ph} className={`${inp} resize-y`} />;
    case "checkbox":
      return (
        <label className="flex cursor-pointer items-center gap-2">
          <input type="checkbox" className="h-[18px] w-[18px] accent-[#0066CC]" />
          <span className="text-sm text-slate-700">{field.placeholder || "Yes, I agree"}</span>
        </label>
      );
    case "select":
      return (
        <select className={`${inp} cursor-pointer`} defaultValue="">
          <option value="" disabled>
            {ph}
          </option>
          {(field.options || ["Option 1", "Option 2", "Option 3"]).map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      );
    case "multiselect":
      return (
        <select multiple className={`${inp} h-24 cursor-pointer`}>
          {(field.options || ["Option 1", "Option 2", "Option 3"]).map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      );
    case "date":
      return <input type="date" className={`${inp} cursor-pointer`} />;
    case "file":
      return (
        <input
          type="file"
          className="block w-full text-sm text-slate-500 file:mr-3 file:rounded-md file:border-0 file:bg-[#EFF6FF] file:px-3 file:py-2 file:text-sm file:font-medium file:text-[#0066CC] hover:file:bg-[#DBEAFE]"
        />
      );
    case "number":
      return <input type="number" placeholder={ph} className={inp} />;
    case "email":
      return <input type="email" placeholder={ph} className={inp} />;
    case "tel":
      return <input type="tel" placeholder={ph} className={inp} />;
    case "url":
      return <input type="url" placeholder={ph} className={inp} />;
    default:
      return <input type="text" placeholder={ph} className={inp} />;
  }
};

/* ------------------------------ Main component ---------------------------- */

export default function FormBuilder() {
  const [formFields, setFormFields] = useState(INITIAL_FIELDS);
  const [selectedId, setSelectedId] = useState(null);
  const [activeTab, setActiveTab] = useState("build");
  const [formTitle, setFormTitle] = useState("Patient Intake Form");
  const [formSubtitle, setFormSubtitle] = useState(
    "Complete this form before your appointment"
  );

  /* Drag state */
  const [draggingId, setDraggingId] = useState(null); // library item id or field id
  const [dragOverIndex, setDragOverIndex] = useState(null); // insertion index in the form
  const [dropZoneActive, setDropZoneActive] = useState(false); // bottom drop zone highlight
  const [recentlyDroppedId, setRecentlyDroppedId] = useState(null); // brief flash

  const dragData = useRef(null); // { source: 'library'|'canvas', ... }
  const zoneCounter = useRef(0); // dragenter/leave counter for the drop zone
  const idCounter = useRef(100);
  const titleRef = useRef(null);

  const selectedField = formFields.find((f) => f.id === selectedId) || null;

  /* --- field helpers --- */
  function makeField(item) {
    idCounter.current += 1;
    const field = {
      id: `f-${idCounter.current}`,
      typeName: item.typeName,
      inputKind: item.inputKind,
      label: item.name,
      placeholder: "",
      description: "",
      required: false,
    };
    if (item.inputKind === "select" || item.inputKind === "multiselect") {
      field.options = OPTIONS_BY_NAME[item.name] || ["Option 1", "Option 2", "Option 3"];
    }
    return field;
  }

  function flashDropped(id) {
    setRecentlyDroppedId(id);
    window.setTimeout(
      () => setRecentlyDroppedId((cur) => (cur === id ? null : cur)),
      700
    );
  }

  function deleteField(id) {
    setFormFields((prev) => prev.filter((f) => f.id !== id));
    setSelectedId((cur) => (cur === id ? null : cur));
  }

  function updateField(id, patch) {
    setFormFields((prev) => prev.map((f) => (f.id === id ? { ...f, ...patch } : f)));
  }

  /* --- drag start --- */
  function handleLibraryDragStart(e, item) {
    dragData.current = { source: "library", item };
    e.dataTransfer.effectAllowed = "copy";
    e.dataTransfer.setData("text/plain", item.id); // required for Firefox
    setDraggingId(item.id);
  }

  function handleFieldDragStart(e, field) {
    dragData.current = { source: "canvas", field };
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", field.id);
    setDraggingId(field.id);
  }

  function handleDragEnd() {
    setDraggingId(null);
    setDragOverIndex(null);
    setDropZoneActive(false);
    zoneCounter.current = 0;
    dragData.current = null;
  }

  /* --- drop logic --- */
  function performDrop(targetIndex) {
    const data = dragData.current;
    if (!data) return;

    if (data.source === "library") {
      const field = makeField(data.item);
      setFormFields((prev) => {
        const arr = [...prev];
        const idx = targetIndex == null ? arr.length : targetIndex;
        arr.splice(Math.max(0, Math.min(idx, arr.length)), 0, field);
        return arr;
      });
      setSelectedId(field.id);
      flashDropped(field.id);
    } else {
      setFormFields((prev) => {
        const from = prev.findIndex((f) => f.id === data.field.id);
        if (from === -1) return prev;
        const arr = [...prev];
        const [moved] = arr.splice(from, 1);
        let to = targetIndex == null ? arr.length : targetIndex;
        if (from < to) to -= 1;
        arr.splice(Math.max(0, Math.min(to, arr.length)), 0, moved);
        return arr;
      });
      flashDropped(data.field.id);
    }
    handleDragEnd();
  }

  /* --- field card as a drop target (reorder / insert before-or-after) --- */
  function handleFieldDragOver(e, index) {
    if (!dragData.current) return;
    e.preventDefault();
    e.dataTransfer.dropEffect =
      dragData.current.source === "library" ? "copy" : "move";
    const rect = e.currentTarget.getBoundingClientRect();
    const after = e.clientY - rect.top > rect.height / 2;
    setDragOverIndex(after ? index + 1 : index);
    setDropZoneActive(false);
  }

  function handleFieldDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    performDrop(dragOverIndex);
  }

  /* --- bottom drop zone --- */
  function handleZoneDragEnter(e) {
    if (!dragData.current) return;
    e.preventDefault();
    zoneCounter.current += 1;
    setDropZoneActive(true);
    setDragOverIndex(null);
  }
  function handleZoneDragOver(e) {
    if (!dragData.current) return;
    e.preventDefault();
    e.dataTransfer.dropEffect =
      dragData.current.source === "library" ? "copy" : "move";
    setDropZoneActive(true);
    setDragOverIndex(null);
  }
  function handleZoneDragLeave() {
    zoneCounter.current -= 1;
    if (zoneCounter.current <= 0) {
      zoneCounter.current = 0;
      setDropZoneActive(false);
    }
  }
  function handleZoneDrop(e) {
    e.preventDefault();
    zoneCounter.current = 0;
    performDrop(null); // append to the end
  }

  function startEditingTitle() {
    setActiveTab("build");
    window.setTimeout(() => {
      titleRef.current?.focus();
      titleRef.current?.select();
    }, 0);
  }

  /* shared input styles for the settings panel */
  const sInput =
    "w-full rounded-md border border-[#CBD5E1] bg-white px-3 py-2 text-sm text-slate-800 outline-none transition-colors duration-150 motion-reduce:transition-none focus:border-[#0066CC] focus:ring-2 focus:ring-[#0066CC]/25";
  const sLabel = "mb-1.5 block text-xs font-semibold text-slate-500";

  /* ------------------------------- Render --------------------------------- */
  return (
    <div
      className="flex h-screen w-full overflow-hidden bg-white text-slate-900"
      style={{
        fontFamily:
          "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* ============================ LEFT PANEL ============================ */}
      <aside className="flex w-[280px] shrink-0 flex-col border-r border-[#E2E8F0] bg-[#F8FAFC]">
        <div className="border-b border-[#E2E8F0] px-5 py-4">
          <h2 className="text-sm font-bold text-slate-800">Field Library</h2>
          <p className="mt-0.5 text-xs text-slate-400">Drag a field onto the form</p>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          {[
            { title: "DEFAULT PROPERTIES", items: DEFAULT_PROPERTIES },
            { title: "NEW PROPERTY", items: NEW_PROPERTY_TYPES },
          ].map((section, sIdx) => (
            <div key={section.title} className={sIdx === 1 ? "mt-6" : ""}>
              <div className="mb-2 px-1 text-[11px] font-bold tracking-wider text-slate-400">
                {section.title}
              </div>
              <div className="space-y-1.5">
                {section.items.map((item) => (
                  <div
                    key={item.id}
                    draggable
                    onDragStart={(e) => handleLibraryDragStart(e, item)}
                    onDragEnd={handleDragEnd}
                    title="Drag to add to the form"
                    className={`group flex cursor-grab items-center gap-2 rounded-lg border border-[#E2E8F0] bg-white px-2.5 py-2 transition-all duration-150 motion-reduce:transition-none hover:border-[#0066CC] hover:shadow-sm active:cursor-grabbing ${
                      draggingId === item.id ? "opacity-50" : ""
                    }`}
                  >
                    <GripIcon className="w-[18px] h-[18px] shrink-0 text-slate-300 group-hover:text-slate-400" />
                    <TypeIcon
                      kind={item.inputKind}
                      className="w-4 h-4 shrink-0 text-slate-400"
                    />
                    <span className="flex-1 truncate text-sm text-slate-700">
                      {item.name}
                    </span>
                    {item.category && <Badge category={item.category} />}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* =========================== MIDDLE PANEL =========================== */}
      <main className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="shrink-0 border-b border-[#E2E8F0] bg-white">
          <div className="flex items-center justify-between gap-4 px-6 pt-3.5">
            {/* Breadcrumb */}
            <div className="flex min-w-0 items-center gap-1.5 text-sm">
              <span className="text-slate-400">Forms</span>
              <span className="text-slate-300">/</span>
              <span className="truncate font-semibold text-slate-800">
                {formTitle}
              </span>
              <button
                type="button"
                onClick={startEditingTitle}
                aria-label="Edit form name"
                className="rounded p-1 text-slate-400 transition-colors duration-150 hover:bg-slate-100 hover:text-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0066CC]"
              >
                <PencilIcon className="w-4 h-4" />
              </button>
            </div>
            {/* Actions */}
            <div className="flex shrink-0 items-center gap-3">
              <button
                type="button"
                className="flex items-center gap-1.5 rounded-lg border border-[#E2E8F0] px-3 py-2 text-sm font-medium text-slate-600 transition-colors duration-150 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0066CC]"
              >
                <SettingsIcon className="w-4 h-4" />
                Settings
              </button>
              <span className="flex items-center gap-1 text-xs font-medium text-slate-400">
                Draft saved
                <CheckIcon className="w-3.5 h-3.5 text-emerald-500" />
              </span>
              <button
                type="button"
                className="rounded-lg bg-[#0066CC] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors duration-150 hover:bg-[#0055AB] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0066CC] focus-visible:ring-offset-2"
              >
                Publish
              </button>
            </div>
          </div>
          {/* Tabs */}
          <div className="flex items-center gap-5 px-6 pt-3">
            <TabButton active={activeTab === "build"} onClick={() => setActiveTab("build")}>
              Build
            </TabButton>
            <TabButton
              active={activeTab === "preview"}
              onClick={() => setActiveTab("preview")}
            >
              Preview
            </TabButton>
          </div>
        </header>

        {/* Canvas */}
        <div className="flex-1 overflow-y-auto bg-white">
          <div className="mx-auto w-full max-w-[600px] px-6 py-8">
            {activeTab === "build" ? (
              /* ----------------------- BUILD VIEW ----------------------- */
              <div className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-[0_4px_24px_-6px_rgba(15,23,42,0.14)]">
                <div className="h-1.5 bg-[#0066CC]" />
                <div className="px-7 py-6">
                  <input
                    ref={titleRef}
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    aria-label="Form title"
                    className="w-full rounded-md border border-transparent px-2 py-1 text-[22px] font-bold text-slate-900 outline-none transition-colors duration-150 motion-reduce:transition-none hover:border-[#E2E8F0] focus:border-[#0066CC]"
                  />
                  <input
                    value={formSubtitle}
                    onChange={(e) => setFormSubtitle(e.target.value)}
                    aria-label="Form description"
                    className="mt-1 w-full rounded-md border border-transparent px-2 py-1 text-sm text-slate-500 outline-none transition-colors duration-150 motion-reduce:transition-none hover:border-[#E2E8F0] focus:border-[#0066CC]"
                  />

                  {/* Fields */}
                  <div className="mt-5">
                    {formFields.map((field, index) => {
                      const selected = selectedId === field.id;
                      const dragging = draggingId === field.id;
                      const dropped = recentlyDroppedId === field.id;
                      return (
                        <div key={field.id}>
                          <Insertion show={dragOverIndex === index} />
                          <div
                            draggable
                            onDragStart={(e) => handleFieldDragStart(e, field)}
                            onDragEnd={handleDragEnd}
                            onDragOver={(e) => handleFieldDragOver(e, index)}
                            onDrop={handleFieldDrop}
                            onClick={() => setSelectedId(field.id)}
                            className={[
                              "group mb-2 flex cursor-pointer items-start gap-2.5 rounded-lg border bg-white px-3 py-3 transition-all duration-150 motion-reduce:transition-none",
                              selected
                                ? "border-[#BFD7F2] border-l-[3px] border-l-[#0066CC] bg-[#EFF6FF]"
                                : "border-[#E2E8F0] border-l-[3px] border-l-transparent hover:border-l-[#0066CC] hover:shadow-sm",
                              dropped ? "!border-[#93C5FD] !bg-[#DBEAFE]" : "",
                              dragging ? "opacity-50" : "",
                            ].join(" ")}
                          >
                            <span
                              className="mt-0.5 shrink-0 cursor-grab text-slate-300 group-hover:text-slate-400 active:cursor-grabbing"
                              title="Drag to reorder"
                              aria-hidden="true"
                            >
                              <GripIcon className="w-[18px] h-[18px]" />
                            </span>
                            <div className="min-w-0 flex-1">
                              <div className="mb-1.5 flex items-center gap-0.5 text-sm font-medium text-slate-700">
                                <span className="truncate">
                                  {field.label || "Untitled field"}
                                </span>
                                {field.required && (
                                  <span className="text-red-500">*</span>
                                )}
                              </div>
                              <FieldPreview field={field} />
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteField(field.id);
                              }}
                              aria-label={`Delete ${field.label} field`}
                              className="mt-0.5 shrink-0 rounded p-1 text-slate-300 transition-colors duration-150 hover:bg-red-50 hover:text-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0066CC]"
                            >
                              <TrashIcon className="w-[18px] h-[18px]" />
                            </button>
                          </div>
                        </div>
                      );
                    })}

                    <Insertion show={dragOverIndex === formFields.length} />

                    {/* Drop zone */}
                    <div
                      onDragEnter={handleZoneDragEnter}
                      onDragOver={handleZoneDragOver}
                      onDragLeave={handleZoneDragLeave}
                      onDrop={handleZoneDrop}
                      className={`rounded-lg border-2 border-dashed px-4 py-7 text-center transition-colors duration-150 motion-reduce:transition-none ${
                        dropZoneActive
                          ? "border-[#0066CC] bg-[#EFF6FF]"
                          : "border-[#CBD5E1] bg-[#F8FAFC]"
                      }`}
                    >
                      <span
                        className={`inline-flex items-center gap-1.5 text-sm font-medium ${
                          dropZoneActive ? "text-[#0066CC]" : "text-slate-400"
                        }`}
                      >
                        <PlusIcon className="w-4 h-4" />
                        {dropZoneActive ? "Release to add field" : "Drop fields here"}
                      </span>
                    </div>
                  </div>

                  {/* Submit */}
                  <div className="mt-6 border-t border-[#E2E8F0] pt-5">
                    <button
                      type="button"
                      className="rounded-lg bg-[#0066CC] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors duration-150 hover:bg-[#0055AB] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0066CC] focus-visible:ring-offset-2"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* ---------------------- PREVIEW VIEW ----------------------- */
              <div className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-[0_4px_24px_-6px_rgba(15,23,42,0.14)]">
                <div className="h-1.5 bg-[#0066CC]" />
                <div className="px-7 py-6">
                  <h2 className="text-[22px] font-bold text-slate-900">{formTitle}</h2>
                  <p className="mt-1 text-sm text-slate-500">{formSubtitle}</p>
                  <form className="mt-5 space-y-4" onSubmit={(e) => e.preventDefault()}>
                    {formFields.length === 0 && (
                      <p className="text-sm text-slate-400">
                        No fields yet — switch to Build to add some.
                      </p>
                    )}
                    {formFields.map((field) => (
                      <div key={field.id}>
                        {field.inputKind !== "checkbox" && (
                          <label className="mb-1.5 block text-sm font-medium text-slate-700">
                            {field.label}
                            {field.required && <span className="text-red-500"> *</span>}
                          </label>
                        )}
                        <LiveField field={field} />
                        {field.description && (
                          <p className="mt-1 text-xs text-slate-400">
                            {field.description}
                          </p>
                        )}
                      </div>
                    ))}
                    <button
                      type="submit"
                      className="rounded-lg bg-[#0066CC] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors duration-150 hover:bg-[#0055AB] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0066CC] focus-visible:ring-offset-2"
                    >
                      Submit
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* =========================== RIGHT PANEL ============================ */}
      <aside className="flex w-[300px] shrink-0 flex-col border-l border-[#E2E8F0] bg-white">
        {selectedField ? (
          <>
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#E2E8F0] px-4 py-3.5">
              <h3 className="text-sm font-bold text-slate-800">
                {selectedField.typeName} field
              </h3>
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                aria-label="Close field settings"
                className="rounded p-1 text-slate-400 transition-colors duration-150 hover:bg-slate-100 hover:text-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0066CC]"
              >
                <CloseIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Settings body */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
              <div className="mb-4">
                <label className={sLabel} htmlFor="fs-label">
                  Label
                </label>
                <input
                  id="fs-label"
                  value={selectedField.label}
                  onChange={(e) => updateField(selectedField.id, { label: e.target.value })}
                  className={sInput}
                />
              </div>

              <div className="mb-4">
                <label className={sLabel} htmlFor="fs-placeholder">
                  Placeholder
                </label>
                <input
                  id="fs-placeholder"
                  value={selectedField.placeholder}
                  onChange={(e) =>
                    updateField(selectedField.id, { placeholder: e.target.value })
                  }
                  placeholder={HINTS[selectedField.inputKind] || ""}
                  className={sInput}
                />
              </div>

              <div className="mb-4">
                <label className={sLabel} htmlFor="fs-description">
                  Description
                </label>
                <textarea
                  id="fs-description"
                  rows={3}
                  value={selectedField.description}
                  onChange={(e) =>
                    updateField(selectedField.id, { description: e.target.value })
                  }
                  placeholder="Optional helper text shown below the field"
                  className={`${sInput} resize-y`}
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2.5">
                <div>
                  <div className="text-sm font-medium text-slate-700">Required</div>
                  <div className="text-xs text-slate-400">
                    Visitor must complete this field
                  </div>
                </div>
                <Toggle
                  label="Required field"
                  checked={selectedField.required}
                  onChange={() =>
                    updateField(selectedField.id, { required: !selectedField.required })
                  }
                />
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-[#E2E8F0] px-4 py-3.5">
              <button
                type="button"
                onClick={() => deleteField(selectedField.id)}
                className="w-full rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 transition-colors duration-150 hover:bg-red-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
              >
                Remove Field
              </button>
            </div>
          </>
        ) : (
          /* Empty state */
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#F1F5F9]">
              <SlidersIcon className="w-5 h-5 text-slate-300" />
            </div>
            <p className="text-sm font-semibold text-slate-500">No field selected</p>
            <p className="mt-1 text-xs text-slate-400">
              Click a field on the form to edit its settings
            </p>
          </div>
        )}
      </aside>
    </div>
  );
}
