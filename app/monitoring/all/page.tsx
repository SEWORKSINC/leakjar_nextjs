'use client';

import React, { useState } from 'react';
import { ResizableDataGrid } from '@/components/resizable-data-grid';
import { Activity } from 'lucide-react';
import { DynamicSidebarLayout } from '@/components/dynamic-sidebar-layout';
import { AdminRoute } from '@/components/AdminRoute';

export default function AllLeakedDataPage() {
  const [selectedMenu, setSelectedMenu] = useState('leaked-data');
  const [debugError, setDebugError] = useState<string | null>(null);
  const [showTip, setShowTip] = useState(true);
  const [showDebug, setShowDebug] = useState(false);

  return (
    <AdminRoute>
      <DynamicSidebarLayout
        activeItem={selectedMenu}
        onMenuSelect={setSelectedMenu}
      >
        <div className="p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <Activity className="h-6 w-6 text-gray-600" />
                <h1 className="text-2xl font-bold text-gray-900">All Leaked Data</h1>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="debugMode"
                  checked={showDebug}
                  onChange={(e) => setShowDebug(e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <label
                  htmlFor="debugMode"
                  className="text-sm font-medium text-gray-700"
                >
                  Debug Mode
                </label>
              </div>
            </div>
          </div>

          {showTip && (
            <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-gray-700">
                  <strong>Tip:</strong> Double-click any cell to view row details and copy individual elements
                </p>
              </div>
              <button
                onClick={() => setShowTip(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close tip"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          <ResizableDataGrid
            isDebugMode={true}
            showDebug={showDebug}
            onError={setDebugError}
          />
        </div>
      </DynamicSidebarLayout>
    </AdminRoute>
  );
}