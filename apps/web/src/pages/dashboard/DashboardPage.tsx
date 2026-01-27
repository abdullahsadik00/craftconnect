import React from 'react';
import { useAuth } from '../../context/AuthContext';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      <div className="mt-4">
        <p>Welcome back, {user?.email}!</p>
        <p className="mt-2 text-gray-600">Select an option from the sidebar to manage your profile, portfolio, or inquiries.</p>
      </div>
    </div>
  );
};
