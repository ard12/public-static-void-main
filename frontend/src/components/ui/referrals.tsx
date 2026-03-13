
import { useState, useEffect, useCallback } from "react";
import { AuthorityLayout } from "./authority-layout";
import { Briefcase, Home, BookOpen, Scale, HeartPulse, MessageCircle, Send, Loader2, AlertCircle, X, ChevronDown } from "lucide-react";
import { GradientButton } from "./gradient-button";
import { listCases, createReferral, updateReferral } from "../../lib/api";
import { useLocation } from "react-router-dom";

type Case = Record<string, unknown>;
type Referral = Record<string, unknown>;

const REFERRAL_TYPES = [
  { value: "employment", label: "Employment", icon: Briefcase, color: "text-blue-500" },
  { value: "housing", label: "Housing", icon: Home, color: "text-indigo-500" },
  { value: "education", label: "Education", icon: BookOpen, color: "text-orange-500" },
  { value: "legal_aid", label: "Legal Aid", icon: Scale, color: "text-gray-500" },
  { value: "healthcare", label: "Healthcare", icon: HeartPulse, color: "text-red-500" },
  { value: "language", label: "Language", icon: MessageCircle, color: "text-green-500" },
];

function statusColor(status: string) {
  if (status === "approved") return "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800";
  if (status === "pending" || status === "processing") return "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800";
  return "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700";
}

export const ReferralsPage = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const preselectedCaseId = params.get("caseId") ?? "";

  const [cases, setCases] = useState<Case[]>([]);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Create form state
  const [selectedCaseId, setSelectedCaseId] = useState(preselectedCaseId);
  const [referralType, setReferralType] = useState("employment");
  const [fromAgency, setFromAgency] = useState("");
  const [toAgency, setToAgency] = useState("");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{ ok: boolean; message: string } | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const caseList = await listCases();
      setCases(caseList);
      if (!selectedCaseId && caseList.length > 0) {
        setSelectedCaseId(String(caseList[0].id ?? ""));
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load cases.");
    } finally {
      setLoading(false);
    }
  }, [selectedCaseId]);

  useEffect(() => { loadData(); }, []);  // eslint-disable-line

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCaseId) return;
    setSubmitting(true);
    setSubmitResult(null);
    try {
      const created = await createReferral(selectedCaseId, {
        case_id: selectedCaseId,
        referral_type: referralType,
        from_agency: fromAgency || undefined,
        to_agency: toAgency || undefined,
        reason: reason || undefined,
      });
      setReferrals((prev) => [created, ...prev]);
      setSubmitResult({ ok: true, message: `Referral created for case ${selectedCaseId}.` });
      setReason("");
      setFromAgency("");
      setToAgency("");
    } catch (err: unknown) {
      setSubmitResult({ ok: false, message: err instanceof Error ? err.message : "Failed to create referral." });
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStatus = async (referralId: string, status: string) => {
    try {
      const updated = await updateReferral(referralId, status);
      setReferrals((prev) =>
        prev.map((r) => (String(r.id ?? "") === referralId ? { ...r, ...updated } : r))
      );
    } catch (err) {
      console.error("Update referral failed:", err);
    }
  };

  // Count by type from created referrals
  const typeCount = (type: string) => referrals.filter((r) => String(r.referral_type ?? "") === type).length;

  return (
    <AuthorityLayout title="Referrals & Services" subtitle="Connect verified refugees with integration and support services.">
      <div className="flex flex-col gap-6">

        {/* Summary Row */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {REFERRAL_TYPES.map(({ value, label, icon: Icon, color }) => (
            <div key={value} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 flex flex-col items-center justify-center text-center shadow-sm">
              <Icon className={`h-6 w-6 ${color} mb-2`} />
              <span className="text-xl font-bold">{typeCount(value)}</span>
              <span className="text-xs text-gray-500">{label}</span>
            </div>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24 gap-3 text-gray-400">
            <Loader2 className="h-6 w-6 animate-spin" /> Loading…
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-red-500">
            <AlertCircle className="h-8 w-8" />
            <p className="font-medium">{error}</p>
            <button onClick={loadData} className="text-sm text-blue-600 hover:underline">Retry</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Referrals Table */}
            <div className="lg:col-span-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm flex flex-col overflow-hidden">
              <div className="p-5 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/20">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Referrals Pipeline</h3>
                <span className="text-sm text-gray-500">{referrals.length} created this session</span>
              </div>
              {referrals.length === 0 ? (
                <div className="py-24 flex flex-col items-center gap-3 text-gray-400">
                  <Send className="h-8 w-8" />
                  <p className="font-medium">No referrals yet</p>
                  <p className="text-sm">Use the form to create a referral for a case.</p>
                </div>
              ) : (
                <div className="overflow-auto flex-1">
                  <table className="w-full text-left whitespace-nowrap">
                    <thead className="text-xs uppercase text-gray-500 dark:text-gray-400 bg-gray-50/50 dark:bg-gray-800/50 sticky top-0 border-b border-gray-200 dark:border-gray-800">
                      <tr>
                        <th className="px-6 py-4 font-semibold">Case</th>
                        <th className="px-6 py-4 font-semibold">Type</th>
                        <th className="px-6 py-4 font-semibold">Agency</th>
                        <th className="px-6 py-4 font-semibold text-center">Status</th>
                        <th className="px-6 py-4 font-semibold text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                      {referrals.map((r, i) => {
                        const rId = String(r.id ?? i);
                        const rType = String(r.referral_type ?? "");
                        const caseId = String(r.case_id ?? "");
                        const toOrg = String(r.to_agency ?? "—");
                        const status = String(r.status ?? "pending");
                        const typeInfo = REFERRAL_TYPES.find((t) => t.value === rType);
                        const Icon = typeInfo?.icon ?? Send;
                        return (
                          <tr key={rId} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                            <td className="px-6 py-4">
                              <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{caseId}</p>
                            </td>
                            <td className="px-6 py-4">
                              <div className={`flex items-center text-sm font-medium ${typeInfo?.color ?? "text-gray-500"}`}>
                                <Icon className="h-4 w-4 mr-2" /> {rType.replace(/_/g, " ")}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{toOrg}</td>
                            <td className="px-6 py-4 text-center">
                              <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold border ${statusColor(status)}`}>
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <select
                                value={status}
                                onChange={(e) => handleUpdateStatus(rId, e.target.value)}
                                className="text-xs border border-gray-300 dark:border-gray-700 rounded-md px-2 py-1 bg-white dark:bg-gray-800"
                              >
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                                <option value="processing">Processing</option>
                                <option value="completed">Completed</option>
                                <option value="rejected">Rejected</option>
                              </select>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Create Form */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-6 flex items-center">
                <Send className="h-5 w-5 mr-2 text-blue-500" /> New Referral
              </h3>

              {submitResult && (
                <div className={`mb-4 px-4 py-3 rounded-lg text-sm font-medium flex items-start gap-2 ${submitResult.ok ? "bg-green-50 text-green-800 border border-green-200" : "bg-red-50 text-red-800 border border-red-200"}`}>
                  {!submitResult.ok && <X className="h-4 w-4 shrink-0 mt-0.5" />}
                  {submitResult.message}
                </div>
              )}

              <form onSubmit={handleCreate} className="space-y-4">
                {/* Case selector */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Case <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      required
                      value={selectedCaseId}
                      onChange={(e) => setSelectedCaseId(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm appearance-none"
                    >
                      <option value="">Select a case…</option>
                      {cases.map((c) => {
                        const cId = String(c.id ?? "");
                        return (
                          <option key={cId} value={cId}>
                            {String(c.person_id ?? cId)} ({cId})
                          </option>
                        );
                      })}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Referral Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Referral Type</label>
                  <div className="relative">
                    <select
                      value={referralType}
                      onChange={(e) => setReferralType(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm appearance-none"
                    >
                      {REFERRAL_TYPES.map(({ value, label }) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* From Agency */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">From Agency</label>
                  <input
                    type="text"
                    value={fromAgency}
                    onChange={(e) => setFromAgency(e.target.value)}
                    placeholder="e.g. UNHCR"
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                  />
                </div>

                {/* To Agency */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">To Agency / Organization</label>
                  <input
                    type="text"
                    value={toAgency}
                    onChange={(e) => setToAgency(e.target.value)}
                    placeholder="e.g. City Housing Authority"
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                  />
                </div>

                {/* Reason */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Reason</label>
                  <textarea
                    rows={3}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Brief context for this referral…"
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                  />
                </div>

                <div className="pt-2">
                  <GradientButton
                    type="submit"
                    className="w-full rounded-lg py-3 flex justify-center items-center"
                    disabled={submitting || !selectedCaseId}
                  >
                    {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
                    {submitting ? "Creating…" : "Create Referral"}
                  </GradientButton>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AuthorityLayout>
  );
};
