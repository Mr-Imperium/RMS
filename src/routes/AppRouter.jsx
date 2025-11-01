import AdminRoute from './AdminRoute'; 
import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';
import { PERMISSIONS } from '../utils/permissions';
import UnauthorizedPage from '../pages/errors/UnauthorizedPage';
import DashboardLayout from '../components/layout/DashboardLayout';
import LoadingSpinner from '../components/common/LoadingSpinner';

const CandidateProfilePrint = lazy(() => import('../pages/print/CandidateProfilePrint'));
// ====================================================================
// Lazy-Loaded Pages (All pages from the older file are included)
// ====================================================================
// Public/Auth
const AuditLogsPage = lazy(() => import('../pages/admin/audit/AuditLogsPage'));
const JobListingsPage = lazy(() => import('../pages/public/JobListingsPage'));
const AcceptInvitePage = lazy(() => import('../pages/auth/AcceptInvitePage'));
const LoginPage = lazy(() => import('../pages/auth/LoginPage'));
const ForgotPasswordPage = lazy(() => import('../pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('../pages/auth/ResetPasswordPage'));
// Protected (Admin/Operation/Management/Reports/Settings)
const DashboardPage = lazy(() => import('../pages/dashboard/DashboardPage'));
const CompaniesListPage = lazy(() => import('../pages/admin/companies/CompaniesListPage'));
const CompanyFormPage = lazy(() => import('../pages/admin/companies/CompanyFormPage'));
const JobTitlesListPage = lazy(() => import('../pages/admin/jobs/JobTitlesListPage'));
const JobFormPage = lazy(() => import('../pages/admin/jobs/JobFormPage'));
const StaffListPage = lazy(() => import('../pages/admin/staff/StaffListPage'));
const ProjectsListPage = lazy(() => import('../pages/admin/projects/ProjectsListPage'));
const ProjectFormPage = lazy(() => import('../pages/admin/projects/ProjectFormPage'));
const CandidatesListPage = lazy(() => import('../pages/admin/candidates/CandidatesListPage'));
const CandidateFormPage = lazy(() => import('../pages/admin/candidates/CandidateFormPage'));
const CandidateProfilePage = lazy(() => import('../pages/admin/candidates/CandidateProfilePage'));
const ReferrersListPage = lazy(() => import('../pages/admin/referrers/ReferrersListPage'));
const ReferrerFormPage = lazy(() => import('../pages/admin/referrers/ReferrerFormPage'));
const ReferrerProfilePage = lazy(() => import('../pages/admin/referrers/ReferrerProfilePage'));
const CurrencySettingsPage = lazy(() => import('../pages/admin/settings/CurrencySettingsPage'));
const OrientationCentersListPage = lazy(() => import('../pages/admin/orientation/OrientationCentersListPage'));
const LineUpsPage = lazy(() => import('../pages/admin/operations/LineUpsPage'));
const SuggestionsPage = lazy(() => import('../pages/admin/operations/SuggestionsPage'));
const DetectionPage = lazy(() => import('../pages/admin/detection/DetectionPage'));
const VisitorsPage = lazy(() => import('../pages/admin/management/VisitorsPage'));
const InquiriesPage = lazy(() => import('../pages/admin/management/InquiriesPage'));
const LabourApprovalReportPage = lazy(() => import('../pages/admin/reports/LabourApprovalReportPage'));
const NotificationsPage = lazy(() => import('../pages/admin/notifications/NotificationsPage')); // Added from older code
const NotFoundPage = lazy(() => import('../pages/errors/NotFoundPage'));
const GeneralSettingsPage = lazy(() => import('../pages/admin/settings/GeneralSettingsPage'));
const SecuritySettingsPage = lazy(() => import('../pages/admin/settings/SecuritySettingsPage'));
const EmailTemplatesPage = lazy(() => import('../pages/admin/settings/EmailTemplatesPage')); // Added import



const AppRouter = () => {
  return (
    <Suspense fallback={<LoadingSpinner fullPage />}>
      <Routes>
        {/* --- PRINT ROUTES --- */}
        {/* These routes render without the main DashboardLayout */}
        <Route path="/print/candidate/:id" element={<ProtectedRoute><CandidateProfilePrint /></ProtectedRoute>} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* ====================================================================
            PUBLIC & AUTH ROUTES
        ==================================================================== */}
        <Route path="/" element={<JobListingsPage />} />
        <Route path="/accept-invite" element={<AcceptInvitePage />} />
        
        {/* PublicRoute wrapper ensures user is redirected if already logged in */}
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />
        
        {/* No PublicRoute needed, as this is used after a password reset link is clicked */}
        <Route path="/update-password" element={<ResetPasswordPage />} />
        
        {/* ====================================================================
            PROTECTED ROUTES (NESTED UNDER DashboardLayout and ProtectedRoute for Roles)
            NOTE: The DashboardLayout is the parent, and ProtectedRoute checks the role 
                  on *every* child route for granular access control.
        ==================================================================== */}
        <Route element={<AdminRoute><DashboardLayout /></AdminRoute>}>
            <Route path="staff" element={<StaffListPage />} />
            <Route path="audit-log" element={<AuditLogsPage />} />
            <Route path="settings/general" element={<GeneralSettingsPage />} />
            <Route path="settings/security" element={<SecuritySettingsPage />} />
            <Route path="settings/email-templates" element={<EmailTemplatesPage />} />
            {/* <Route path="system-log" element={<SystemLogsPage />} /> */}
        </Route>
        
        <Route element={<DashboardLayout />}>
          {/* Dashboard (Requires basic access) */}
          <Route 
            path="dashboard" 
            element={<ProtectedRoute requiredRole={PERMISSIONS.VIEW_DASHBOARD}><DashboardPage /></ProtectedRoute>} 
          />
          
          {/* Administration: Clients & Projects */}
          <Route path="clients" element={<ProtectedRoute requiredRole={PERMISSIONS.VIEW_CLIENT}><CompaniesListPage /></ProtectedRoute>} />
          <Route path="clients/new" element={<ProtectedRoute requiredRole={PERMISSIONS.MANAGE_CLIENT}><CompanyFormPage /></ProtectedRoute>} />
          <Route path="clients/:id/edit" element={<ProtectedRoute requiredRole={PERMISSIONS.MANAGE_CLIENT}><CompanyFormPage /></ProtectedRoute>} />

          <Route path="projects" element={<ProtectedRoute requiredRole={PERMISSIONS.VIEW_PROJECT}><ProjectsListPage /></ProtectedRoute>} />
          <Route path="projects/new" element={<ProtectedRoute requiredRole={PERMISSIONS.MANAGE_PROJECT}><ProjectFormPage /></ProtectedRoute>} />
          <Route path="projects/:id/edit" element={<ProtectedRoute requiredRole={PERMISSIONS.MANAGE_PROJECT}><ProjectFormPage /></ProtectedRoute>} />
          
          {/* Administration: Referrers */}
          <Route path="referrer" element={<ProtectedRoute requiredRole={PERMISSIONS.VIEW_REFERRER}><ReferrersListPage /></ProtectedRoute>} />
          <Route path="referrers/new" element={<ProtectedRoute requiredRole={PERMISSIONS.MANAGE_REFERRER}><ReferrerFormPage /></ProtectedRoute>} />
          <Route path="referrers/:id" element={<ProtectedRoute requiredRole={PERMISSIONS.VIEW_REFERRER}><ReferrerProfilePage /></ProtectedRoute>} />

          {/* Operation: Candidates */}
          <Route path="candidates" element={<ProtectedRoute requiredRole={PERMISSIONS.VIEW_CANDIDATE}><CandidatesListPage /></ProtectedRoute>} />
          <Route path="candidates/new" element={<ProtectedRoute requiredRole={PERMISSIONS.MANAGE_CANDIDATE}><CandidateFormPage /></ProtectedRoute>} />
          <Route path="candidates/:id" element={<ProtectedRoute requiredRole={PERMISSIONS.VIEW_CANDIDATE}><CandidateProfilePage /></ProtectedRoute>} />

          {/* Operation: Jobs & Line-Ups */}
          <Route path="line-ups" element={<ProtectedRoute requiredRole={PERMISSIONS.VIEW_LINEUP}><LineUpsPage /></ProtectedRoute>} />
          <Route path="job-titles" element={<ProtectedRoute requiredRole={PERMISSIONS.VIEW_JOB_TITLE}><JobTitlesListPage /></ProtectedRoute>} />
          <Route path="job-titles/new" element={<ProtectedRoute requiredRole={PERMISSIONS.MANAGE_JOB_TITLE}><JobFormPage /></ProtectedRoute>} />
          <Route path="job-titles/:id/edit" element={<ProtectedRoute requiredRole={PERMISSIONS.MANAGE_JOB_TITLE}><JobFormPage /></ProtectedRoute>} />
          
          {/* Operation: Other */}
          <Route path="suggestions" element={<ProtectedRoute requiredRole={PERMISSIONS.VIEW_SUGGESTIONS}><SuggestionsPage /></ProtectedRoute>} />
          <Route path="notifications" element={<ProtectedRoute requiredRole={PERMISSIONS.VIEW_NOTIFICATIONS}><NotificationsPage /></ProtectedRoute>} />

          {/* Detection */}
          <Route path="detection" element={<ProtectedRoute requiredRole={PERMISSIONS.VIEW_DETECTION}><DetectionPage /></ProtectedRoute>} />
          
          {/* Reports */}
          <Route path="reports/labour-approval" element={<ProtectedRoute requiredRole={PERMISSIONS.VIEW_REPORTS}><LabourApprovalReportPage /></ProtectedRoute>} />

          {/* Management (Visitors/Inquiries) */}
          <Route path="management/visitors" element={<ProtectedRoute requiredRole={PERMISSIONS.VIEW_VISITORS}><VisitorsPage /></ProtectedRoute>} />
          <Route path="management/inquiries" element={<ProtectedRoute requiredRole={PERMISSIONS.VIEW_INQUIRIES}><InquiriesPage /></ProtectedRoute>} />

          {/* Staff Management (Super Admin/Admin Only) */}
          {/* This was a separate parent route, now merged under the main layout */}
          <Route path="staff" element={<ProtectedRoute requiredRole={PERMISSIONS.MANAGE_STAFF}><StaffListPage /></ProtectedRoute>} />

          {/* Settings */}
          <Route path="settings/currencies" element={<ProtectedRoute requiredRole={PERMISSIONS.MANAGE_SETTINGS}><CurrencySettingsPage /></ProtectedRoute>} />
          <Route path="orientation/centers" element={<ProtectedRoute requiredRole={PERMISSIONS.MANAGE_SETTINGS}><OrientationCentersListPage /></ProtectedRoute>} />
        </Route>

        {/* ====================================================================
            404 NOT FOUND ROUTE
        ==================================================================== */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};

export default AppRouter;