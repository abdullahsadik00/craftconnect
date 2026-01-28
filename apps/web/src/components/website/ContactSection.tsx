import React from 'react';
import { useForm } from 'react-hook-form';
import type { ProviderProfile, TemplateId, ThemeId } from '../../types';
import { getTheme } from '../../lib/themes';

interface ContactSectionProps {
  profile: ProviderProfile;
  templateId: TemplateId;
  themeId: ThemeId;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ profile, themeId }) => {
  const theme = getTheme(themeId);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting, isSubmitSuccessful } } = useForm();

  const onSubmit = async (data: any) => {
    try {
      // Mock submit
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Sent inquiry to ' + profile.businessName, data);
      reset();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={`${theme.secondary} py-20 px-4 sm:px-6 lg:px-8`} id="contact">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className={`p-8 md:p-12 ${theme.primary} text-white text-center`}>
            <h2 className="text-3xl font-bold mb-4">Get In Touch</h2>
            <p className="opacity-90">Ready to start your project? Contact us today.</p>
        </div>

        <div className="p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div>
                    <h3 className={`text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1`}>Phone</h3>
                    <p className={`text-lg font-medium text-gray-900`}>{profile.phone}</p>
                </div>
                <div>
                    <h3 className={`text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1`}>Email</h3>
                    <p className={`text-lg font-medium text-gray-900`}>{profile.email}</p>
                </div>
                {profile.address && (
                    <div className="col-span-full">
                        <h3 className={`text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1`}>Address</h3>
                        <p className={`text-lg font-medium text-gray-900`}>{profile.address}</p>
                    </div>
                )}
            </div>

            {isSubmitSuccessful ? (
                <div className={`bg-green-50 p-4 rounded-md text-green-700 text-center`}>
                    Thank you! Your message has been sent. We will get back to you shortly.
                </div>
            ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            {...register('customerName', { required: 'Name is required' })}
                            type="text"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-3"
                        />
                        {errors.customerName && <p className="text-red-500 text-xs mt-1">{errors.customerName.message as string}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                        <input
                            {...register('customerPhone', { required: 'Phone is required' })}
                            type="tel"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-3"
                        />
                         {errors.customerPhone && <p className="text-red-500 text-xs mt-1">{errors.customerPhone.message as string}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Message</label>
                        <textarea
                            {...register('message', { required: 'Message is required' })}
                            rows={4}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-3"
                        ></textarea>
                         {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message as string}</p>}
                    </div>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full ${theme.primary} text-white py-3 px-4 rounded-md hover:opacity-90 transition-opacity font-medium disabled:opacity-50`}
                    >
                        {isSubmitting ? 'Sending...' : 'Send Message'}
                    </button>
                </form>
            )}
        </div>
      </div>
    </div>
  );
};
