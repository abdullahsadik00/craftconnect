import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { api } from '../../lib/api';
import type { PortfolioItem } from '../../types';
import { Trash2 } from 'lucide-react';

export const PortfolioPage: React.FC = () => {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await api.get('/portfolio');
      setItems(response.data.data);
    } catch (error) {
      console.error('Failed to fetch portfolio', error);
    }
  };

  const onSubmit = async (data: any) => {
    try {
      await api.post('/portfolio', data);
      reset();
      fetchItems();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to add item');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      await api.delete(`/portfolio/${id}`);
      fetchItems();
    } catch (error) {
      console.error('Failed to delete item', error);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Portfolio</h1>

      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-lg font-medium mb-4">Add New Item</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                    {...register('title', { required: 'Title is required' })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                />
                 {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message as string}</p>}
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Image URL</label>
                <input
                    {...register('imageUrl', { required: 'Image URL is required' })}
                    placeholder="https://example.com/image.jpg"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                />
                 {errors.imageUrl && <p className="text-red-500 text-xs mt-1">{errors.imageUrl.message as string}</p>}
            </div>
            <div>
                 <label className="block text-sm font-medium text-gray-700">Category (Optional)</label>
                <input
                    {...register('category')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              Add Item
            </button>
        </form>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow overflow-hidden relative group">
                <img src={item.imageUrl} alt={item.title} className="w-full h-48 object-cover" />
                <div className="p-4">
                    <h3 className="font-medium text-gray-900">{item.title}</h3>
                    <p className="text-sm text-gray-500">{item.category}</p>
                </div>
                <button
                    onClick={() => handleDelete(item.id)}
                    className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                >
                    <Trash2 className="h-4 w-4" />
                </button>
            </div>
        ))}
        {items.length === 0 && (
            <p className="col-span-full text-center text-gray-500">No portfolio items yet.</p>
        )}
      </div>
    </div>
  );
};
