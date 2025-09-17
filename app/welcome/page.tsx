'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Shield, Globe, Mail, ArrowRight, Plus, CheckCircle, AlertTriangle, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DynamicSidebarLayout } from '@/components/dynamic-sidebar-layout';
import { pageStyles } from '@/lib/styles';

export default function WelcomePage() {
  const [selectedMenu, setSelectedMenu] = useState('dashboard');

  return (
    <DynamicSidebarLayout
      activeItem={selectedMenu}
      onMenuSelect={setSelectedMenu}
    >
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-7xl">
        {/* Header */}
        <div className={pageStyles.header.container}>
          <div className={pageStyles.header.withIcon.container}>
            <Shield className={pageStyles.header.withIcon.icon} />
            <h1 className={pageStyles.header.title}>
              Welcome to LeakJar
            </h1>
          </div>
          <p className={pageStyles.header.description}>
            Your comprehensive data breach monitoring solution. Start protecting your digital assets today.
          </p>
        </div>

        {/* Getting Started Card */}
        <div className="bg-white shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Get Started</h2>
            <span className="bg-gray-100 text-gray-700 px-3 py-1 text-sm">
              No domains registered
            </span>
          </div>

          <p className="text-gray-600 mb-6">
            To begin monitoring data breaches, you need to register at least one domain or email address.
          </p>

          <Link href="/settings/domains">
            <Button className="bg-gray-700 hover:bg-gray-800 text-white px-6 py-3 text-lg">
              <Plus className="h-5 w-5 mr-2" />
              Add Your First Domain
            </Button>
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 shadow-sm border border-gray-200">
            <Globe className="h-10 w-10 text-gray-600 mb-4" />
            <h3 className="text-lg font-semibold mb-2">URL Monitoring</h3>
            <p className="text-gray-600 text-sm">
              Monitor your web domains for any data breaches and unauthorized access attempts.
            </p>
          </div>

          <div className="bg-white p-6 shadow-sm border border-gray-200">
            <Mail className="h-10 w-10 text-gray-600 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Email Protection</h3>
            <p className="text-gray-600 text-sm">
              Track email addresses associated with your organization for potential exposures.
            </p>
          </div>

          <div className="bg-white p-6 shadow-sm border border-gray-200">
            <AlertTriangle className="h-10 w-10 text-gray-600 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Real-time Alerts</h3>
            <p className="text-gray-600 text-sm">
              Get instant notifications when new breaches involving your domains are detected.
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">How It Works</h2>

          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-gray-100 flex items-center justify-center text-gray-700 font-semibold">
                  1
                </div>
              </div>
              <div className="ml-4">
                <h4 className="font-medium text-gray-900">Register Your Domains</h4>
                <p className="text-gray-600 text-sm mt-1">
                  Add the domains and email addresses you want to monitor
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-gray-100 flex items-center justify-center text-gray-700 font-semibold">
                  2
                </div>
              </div>
              <div className="ml-4">
                <h4 className="font-medium text-gray-900">Continuous Monitoring</h4>
                <p className="text-gray-600 text-sm mt-1">
                  Our system continuously scans for data breaches across the web
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-gray-100 flex items-center justify-center text-gray-700 font-semibold">
                  3
                </div>
              </div>
              <div className="ml-4">
                <h4 className="font-medium text-gray-900">View Analytics</h4>
                <p className="text-gray-600 text-sm mt-1">
                  Access detailed analytics and trends about detected breaches
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-gray-100 flex items-center justify-center text-gray-700 font-semibold">
                  4
                </div>
              </div>
              <div className="ml-4">
                <h4 className="font-medium text-gray-900">Take Action</h4>
                <p className="text-gray-600 text-sm mt-1">
                  Respond quickly to breaches with actionable insights
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-12">
          <p className="text-gray-600 mb-4 text-lg">
            Ready to secure your digital presence?
          </p>
          <div className="flex gap-4">
            <Link href="/settings/domains">
              <Button className="bg-gray-700 hover:bg-gray-800 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add Domain
              </Button>
            </Link>
            <Link href="/settings">
              <Button variant="outline" className="border-gray-300">
                <ArrowRight className="h-4 w-4 mr-2" />
                Go to Settings
              </Button>
            </Link>
          </div>
        </div>
        </div>
      </div>
    </DynamicSidebarLayout>
  );
}