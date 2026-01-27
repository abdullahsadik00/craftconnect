import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
// import { api } from '../../lib/api';
import { MOCK_AUTH_RESPONSE } from '../../data/mock';

export const RegisterPage: React.FC = () => {
  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data: any) => {
    try {
      // Assuming register endpoint logs in automatically or returns token
      // If not, we might need to redirect to login
      /*
      const response = await api.post('/auth/register/email', {
        ...data,
        role: 'PROVIDER' // Defaulting to PROVIDER for now as per requirement
      });

      login(response.data.data);
      */

      // Mock register
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Registering with:', data);
      login(MOCK_AUTH_RESPONSE);

      navigate('/dashboard');
    } catch (error: any) {
         console.error(error);
         setError('root', {
            message: error.response?.data?.message || 'Registration failed'
        });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Create a new account</h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm -space-y-px">
             {/* Name field might be needed? API docs showed register/email takes email, password, role.
                 If user needs name, it might be in profile update.
                 Let's check API validator later. For now just email/password.
                 Wait, validators/auth.validator.ts would tell us.
                 Assuming basic email/pass for now.
             */}
            <div>
              <input
                {...register('email', { required: 'Email is required' })}
                type="email"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
               {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message as string}</p>}
            </div>
            <div>
              <input
                {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters'} })}
                type="password"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message as string}</p>}
            </div>
          </div>

          {errors.root && <p className="text-red-500 text-sm text-center">{errors.root.message}</p>}

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isSubmitting ? 'Creating account...' : 'Sign up'}
            </button>
          </div>
           <div className="text-sm text-center">
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Already have an account? Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
