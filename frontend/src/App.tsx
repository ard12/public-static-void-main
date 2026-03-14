
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatedLoginPage } from './components/ui/animated-characters-login-page';
import { AuthorityDashboard } from './components/ui/dashboard-with-collapsible-sidebar';
import { CaseDetail } from './components/ui/case-detail';
import { ClientRegistration } from './components/ui/client-registration';
import { CasesPage } from './components/ui/cases';
import { EvidenceReviewPage } from './components/ui/evidence-review';
import { ScoringPage } from './components/ui/scoring';
import { AnnouncementsPage } from './components/ui/announcements';
import { ReferralsPage } from './components/ui/referrals';
import { CaseTimelinePage } from './components/ui/case-timeline';
import { RefugeePortal } from './components/ui/refugee-portal';
import { getCurrentUser } from './lib/auth';

/** Only let through if logged in and the role matches (or no role required). */
function RequireAuth({ children, role }: { children: React.ReactNode; role?: "authority" | "refugee" }) {
  const user = getCurrentUser();
  const { pathname } = useLocation();

  if (!user) return <Navigate to="/login" state={{ from: pathname }} replace />;
  if (role && user.role !== role) {
    // Wrong role — send them to their own home
    return <Navigate to={user.role === "refugee" ? "/my-case" : "/dashboard"} replace />;
  }
  return <>{children}</>;
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<AnimatedLoginPage />} />

        {/* Catch-all: redirect / to dashboard or my-case depending on user */}
        <Route path="/" element={<RootRedirect />} />

        {/* Officer routes */}
        <Route path="/dashboard" element={<RequireAuth role="authority"><AuthorityDashboard /></RequireAuth>} />
        <Route path="/cases" element={<RequireAuth role="authority"><CasesPage /></RequireAuth>} />
        <Route path="/case/:id" element={<RequireAuth role="authority"><CaseDetail /></RequireAuth>} />
        <Route path="/timeline" element={<RequireAuth role="authority"><CaseTimelinePage /></RequireAuth>} />
        <Route path="/timeline/:caseId" element={<RequireAuth role="authority"><CaseTimelinePage /></RequireAuth>} />
        <Route path="/evidence" element={<RequireAuth role="authority"><EvidenceReviewPage /></RequireAuth>} />
        <Route path="/scoring" element={<RequireAuth role="authority"><ScoringPage /></RequireAuth>} />
        <Route path="/scoring/:id" element={<RequireAuth role="authority"><ScoringPage /></RequireAuth>} />
        <Route path="/announcements" element={<RequireAuth role="authority"><AnnouncementsPage /></RequireAuth>} />
        <Route path="/referrals" element={<RequireAuth role="authority"><ReferralsPage /></RequireAuth>} />
        <Route path="/registration" element={<RequireAuth role="authority"><ClientRegistration /></RequireAuth>} />

        {/* Refugee routes */}
        <Route path="/my-case" element={<RequireAuth role="refugee"><RefugeePortal defaultTab="my-case" /></RequireAuth>} />
        <Route path="/refugee-announcements" element={<RequireAuth role="refugee"><RefugeePortal defaultTab="announcements" /></RequireAuth>} />
        <Route path="/help" element={<RequireAuth role="refugee"><RefugeePortal defaultTab="help" /></RequireAuth>} />

        {/* Legacy refugee route kept for backward compat */}
        <Route path="/refugee" element={<RequireAuth role="refugee"><RefugeePortal defaultTab="my-case" /></RequireAuth>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

function RootRedirect() {
  const user = getCurrentUser();
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={user.role === "refugee" ? "/my-case" : "/dashboard"} replace />;
}

export default App;
