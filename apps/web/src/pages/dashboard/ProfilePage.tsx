import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
// import { api } from '../../lib/api';
import type { ProviderProfile } from '../../types';
import { MOCK_PROFILE } from '../../data/mock';

export const ProfilePage: React.FC = () => {
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<ProviderProfile>();
  const [profile, setProfile] = useState<ProviderProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      // const response = await api.get('/providers/me');
      // setProfile(response.data.data);
      // // Pre-fill form
      // const data = response.data.data;

      // Mock fetch
      await new Promise(resolve => setTimeout(resolve, 500));
      const data = MOCK_PROFILE;
      setProfile(data);

      if (data) {
        Object.keys(data).forEach((key) => {
           setValue(key as any, data[key as keyof ProviderProfile]);
        });
      }
    } catch (error) {
      // 404 means no profile yet, which is fine
      console.log('No profile found or error fetching', error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: any) => {
    try {
      /*
      if (profile) {
        await api.put('/providers/me', data);
      } else {
        await api.post('/providers', data);
      }
      */
      // Mock update
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Updated profile:', data);
      console.log('Previous profile:', profile);

      await fetchProfile();
      alert('Profile saved successfully!');
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.message || 'Failed to save profile');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Provider Profile</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded-lg shadow">
        <div>
          <label className="block text-sm font-medium text-gray-700">Business Name</label>
          <input
            {...register('businessName', { required: 'Business name is required' })}
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
          />
          {errors.businessName && <p className="text-red-500 text-xs mt-1">{errors.businessName.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Service Type</label>
          <select
             {...register('serviceType', { required: 'Service type is required' })}
             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
          >
              <option value="">Select a service type</option>
              <option value="PLUMBER">Plumber</option>
              <option value="ELECTRICIAN">Electrician</option>
              <option value="CARPENTER">Carpenter</option>
              <option value="PAINTER">Painter</option>
              <option value="CLEANER">Cleaner</option>
              <option value="OTHER">Other</option>
          </select>
           {errors.serviceType && <p className="text-red-500 text-xs mt-1">{errors.serviceType.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            {...register('description', { required: 'Description is required' })}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
          />
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
                {...register('phone', { required: 'Phone is required' })}
                type="tel"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
            </div>

            <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
                {...register('email', { required: 'Email is required' })}
                type="email"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Address (Optional)</label>
          <input
            {...register('address')}
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
          />
        </div>

        <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save Profile'}
            </button>
        </div>
      </form>
    </div>
  );
};
