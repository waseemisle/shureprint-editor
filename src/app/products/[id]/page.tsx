'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Product, Variant } from '@/types';
import { getVariantDisplayString } from '@/lib/utils';

export default function ProductDetail() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchProductAndVariants(params.id as string);
    }
  }, [params.id]);

  const fetchProductAndVariants = async (productId: string) => {
    try {
      const [productResponse, variantsResponse] = await Promise.all([
        fetch(`/api/products/${productId}`),
        fetch(`/api/variants?productId=${productId}`)
      ]);

      const productData = await productResponse.json();
      const variantsData = await variantsResponse.json();

      setProduct(productData);
      setVariants(variantsData);
    } catch (error) {
      console.error('Failed to fetch product data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">❌</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Product not found</h3>
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            ← Back to Products
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {product.name}
          </h1>
          <span className="inline-block px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full">
            {product.category}
          </span>
        </div>

        {/* Variants */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Product Variants
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Click on a variant to manage its pricing tiers
            </p>
          </div>
          
          <div className="divide-y divide-gray-200">
            {variants.length > 0 ? (
              variants.map((variant) => (
                <Link
                  key={variant.id}
                  href={`/variants/${variant.id}`}
                  className="block px-6 py-4 hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">
                        {getVariantDisplayString(variant)}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        SKU: {variant.sku}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        variant.active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {variant.active ? 'Active' : 'Inactive'}
                      </span>
                      <svg
                        className="ml-2 h-5 w-5 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="px-6 py-8 text-center">
                <div className="text-gray-400 text-4xl mb-2">📦</div>
                <p className="text-gray-600">No variants found for this product.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
