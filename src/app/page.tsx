"use client";

import { useEffect, useMemo, useState } from "react";

interface CourtItem {
  category?: string;
  name: string;
  description?: string;
  long_name?: string;
  uf?: string;
  url?: string;
  accepts_qrcode?: boolean | string | number;
  qrcode_required?: boolean | string | number;
  accepts_certificate?: boolean | string | number;
  certificate_required?: boolean | string | number;
}
interface StateData {
  name: string;
  courts?: CourtItem[];
  intimacoes?: CourtItem[];
  administrative?: CourtItem[];
}

function classNames(...cls: Array<string | false | undefined>) {
  return cls.filter(Boolean).join(" ");
}

/* ----------------- Helpers (single definitions) ----------------- */
function toBool(v: any): boolean | undefined {
  if (v === undefined || v === null || v === "") return undefined;
  if (typeof v === "boolean") return v;
  if (typeof v === "number") return v !== 0;
  if (typeof v === "string") {
    const s = v.trim().toLowerCase();
    if (["true", "1", "yes", "sim"].includes(s)) return true;
    if (["false", "0", "no", "nao", "não", "não"].includes(s)) return false;
  }
  return undefined;
}

function normalizeUrl(url?: string): string | undefined {
  if (!url) return undefined;
  const u = url.trim();
  if (!u) return undefined;
  if (/^https?:\/\//i.test(u)) return u;
  return `https://${u}`;
}

function normalizeCourtItem(item: any): CourtItem {
  return {
    ...item,
    url: normalizeUrl(item.url ?? item.link),
    accepts_qrcode: toBool(item.accepts_qrcode),
    qrcode_required: toBool(item.qrcode_required),
    accepts_certificate: toBool(item.accepts_certificate),
    certificate_required: toBool(item.certificate_required),
    long_name: item.long_name ?? item.longName ?? item.nome_long ?? item.nome_longo,
    uf: item.uf ?? item.UF,
  };
}

function normalizeAll(raw: any) {
  const out: Record<string, any> = {};
  for (const [uf, state] of Object.entries<any>(raw)) {
    out[uf] = {
      ...state,
      courts: Array.isArray(state.courts) ? state.courts.map(normalizeCourtItem) : [],
      intimacoes: Array.isArray(state.intimacoes) ? state.intimacoes.map(normalizeCourtItem) : [],
      administrative: Array.isArray(state.administrative) ? state.administrative.map(normalizeCourtItem) : [],
      systems: Array.isArray(state.systems) ? state.systems.map(normalizeCourtItem) : [],   // 👈 novo
    };
  }
  return out;
}


function BoolIcon({ value, title }: { value: any; title: string }) {
  const v = toBool(value);
  if (v === undefined) {
    return (
      <span
        className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-gray-100 text-gray-400 text-[11px]"
        title={`${title}: não informado`}
        aria-label={`${title}: não informado`}
      >
        ?
      </span>
    );
  }
  return v ? (
    <span
      className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-emerald-100 text-emerald-700"
      title={`${title}: sim`}
      aria-label={`${title}: sim`}
    >
      ✓
    </span>
  ) : (
    <span
      className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-gray-100 text-gray-500"
      title={`${title}: não`}
      aria-label={`${title}: não`}
    >
      ✕
    </span>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-gray-100 text-gray-700 text-xs px-2 py-0.5">
      {children}
    </span>
  );
}
/* ---------------------------------------------------------------- */

export default function Page() {
  const [data, setData] = useState<Record<string, StateData>>({});
  const [selectedId, setSelectedId] = useState<string>("BR");

  // separate searches
  const [qStates, setQStates] = useState("");
  const [qContent, setQContent] = useState("");

  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await fetch(`/courts.json?ts=${Date.now()}`, { cache: "no-store" });
      const json = await res.json();
      const normalized = normalizeAll(json);
      setData(normalized);

      if (!normalized[selectedId]) {
        const first = Object.keys(normalized)[0];
        if (first) setSelectedId(first);
      }
    })();
  }, []);

  const statesEntries = useMemo(() => Object.entries(data), [data]);
  const selected = selectedId ? data[selectedId] : undefined;

  const filterItems = (arr?: CourtItem[]) =>
    (arr || []).filter((item) => {
      const hay = [item.category, item.name, item.long_name, item.uf, item.description]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(qContent.toLowerCase());
    });

  const courts = filterItems(selected?.courts);
  const intimacoes = filterItems(selected?.intimacoes);
  const administrative = filterItems(selected?.administrative);
  const systems = filterItems(selected?.systems);

  return (
    <div className="mx-auto w-full px-3 sm:px-4 py-4 md:py-6">
      <div className="grid grid-cols-1 md:grid-cols-[300px,1fr] gap-4">
        {/* Sidebar (states) */}
        <nav
          id="sidebar"
          aria-label="Seleção de Estado"
          className={classNames(
            "bg-white rounded-xl shadow p-3 md:p-4 h-max md:sticky md:top-[88px]",
            sidebarOpen ? "block" : "hidden md:block"
          )}
        >
          <div className="mb-2">
            <input
              type="text"
              placeholder="Filtrar por estado…"
              className="bg-gray-100 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              onChange={(e) => setQStates(e.target.value)}
              value={qStates}
            />
          </div>
          <ul className="max-h-[60vh] md:max-h-[70vh] overflow-auto pr-1 text-sm">
            {statesEntries
              .filter(([id, st]) => (st.name || id).toLowerCase().includes(qStates.toLowerCase()))
              .map(([id, st]) => {
                const active = id === selectedId;
                return (
                  <li key={id} className="mb-1">
                    <button
                      className={classNames(
                        "w-full text-left rounded-md px-3 py-2",
                        active ? "bg-green-600 text-white" : "hover:bg-gray-100"
                      )}
                      onClick={() => {
                        setSelectedId(id);
                        setSidebarOpen(false);
                      }}
                      aria-current={active ? "true" : undefined}
                    >
                      {st.name}
                    </button>
                  </li>
                );
              })}
          </ul>
        </nav>

        {/* Main content */}
        <section className="space-y-6">
          <header className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">{selected?.name || "Selecione um estado"}</h2>
            <button
              className="md:hidden inline-flex items-center gap-2 rounded border border-gray-300 px-3 py-1.5 text-sm"
              onClick={() => setSidebarOpen((v) => !v)}
              aria-expanded={sidebarOpen}
              aria-controls="sidebar"
            >
              UF
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                className={classNames(sidebarOpen ? "rotate-180" : "", "transition-transform")}
              >
                <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </header>

          {/* Content search */}
          <div className="bg-white rounded-xl shadow p-3 md:p-4">
            <input
              id="q2"
              value={qContent}
              onChange={(e) => setQContent(e.target.value)}
              placeholder="Filtrar por tribunal, categoria, descrição…"
              className="bg-gray-100 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <DetailsSection title="Diários de Justiça" items={courts} />
          <DetailsSection title="Intimação Eletrônica" items={intimacoes} />
          <DetailsSection title="Administrativo / Outros Poderes" items={administrative} />
          <DetailsSection title="Sistemas" items={systems} />
        </section>
      </div>
    </div>
  );
}

/* ----------------- Unified DetailsSection (same layout for all) ----------------- */
function DetailsSection({
  title,
  items,
  defaultOpen = false,
}: {
  title: string;
  items: CourtItem[];
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  if (!items?.length) return null;

  return (
    <section className="bg-white rounded-xl shadow">
      {/* Collapsible header */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 md:px-5 md:py-4"
        aria-expanded={open}
        aria-controls={title.replace(/\s+/g, "-").toLowerCase()}
      >
        <div className="flex items-center gap-2">
          <h3 className="text-lg md:text-xl font-semibold">{title}</h3>
          <span className="text-xs md:text-sm text-gray-500">({items.length})</span>
        </div>
        <svg
          className={`h-5 w-5 transition-transform ${open ? "rotate-180" : "rotate-0"}`}
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Collapsible content */}
      <div
        id={title.replace(/\s+/g, "-").toLowerCase()}
        className={`transition-[max-height,opacity] duration-300 ease-in-out overflow-hidden ${
          open ? "max-h-[9999px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <ul className="divide-y">
          {items.map((item, idx) => {
            const hasAnyFlag =
              toBool(item.accepts_qrcode) !== undefined ||
              toBool(item.qrcode_required) !== undefined ||
              toBool(item.accepts_certificate) !== undefined ||
              toBool(item.certificate_required) !== undefined;

            return (
              <li key={idx} className="px-4 py-3 md:px-5">
                <div className="flex flex-col gap-2">
                  {/* Main line */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {item.category && <span className="font-medium">{item.category} - </span>}

                    {item.url ? (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-700 hover:underline"
                        title={item.url}
                      >
                        {item.name}
                      </a>
                    ) : (
                      <span>{item.name}</span>
                    )}

                    {item.long_name && <span className="text-gray-600">— {item.long_name}</span> && item.uf && <Chip>{item.uf}</Chip>}
                  </div>

                  {/* Flags (icons) */}
                  {hasAnyFlag && (
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm text-gray-600 w-full sm:w-auto">Aceita QR Code: <BoolIcon value={item.accepts_qrcode} title="Aceita QR Code" /></span>
                      <span className="text-sm text-gray-600 w-full sm:w-auto">QR Code obrigatório: <BoolIcon value={item.qrcode_required} title="QR Code obrigatório" /></span>
                      <span className="text-sm text-gray-600 w-full sm:w-auto">Aceita certificado: <BoolIcon value={item.accepts_certificate} title="Aceita certificado" /></span>
                      <span className="text-sm text-gray-600 w-full sm:w-auto">Certificado obrigatório: <BoolIcon value={item.certificate_required} title="Certificado obrigatório" /></span>
                    </div>
                  )}

                  {/* Optional description */}
                  {item.description && <div className="text-sm text-gray-600">{item.description}</div>}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
