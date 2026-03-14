"use client"
import { useState, useEffect, useCallback } from "react";
import {
  Home, Bell, HelpCircle, Moon, Sun, User, ChevronsRight,
  Shield, Clock, CheckCircle2, AlertCircle, Loader2, Phone, Mail, Globe, LogOut
} from "lucide-react";
import { clearCurrentUser, getCurrentUser } from "../../lib/auth";
import { useNavigate } from "react-router-dom";
import { ShaderAnimation } from "./shader-animation";
import { listCases, listEvidence, getLatestScore, listAnnouncements } from "../../lib/api";

interface RefugeePortalProps {
  defaultTab?: "my-case" | "announcements" | "help";
}

const STAGE_ORDER = [
  "intake_created",
  "evidence_review",
  "scoring",
  "verified_for_handoff",
  "referred",
  "closed",
];
const STAGE_LABELS: Record<string, string> = {
  intake_created: "Registered",
  evidence_review: "Evidence Review",
  scoring: "Scoring",
  verified_for_handoff: "Verified",
  referred: "Referred",
  closed: "Closed",
};
const SCORE_BAND_MESSAGES: Record<string, string> = {
  under_review: "Your case is currently being reviewed",
  provisional: "Your identity has been provisionally confirmed",
  verified: "Your identity has been verified",
  high_confidence: "Your identity has been fully confirmed",
};

export const RefugeePortal = ({ defaultTab = "my-case" }: RefugeePortalProps) => {
  const [isDark, setIsDark] = useState(false);
  const [selectedTab, setSelectedTab] = useState<"my-case" | "announcements" | "help">(defaultTab);
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const user = getCurrentUser();

  useEffect(() => {
    if (isDark) {
      document.body.classList.add("dark");
      document.body.style.backgroundColor = "#030712";
    } else {
      document.body.classList.remove("dark");
      document.body.style.backgroundColor = "";
    }
  }, [isDark]);

  useEffect(() => {
    setSelectedTab(defaultTab);
  }, [defaultTab]);

  const handleLogout = () => {
    clearCurrentUser();
    navigate("/login");
  };

  return (
    <div className={`flex min-h-screen w-full ${isDark ? "dark" : ""}`}>
      <div className="flex w-full bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
        {/* Sidebar */}
        <nav className={`sticky top-0 h-screen shrink-0 border-r transition-all duration-300 ease-in-out z-20 ${
          open ? "w-64" : "w-16"
        } border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm flex flex-col`}>
          {/* Brand */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-800 h-[72px] flex items-center">
            <div className="flex items-center gap-3 w-full overflow-hidden">
              <div className="grid size-8 shrink-0 place-content-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 shadow-sm">
                <svg width="16" height="auto" viewBox="0 0 50 39" fill="none" xmlns="http://www.w3.org/2000/svg" className="fill-white">
                  <path d="M16.4992 2H37.5808L22.0816 24.9729H1L16.4992 2Z" />
                  <path d="M17.4224 27.102L11.4192 36H33.5008L49 13.0271H32.7024L23.2064 27.102H17.4224Z" />
                </svg>
              </div>
              {open && (
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-gray-900 dark:text-white leading-tight">BorderBridge</span>
                  <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium tracking-wide uppercase">Refugee Portal</span>
                </div>
              )}
            </div>
          </div>

          {/* Nav */}
          <div className="p-2 space-y-1 mt-4 flex-1 overflow-y-auto">
            <NavItem Icon={Home} label="My Case" tab="my-case" selected={selectedTab} setSelected={setSelectedTab} open={open} />
            <NavItem Icon={Bell} label="Announcements" tab="announcements" selected={selectedTab} setSelected={setSelectedTab} open={open} />
            <NavItem Icon={HelpCircle} label="Help & Support" tab="help" selected={selectedTab} setSelected={setSelectedTab} open={open} />
          </div>

          {/* Bottom */}
          <button
            onClick={() => setOpen(!open)}
            className="border-t border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <div className="flex items-center p-3 h-14">
              <div className="grid size-8 shrink-0 place-content-center">
                <ChevronsRight className={`h-4 w-4 transition-transform duration-300 text-gray-500 dark:text-gray-400 ${open ? "rotate-180" : ""}`} />
              </div>
              {open && <span className="text-sm font-medium text-gray-600 dark:text-gray-300 ml-2">Collapse Sidebar</span>}
            </div>
          </button>
        </nav>

        {/* Main */}
        <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
          {/* Header */}
          <header className="flex-shrink-0 flex items-center justify-between px-6 lg:px-8 h-[72px] border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/80 backdrop-blur-sm z-10">
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                {selectedTab === "my-case" ? "My Case" : selectedTab === "announcements" ? "Announcements" : "Help & Support"}
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">BorderBridge Refugee Portal</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setIsDark(!isDark)} className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                {isDark ? <Sun className="h-4 w-4 text-gray-300" /> : <Moon className="h-4 w-4 text-gray-600" />}
              </button>
              <div className="h-6 w-px bg-gray-200 dark:bg-gray-700" />
              <div className="flex items-center gap-2 p-1.5 rounded-lg">
                <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                  <User className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                {open && <span className="text-sm font-medium text-gray-700 dark:text-gray-200 hidden sm:block">{user?.display ?? "Refugee"}</span>}
              </div>
              <button onClick={handleLogout} title="Logout" className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-200 transition-colors">
                <LogOut className="h-4 w-4 text-gray-500" />
              </button>
            </div>
          </header>

          {/* Content */}
          <main className="relative flex-1 overflow-auto bg-gray-50/50 dark:bg-gray-950/50 p-6 lg:p-8">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute inset-0 opacity-[0.08] dark:opacity-[0.14]">
                <ShaderAnimation className="h-full w-full" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-b from-gray-50/92 via-gray-50/78 to-gray-50/95 dark:from-gray-950/94 dark:via-gray-950/82 dark:to-gray-950/96" />
            </div>
            <div className="relative z-10 max-w-4xl mx-auto w-full pb-12">
              {selectedTab === "my-case" && <MyCasePage />}
              {selectedTab === "announcements" && <RefugeeAnnouncementsPage />}
              {selectedTab === "help" && <HelpPage />}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

/* ─── Nav Item ──────────────────────────────────────────────────────────────── */
const NavItem = ({ Icon, label, tab, selected, setSelected, open }: any) => {
  const isSelected = selected === tab;
  return (
    <button
      onClick={() => setSelected(tab)}
      className={`relative flex h-[42px] w-full items-center rounded-lg transition-all duration-200 border border-transparent ${
        isSelected
          ? "bg-white dark:bg-gray-800 shadow-sm border-gray-200 dark:border-gray-700 text-blue-600 dark:text-blue-400"
          : "text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800/80 hover:text-gray-900 dark:hover:text-gray-200"
      }`}
    >
      <div className="grid h-full w-[42px] shrink-0 place-content-center">
        <Icon className={`h-[18px] w-[18px] ${isSelected ? "text-blue-600 dark:text-blue-400" : ""}`} />
      </div>
      {open && <span className={`text-sm tracking-wide ${isSelected ? "font-semibold" : "font-medium"}`}>{label}</span>}
    </button>
  );
};

/* ─── My Case Page ──────────────────────────────────────────────────────────── */
const MyCasePage = () => {
  const [caseData, setCaseData] = useState<Record<string, unknown> | null>(null);
  const [evidence, setEvidence] = useState<Record<string, unknown>[]>([]);
  const [scoreBand, setScoreBand] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const cases = await listCases();
      if (!cases.length) {
        setLoading(false);
        return;
      }
      const c = cases[0];
      const caseId = String(c.case_id ?? c.id ?? "");
      setCaseData(c);
      const [evItems, scoreData] = await Promise.all([
        listEvidence(caseId),
        getLatestScore(caseId),
      ]);
      setEvidence(evItems);
      if (scoreData) setScoreBand(String((scoreData as any).confidence_band ?? ""));
    } catch {
      setError("Could not load your case. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) return (
    <div className="flex items-center justify-center py-32 gap-3 text-gray-400">
      <Loader2 className="h-6 w-6 animate-spin" /> Loading your case…
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center py-32 gap-3 text-red-400">
      <AlertCircle className="h-8 w-8" />
      <p>{error}</p>
    </div>
  );

  if (!caseData) return (
    <div className="flex flex-col items-center justify-center py-32 gap-3 text-gray-400">
      <Clock className="h-10 w-10" />
      <p className="text-gray-500 font-medium">No case found in the system yet.</p>
    </div>
  );

  const status = String(caseData.status ?? "intake_created");
  const caseCode = String(caseData.case_code ?? caseData.case_id ?? caseData.id ?? "—");
  const currentStageIdx = STAGE_ORDER.indexOf(status);
  const bandMessage = SCORE_BAND_MESSAGES[scoreBand ?? ""] ?? null;

  return (
    <div className="space-y-6">
      {/* Case Header */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm p-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-500 mb-1">Your Case</p>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{caseCode}</h2>
          </div>
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
            status === "closed" ? "bg-gray-100 text-gray-600" : "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
          }`}>
            <Shield className="h-4 w-4" />
            {STAGE_LABELS[status] ?? status}
          </div>
        </div>

        {/* Stage Stepper */}
        <div className="mt-6">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 right-0 top-4 h-0.5 bg-gray-200 dark:bg-gray-700" />
            <div
              className="absolute left-0 top-4 h-0.5 bg-blue-500 transition-all duration-700"
              style={{ width: `${currentStageIdx >= 0 ? (currentStageIdx / (STAGE_ORDER.length - 1)) * 100 : 0}%` }}
            />
            {STAGE_ORDER.map((stage, idx) => {
              const done = idx <= currentStageIdx;
              return (
                <div key={stage} className="relative flex flex-col items-center gap-1 z-10">
                  <div className={`h-8 w-8 rounded-full border-2 flex items-center justify-center transition-colors ${
                    done
                      ? "bg-blue-500 border-blue-500"
                      : "bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
                  }`}>
                    {done ? <CheckCircle2 className="h-4 w-4 text-white" /> : <div className="h-2 w-2 rounded-full bg-gray-300 dark:bg-gray-600" />}
                  </div>
                  <span className={`text-[10px] font-medium text-center max-w-[56px] ${done ? "text-blue-600 dark:text-blue-400" : "text-gray-400"}`}>
                    {STAGE_LABELS[stage]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Score Band */}
      {bandMessage && (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm p-6">
          <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-500 mb-3">Verification Status</h3>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{bandMessage}</p>
          </div>
        </div>
      )}

      {/* Evidence (read-only) */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Your Evidence Items</h3>
          <p className="text-sm text-gray-500 mt-0.5">These are the items submitted to verify your identity.</p>
        </div>
        {evidence.length === 0 ? (
          <div className="flex flex-col items-center py-12 gap-3 text-gray-400">
            <Clock className="h-8 w-8" />
            <p className="text-sm text-gray-500">No evidence items on file yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase text-gray-500 bg-gray-50/50 dark:bg-gray-800/50">
                <tr>
                  <th className="px-5 py-3 font-semibold">Type</th>
                  <th className="px-5 py-3 font-semibold">Class</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
                {evidence.map((ev, i) => {
                  const evStatus = String(ev.review_status ?? ev.state ?? "pending");
                  const evType = String(ev.evidence_type ?? ev.type ?? "—");
                  const evClass = String(ev.trust_class ?? ev.evidence_class ?? "—");
                  const evDate = ev.created_at ? new Date(String(ev.created_at)).toLocaleDateString() : "—";
                  return (
                    <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                      <td className="px-5 py-4 font-medium capitalize">{evType.replace(/_/g, " ")}</td>
                      <td className="px-5 py-4 text-gray-500 capitalize">{evClass.replace(/_/g, " ")}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium border ${
                          evStatus === "accepted" ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:border-green-800"
                          : evStatus === "rejected" ? "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:border-red-800"
                          : "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800"
                        }`}>
                          {evStatus.charAt(0).toUpperCase() + evStatus.slice(1)}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-gray-400 text-xs">{evDate}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

/* ─── Refugee Announcements ─────────────────────────────────────────────────── */
const RefugeeAnnouncementsPage = () => {
  const [announcements, setAnnouncements] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const cases = await listCases();
      if (!cases.length) { setLoading(false); return; }
      const caseId = String(cases[0].case_id ?? cases[0].id ?? "");
      const data = await listAnnouncements(caseId);
      setAnnouncements(data);
    } catch {
      setError("Could not load announcements.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) return (
    <div className="flex items-center justify-center py-32 gap-3 text-gray-400">
      <Loader2 className="h-6 w-6 animate-spin" /> Loading announcements…
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center py-24 gap-3 text-red-400">
      <AlertCircle className="h-8 w-8" /><p>{error}</p>
    </div>
  );

  if (announcements.length === 0) return (
    <div className="flex flex-col items-center py-24 gap-3 text-gray-400">
      <Bell className="h-10 w-10" />
      <p className="text-gray-500 font-medium">No announcements yet.</p>
    </div>
  );

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500 dark:text-gray-400">Official notices from BorderBridge authorities.</p>
      {announcements.map((a, i) => {
        const title = String(a.title ?? "Announcement");
        const body = String(a.body ?? a.message ?? "");
        const date = a.created_at ? new Date(String(a.created_at)).toLocaleDateString() : "—";
        return (
          <div key={i} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm p-5">
            <div className="flex items-start justify-between gap-4 mb-2">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
              <span className="text-xs text-gray-400 whitespace-nowrap">{date}</span>
            </div>
            {body && <p className="text-sm text-gray-600 dark:text-gray-400">{body}</p>}
          </div>
        );
      })}
    </div>
  );
};

/* ─── Help & Support ────────────────────────────────────────────────────────── */
const HelpPage = () => (
  <div className="space-y-6 max-w-2xl">
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm p-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Help & Support</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-8">
        For urgent assistance contact your case officer. We are here to help.
      </p>

      <div className="space-y-4">
        <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
          <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
            <Phone className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-0.5">Phone</p>
            <p className="font-semibold text-gray-900 dark:text-gray-100">+1-800-000-0000</p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
          <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
            <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-0.5">Email</p>
            <p className="font-semibold text-gray-900 dark:text-gray-100">support@borderbridge.org</p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-100 dark:border-green-800">
          <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
            <Globe className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-0.5">UNHCR Emergency Hotline</p>
            <p className="font-semibold text-gray-900 dark:text-gray-100">1-800-UNHCR (placeholder)</p>
            <p className="text-xs text-gray-500 mt-0.5">Available 24/7 for urgent situations</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);
