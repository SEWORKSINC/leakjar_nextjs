'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Download, FileText, Database, Archive, Settings, Clock, HardDrive } from 'lucide-react';

export default function ExportSettingsPage() {
  const [exportSettings, setExportSettings] = useState({
    defaultFormat: 'csv',
    includeMetadata: true,
    compressFiles: true,
    maxFileSize: 100, // MB
    notifyOnComplete: true,
    autoDelete: 7, // days
    enableScheduled: false
  });

  const [recentExports] = useState([
    {
      id: '1',
      filename: 'domain_search_results_20240914.csv',
      format: 'CSV',
      size: '15.2 MB',
      status: 'Completed',
      createdAt: '2024-09-14 10:30',
      downloadUrl: '#'
    },
    {
      id: '2',
      filename: 'breach_analysis_20240913.json',
      format: 'JSON',
      size: '8.7 MB', 
      status: 'Completed',
      createdAt: '2024-09-13 16:45',
      downloadUrl: '#'
    },
    {
      id: '3',
      filename: 'user_data_export_20240912.xlsx',
      format: 'Excel',
      size: '42.1 MB',
      status: 'Processing',
      createdAt: '2024-09-12 14:22',
      downloadUrl: null
    }
  ]);

  const handleSettingChange = (key: string, value: any) => {
    setExportSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'text-green-600 bg-green-50';
      case 'Processing': return 'text-yellow-600 bg-yellow-50';
      case 'Failed': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Export Settings</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Configure your data export preferences and manage export history
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Export Preferences</CardTitle>
            <CardDescription>
              Set your default preferences for data exports
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="defaultFormat" className="text-base font-medium">
                Default Export Format
              </Label>
              <div className="mt-3 grid grid-cols-3 gap-3">
                {['csv', 'json', 'excel'].map((format) => (
                  <button
                    key={format}
                    onClick={() => handleSettingChange('defaultFormat', format)}
                    className={`p-3 border rounded-lg text-center transition-colors ${
                      exportSettings.defaultFormat === format
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {format === 'csv' && <FileText className="h-5 w-5 mx-auto mb-1" />}
                    {format === 'json' && <Database className="h-5 w-5 mx-auto mb-1" />}
                    {format === 'excel' && <Archive className="h-5 w-5 mx-auto mb-1" />}
                    <div className="text-sm font-medium capitalize">{format}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Include Metadata</Label>
                  <p className="text-sm text-gray-500 mt-1">
                    Add export timestamp and query info
                  </p>
                </div>
                <Switch
                  checked={exportSettings.includeMetadata}
                  onCheckedChange={(checked) => handleSettingChange('includeMetadata', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Compress Files</Label>
                  <p className="text-sm text-gray-500 mt-1">
                    Automatically zip large exports
                  </p>
                </div>
                <Switch
                  checked={exportSettings.compressFiles}
                  onCheckedChange={(checked) => handleSettingChange('compressFiles', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Email Notifications</Label>
                  <p className="text-sm text-gray-500 mt-1">
                    Notify when export is ready
                  </p>
                </div>
                <Switch
                  checked={exportSettings.notifyOnComplete}
                  onCheckedChange={(checked) => handleSettingChange('notifyOnComplete', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Scheduled Exports</Label>
                  <p className="text-sm text-gray-500 mt-1">
                    Enable automated exports
                  </p>
                </div>
                <Switch
                  checked={exportSettings.enableScheduled}
                  onCheckedChange={(checked) => handleSettingChange('enableScheduled', checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Exports</CardTitle>
            <CardDescription>
              Your export history and download links
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentExports.length === 0 ? (
              <div className="text-center py-12">
                <Download className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No exports yet</p>
                <p className="text-gray-400 text-sm mt-2">
                  Your export history will appear here
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentExports.map((exportItem) => (
                  <div
                    key={exportItem.id}
                    className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded">
                        {exportItem.format === 'CSV' && <FileText className="h-4 w-4" />}
                        {exportItem.format === 'JSON' && <Database className="h-4 w-4" />}
                        {exportItem.format === 'Excel' && <Archive className="h-4 w-4" />}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {exportItem.filename}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mt-1">
                          <span className="flex items-center gap-1">
                            <HardDrive className="h-3 w-3" />
                            {exportItem.size}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {exportItem.createdAt}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(exportItem.status)}`}>
                        {exportItem.status}
                      </span>
                      {exportItem.downloadUrl && exportItem.status === 'Completed' && (
                        <Button size="sm" variant="outline">
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Export Limits & Guidelines</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
            <p>
              • Maximum export size: 500MB per request (pro accounts: 2GB)
            </p>
            <p>
              • Exports are automatically deleted after 30 days
            </p>
            <p>
              • Large exports are automatically compressed to save bandwidth
            </p>
            <p>
              • You can have up to 5 concurrent export jobs
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}