import React, { useEffect, useState } from 'react';
// import { api } from '../../lib/api';
import type { Inquiry, InquiryStats } from '../../types';
import { MOCK_INQUIRIES, MOCK_STATS } from '../../data/mock';

export const InquiriesPage: React.FC = () => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [stats, setStats] = useState<InquiryStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      /*
      const [inquiriesRes, statsRes] = await Promise.all([
        api.get('/inquiries'),
        api.get('/inquiries/stats')
      ]);
      setInquiries(inquiriesRes.data.data);
      setStats(statsRes.data.data);
      */
     
      // Mock fetch
      await new Promise(resolve => setTimeout(resolve, 500));
      setInquiries(MOCK_INQUIRIES);
      setStats(MOCK_STATS);
    } catch (error) {
      console.error('Failed to fetch inquiries', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
      try {
          // await api.put(`/inquiries/${id}/status`, { status });
          
          // Mock update
          await new Promise(resolve => setTimeout(resolve, 500));
          setInquiries(inquiries.map(i => i.id === id ? { ...i, status: status as any } : i));
          
          // fetchData(); // Refresh list
      } catch (error) {
          console.error("Failed to update status", error);
      }
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Inquiries</h1>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-4 rounded-lg shadow text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                <div className="text-sm text-gray-500">Total</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow text-center">
                <div className="text-2xl font-bold text-green-600">{stats.new}</div>
                <div className="text-sm text-gray-500">New</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow text-center">
                <div className="text-2xl font-bold text-yellow-600">{stats.contacted}</div>
                <div className="text-sm text-gray-500">Contacted</div>
            </div>
             <div className="bg-white p-4 rounded-lg shadow text-center">
                <div className="text-2xl font-bold text-purple-600">{stats.conversionRate}%</div>
                <div className="text-sm text-gray-500">Conversion Rate</div>
            </div>
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {inquiries.map((inquiry) => (
            <li key={inquiry.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-blue-600 truncate">{inquiry.customerName}</p>
                  <div className="ml-2 flex-shrink-0 flex">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${inquiry.status === 'NEW' ? 'bg-green-100 text-green-800' :
                          inquiry.status === 'CONTACTED' ? 'bg-yellow-100 text-yellow-800' :
                          inquiry.status === 'CONVERTED' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                      {inquiry.status}
                    </span>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500">
                      {inquiry.message}
                    </p>
                  </div>
                </div>
                <div className="mt-2 text-sm text-gray-500">
                    <p>Phone: {inquiry.customerPhone}</p>
                    {inquiry.customerEmail && <p>Email: {inquiry.customerEmail}</p>}
                </div>
                 <div className="mt-4 flex gap-2">
                    {inquiry.status === 'NEW' && (
                        <button onClick={() => updateStatus(inquiry.id, 'CONTACTED')} className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded hover:bg-yellow-200">Mark Contacted</button>
                    )}
                     {inquiry.status === 'CONTACTED' && (
                        <button onClick={() => updateStatus(inquiry.id, 'CONVERTED')} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200">Mark Converted</button>
                    )}
                 </div>
              </div>
            </li>
          ))}
          {inquiries.length === 0 && (
             <div className="p-4 text-center text-gray-500">No inquiries yet.</div>
          )}
        </ul>
      </div>
    </div>
  );
};
