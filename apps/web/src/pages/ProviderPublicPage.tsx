import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
// import { api } from '../lib/api';
import type { ProviderProfile } from '../types';
import { Phone, Mail, MapPin } from 'lucide-react';
import { MOCK_PROFILE } from '../data/mock';

export const ProviderPublicPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [provider, setProvider] = useState<ProviderProfile | null>(null);
  
  const { register, handleSubmit, reset, formState: { errors, isSubmitting, isSubmitSuccessful } } = useForm();

  useEffect(() => {
    if (slug) {
      fetchProvider();
    }
  }, [slug]);

  const fetchProvider = async () => {
    try {
      // const response = await api.get(`/providers/slug/${slug}`);
      // setProvider(response.data.data);
      
      // Mock fetch
      await new Promise(resolve => setTimeout(resolve, 500));
      // In real app we'd use slug to find correct profile, here just return the mock one
      setProvider(MOCK_PROFILE);
    } catch (error) {
      console.error('Failed to fetch provider', error);
    }
  };

  const onInquirySubmit = async (data: any) => {
    if (!provider) return;
    try {
      // await api.post('/inquiries', {
      //   providerId: provider.id,
      //   ...data
      // });
      
      // Mock submit
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Sent inquiry:', data);

      reset();
      // alert('Inquiry sent successfully!'); // Alert handled by UI state isSubmitSuccessful if we want, but form logic handles it
      // Actually isSubmitSuccessful is from useForm, but we need to ensure the async action completed without error.
      // The original code used alert, let's keep it or just rely on the UI message below form
      // The UI below shows success message if isSubmitSuccessful is true. 
      // However, RHF sets isSubmitSuccessful to true only if onSubmit returns successfully (promise resolves).
      // So we are good.
      
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to send inquiry');
    }
  };

  if (!provider) return <div className="text-center py-12">Loading or Provider not found...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6">
            <h1 className="text-3xl font-bold text-gray-900">{provider.businessName}</h1>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">{provider.serviceType}</p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">About</dt>
                <dd className="mt-1 text-sm text-gray-900">{provider.description}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500 flex items-center"><Phone className="h-4 w-4 mr-2"/> Phone</dt>
                <dd className="mt-1 text-sm text-gray-900">{provider.phone}</dd>
              </div>
              <div className="sm:col-span-1">
                 <dt className="text-sm font-medium text-gray-500 flex items-center"><Mail className="h-4 w-4 mr-2"/> Email</dt>
                <dd className="mt-1 text-sm text-gray-900">{provider.email}</dd>
              </div>
              {provider.address && (
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500 flex items-center"><MapPin className="h-4 w-4 mr-2"/> Address</dt>
                    <dd className="mt-1 text-sm text-gray-900">{provider.address}</dd>
                  </div>
              )}
            </dl>
          </div>
        </div>

        {/* Inquiry Form */}
        <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Send an Inquiry</h3>
                <p className="mt-1 text-sm text-gray-500">Interested in our services? Send us a message.</p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                {isSubmitSuccessful ? (
                    <div className="text-green-600 font-medium text-center">Message sent successfully! We'll get back to you soon.</div>
                ) : (
                    <form onSubmit={handleSubmit(onInquirySubmit)} className="grid grid-cols-1 gap-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Your Name</label>
                            <input
                                {...register('customerName', { required: 'Name is required' })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                            />
                             {errors.customerName && <p className="text-red-500 text-xs mt-1">{errors.customerName.message as string}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Your Phone</label>
                            <input
                                {...register('customerPhone', { required: 'Phone is required' })}
                                type="tel"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                            />
                            {errors.customerPhone && <p className="text-red-500 text-xs mt-1">{errors.customerPhone.message as string}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Your Email (Optional)</label>
                            <input
                                {...register('customerEmail')}
                                type="email"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Message</label>
                            <textarea
                                {...register('message', { required: 'Message is required' })}
                                rows={4}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                            />
                             {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message as string}</p>}
                        </div>
                        <div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                            >
                                {isSubmitting ? 'Sending...' : 'Send Message'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};
