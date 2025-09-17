'use client';

import { ResizableDataGrid } from '@/components/resizable-data-grid';
import { DynamicSidebarLayout } from '@/components/dynamic-sidebar-layout';
import { useState, use, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface PageProps {
  params: Promise<{
    domain: string;
  }>;
}

export default function EmailMonitoringPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const [selectedMenu, setSelectedMenu] = useState(`domain-${resolvedParams.domain}`);
  const [domains, setDomains] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showTip, setShowTip] = useState(true);
  const [isRestricted, setIsRestricted] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);

  const decodedDomain = decodeURIComponent(resolvedParams.domain);

  // Show warning modal when restricted access is detected
  useEffect(() => {
    if (isRestricted) {
      setShowWarningModal(true);
    }
  }, [isRestricted]);

  // If there's an error, show full screen error page without sidebar
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="max-w-lg w-full">
          <div className="bg-white shadow-xl rounded-xl p-10 text-center border border-gray-200">
            {/* Icon */}
            <div className="mb-8">
              <div className="w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Access Denied</h1>

            {/* Error Message */}
            <p className="text-gray-600 mb-10 leading-relaxed text-lg">{error}</p>

            {/* Actions */}
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => window.history.back()}
                className="px-8 py-3 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition-all duration-200 font-medium border-2 border-gray-300"
              >
                ← Go Back
              </button>
              <button
                onClick={() => setError(null)}
                className="px-8 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all duration-200 font-medium"
              >
                Retry
              </button>
            </div>

            {/* Footer */}
            <div className="mt-10 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Need help? <a href="/" className="text-gray-900 hover:underline font-medium">Return to dashboard</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <DynamicSidebarLayout
      activeItem={selectedMenu}
      onMenuSelect={setSelectedMenu}
      onDomainsLoaded={setDomains}
    >
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Email Monitoring - {decodedDomain}</h1>
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
          domain={decodedDomain}
          domainType="EMAIL"
          isDebugMode={false}
          onError={setError}
          onRestrictedAccess={setIsRestricted}
        />
      </div>

      {/* Warning Modal for Unverified Domains */}
      <Dialog open={showWarningModal} onOpenChange={setShowWarningModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-.833-2.464 0-2.464 0L4.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              Unverified Domain
            </DialogTitle>
            <DialogDescription asChild>
              <div></div>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="text-sm">
              The domain <strong>{decodedDomain}</strong> is not verified yet. Access is limited to:
            </div>
            <ul className="text-sm space-y-1 ml-4">
              <li className="flex items-center gap-2">
                <span className="text-yellow-500">•</span>
                View only first 30 records
              </li>
              <li className="flex items-center gap-2">
                <span className="text-yellow-500">•</span>
                Search functionality disabled
              </li>
              <li className="flex items-center gap-2">
                <span className="text-yellow-500">•</span>
                Pagination disabled
              </li>
            </ul>
            <div className="text-sm text-gray-600 mt-4">
              Please contact an administrator to verify your domain ownership for full access.
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DynamicSidebarLayout>
  );
}