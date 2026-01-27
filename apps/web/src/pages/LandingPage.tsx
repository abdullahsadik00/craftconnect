import React from 'react';
import { Link } from 'react-router-dom';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Welcome to CraftConnect
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Connect with the best local service providers.
        </p>
        <div className="mt-5 flex justify-center gap-4">
            <Link to="/login" className="text-blue-600 hover:text-blue-500">Login</Link>
            <Link to="/register" className="text-blue-600 hover:text-blue-500">Register</Link>
        </div>
      </div>
    </div>
  );
};
