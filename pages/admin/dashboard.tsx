import React from 'react';
import Layout from '../../components/Layout';
import ProtectedRoute from '../../components/ProtectedRoute';
import { useMemberstack } from '../../hooks/useMemberstack';

export default function AdminDashboardPage() {
  const { member } = useMemberstack();

  return (
    <ProtectedRoute requiredRole="admin">
      <Layout title="Admin Dashboard">
        <div className="px-4 py-6">
          <h1 className="text-3xl font-bold mb-4">Welcome, {member?.customFields?.name || 'Admin'}!</h1>
          <p className="text-indigo-500">This is your admin dashboard. Explore and manage the application.</p>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}

