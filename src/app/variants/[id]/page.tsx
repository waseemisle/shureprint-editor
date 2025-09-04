'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Variant, PriceTier } from '@/types';
import { getVariantDisplayString } from '@/lib/utils';

interface PriceTierFormData {
  minQty: string;
  price: string;
}

export default function VariantDetail() {
  const params = useParams();
  const [variant, setVariant] = useState<Variant | null>(null);
  const [priceTiers, setPriceTiers] = useState<PriceTier[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingTier, setEditingTier] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<PriceTierFormData>({ minQty: '', price: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (params.id) {
      fetchVariantAndTiers(params.id as string);
    }
  }, [params.id]);

  const fetchVariantAndTiers = async (variantId: string) => {
    try {
      const [variantResponse, tiersResponse] = await Promise.all([
        fetch(`/api/variants/${variantId}`),
        fetch(`/api/price-tiers?variantId=${variantId}`)
      ]);

      const variantData = await variantResponse.json();
      const tiersData = await tiersResponse.json();

      setVariant(variantData);
      setPriceTiers(tiersData);
    } catch (error) {
      console.error('Failed to fetch variant data:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    const minQty = parseInt(formData.minQty);
    const price = parseFloat(formData.price);

    if (!formData.minQty || isNaN(minQty) || minQty < 1) {
      newErrors.minQty = 'Minimum quantity must be an integer >= 1';
    }

    if (!formData.price || isNaN(price) || price <= 0) {
      newErrors.price = 'Price must be > 0';
    }

    // Check for duplicate minQty
    if (!newErrors.minQty) {
      const existingTier = priceTiers.find(tier => 
        tier.minQty === minQty && tier.id !== editingTier
      );
      if (existingTier) {
        newErrors.minQty = 'A price tier with this minimum quantity already exists';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setSaving(true);
    try {
      const minQty = parseInt(formData.minQty);
      const price = parseFloat(formData.price);

      if (editingTier) {
        // Update existing tier
        const response = await fetch('/api/price-tiers', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingTier,
            minQty,
            price
          })
        });

        if (!response.ok) {
          throw new Error('Failed to update price tier');
        }
      } else {
        // Create new tier
        const response = await fetch('/api/price-tiers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            variantId: params.id,
            minQty,
            price
          })
        });

        if (!response.ok) {
          throw new Error('Failed to create price tier');
        }
      }

      // Refresh data
      await fetchVariantAndTiers(params.id as string);
      
      // Reset form
      setFormData({ minQty: '', price: '' });
      setEditingTier(null);
      setShowAddForm(false);
      setErrors({});
      setMessage({ type: 'success', text: editingTier ? 'Price tier updated successfully!' : 'Price tier created successfully!' });
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save price tier. Please try again.' });
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (tier: PriceTier) => {
    setEditingTier(tier.id);
    setFormData({
      minQty: tier.minQty.toString(),
      price: tier.price.toString()
    });
    setShowAddForm(true);
    setErrors({});
  };

  const handleDelete = async (tierId: string) => {
    if (!confirm('Are you sure you want to delete this price tier?')) return;

    try {
      const response = await fetch(`/api/price-tiers?id=${tierId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete price tier');
      }

      await fetchVariantAndTiers(params.id as string);
      setMessage({ type: 'success', text: 'Price tier deleted successfully!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete price tier. Please try again.' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleCancel = () => {
    setFormData({ minQty: '', price: '' });
    setEditingTier(null);
    setShowAddForm(false);
    setErrors({});
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading variant...</p>
        </div>
      </div>
    );
  }

  if (!variant) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">❌</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Variant not found</h3>
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Back to products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            ← Back to Products
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {getVariantDisplayString(variant)}
          </h1>
          <p className="text-gray-600">
            SKU: {variant.sku}
          </p>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-md ${
            message.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-800' 
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            {message.text}
          </div>
        )}

        {/* Price Tiers */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Price Tiers
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Manage quantity-based pricing for this variant
              </p>
            </div>
            {!showAddForm && (
              <button
                onClick={() => setShowAddForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Add Price Tier
              </button>
            )}
          </div>

          {/* Add/Edit Form */}
          {showAddForm && (
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h3 className="text-md font-medium text-gray-900 mb-4">
                {editingTier ? 'Edit Price Tier' : 'Add New Price Tier'}
              </h3>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="minQty" className="block text-sm font-medium text-gray-700 mb-1">
                    Minimum Quantity
                  </label>
                  <input
                    id="minQty"
                    type="number"
                    min="1"
                    value={formData.minQty}
                    onChange={(e) => setFormData({ ...formData, minQty: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.minQty ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="e.g., 1000"
                  />
                  {errors.minQty && (
                    <p className="mt-1 text-sm text-red-600">{errors.minQty}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                    Price ($)
                  </label>
                  <input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.price ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="e.g., 0.22"
                  />
                  {errors.price && (
                    <p className="mt-1 text-sm text-red-600">{errors.price}</p>
                  )}
                </div>
                <div className="flex items-end space-x-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? 'Saving...' : (editingTier ? 'Update' : 'Add')}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Price Tiers Table */}
          <div className="overflow-x-auto">
            {priceTiers.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Min Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {priceTiers.map((tier) => (
                    <tr key={tier.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {tier.minQty.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${tier.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleEdit(tier)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(tier.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="px-6 py-8 text-center">
                <div className="text-gray-400 text-4xl mb-2">💰</div>
                <p className="text-gray-600">No price tiers configured for this variant.</p>
                <p className="text-sm text-gray-500 mt-1">Add your first price tier to get started.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
