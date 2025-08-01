import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useParams,
} from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { useAuth } from "./hooks/useAuth";

import Layout from "./components/common/Layout";
import ProtectedRoute from "./components/common/ProtectedRoute";
import ErrorBoundary from "./components/common/ErrorBoundary";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import NotFoundPage from "./pages/NotFoundPage";

import "./App.css";
import PendingProductsPage from "./pages/PendingProductsPage";
import ProductManagementPage from "./pages/ProductManagementPage";
import CustomerManagement from "./pages/CustomerManagement";
import AgencyManagement from "./pages/AgencyManagement";
import AgencyApplications from "./pages/AgencyApplications";
import ApplicationReview from "./pages/ApplicationReview";
import InsuranceManagement from "./pages/InsuranceManagement";
import InsuranceReview from "./pages/InsuranceReview";
import ReportsPage from "./pages/ReportsPage";

const AppContent = () => {
  const { checkAuth } = useAuth();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const ApplicationReviewWrapper = () => {
    const { id } = useParams();
    return <ApplicationReview applicationId={id} />;
  };


  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <DashboardPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        {/* Placeholder routes for future pages */}
        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <Layout>
                <ProductManagementPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/products/pending"
          element={
            <ProtectedRoute>
              <Layout>
                <PendingProductsPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/users/customers"
          element={
            <ProtectedRoute>
              <Layout>
                <CustomerManagement />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/users/agencies"
          element={
            <ProtectedRoute>
              <Layout>
                <AgencyManagement />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/users/agencies/applications"
          element={
            <ProtectedRoute>
              <Layout>
                <AgencyApplications />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/users/agencies/applications/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <ApplicationReviewWrapper />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/insurance"
          element={
            <ProtectedRoute>
              <Layout>
                <InsuranceManagement />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/insurance/review/:claimId"
          element={
            <ProtectedRoute>
              <Layout>
                <InsuranceReview />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <Layout>
                <ReportsPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Layout>
                <div className="text-center py-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Settings
                  </h2>
                  <p className="text-gray-600">Coming Soon...</p>
                </div>
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <AppContent />
      </Provider>
    </ErrorBoundary>
  );
}

export default App;
