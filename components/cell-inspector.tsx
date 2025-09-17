'use client';

import { X, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface CellInspectorProps {
  data: any;
  columnKey: string;
  onClose: () => void;
  showDebug?: boolean;
}

export function CellInspector({ data, columnKey, onClose, showDebug = false }: CellInspectorProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (value: string, field: string) => {
    navigator.clipboard.writeText(value || '');
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const formatValue = (value: any, key?: string) => {
    if (value === null || value === undefined || value === '') {
      return '<empty>';
    }

    // Special formatting for password field
    if (key === 'pw' && value === '[NOT_SAVED]') {
      return 'Compromised';
    }

    // Special formatting for country field
    if (key === 'country' && value) {
      const countryNames: { [key: string]: string } = {
        'US': 'United States',
        'USA': 'United States',
        'UK': 'United Kingdom',
        'GB': 'United Kingdom',
        'DE': 'Germany',
        'FR': 'France',
        'CA': 'Canada',
        'AU': 'Australia',
        'JP': 'Japan',
        'CN': 'China',
        'KR': 'South Korea',
        'IN': 'India',
        'BR': 'Brazil',
        'MX': 'Mexico',
        'ES': 'Spain',
        'IT': 'Italy',
        'NL': 'Netherlands',
        'RU': 'Russia',
        'CH': 'Switzerland',
        'SE': 'Sweden',
        'NO': 'Norway',
        'DK': 'Denmark',
        'FI': 'Finland',
        'PL': 'Poland',
        'TR': 'Turkey',
        'SA': 'Saudi Arabia',
        'AE': 'United Arab Emirates',
        'IL': 'Israel',
        'SG': 'Singapore',
        'HK': 'Hong Kong',
        'TW': 'Taiwan',
        'TH': 'Thailand',
        'VN': 'Vietnam',
        'ID': 'Indonesia',
        'MY': 'Malaysia',
        'PH': 'Philippines',
        'NZ': 'New Zealand',
        'AR': 'Argentina',
        'CL': 'Chile',
        'CO': 'Colombia',
        'PE': 'Peru',
        'VE': 'Venezuela',
        'EG': 'Egypt',
        'ZA': 'South Africa',
        'NG': 'Nigeria',
        'KE': 'Kenya',
        'MA': 'Morocco',
        'UA': 'Ukraine',
        'BE': 'Belgium',
        'AT': 'Austria',
        'CZ': 'Czech Republic',
        'HU': 'Hungary',
        'RO': 'Romania',
        'BG': 'Bulgaria',
        'GR': 'Greece',
        'PT': 'Portugal',
        'IE': 'Ireland',
        'PK': 'Pakistan',
        'BD': 'Bangladesh',
        'LK': 'Sri Lanka',
        'NP': 'Nepal',
        'MM': 'Myanmar',
        'KH': 'Cambodia',
        'LA': 'Laos',
        'JO': 'Jordan',
        'LB': 'Lebanon',
        'IQ': 'Iraq',
        'IR': 'Iran',
        'QA': 'Qatar',
        'KW': 'Kuwait',
        'OM': 'Oman',
        'YE': 'Yemen',
        'SY': 'Syria',
        'AF': 'Afghanistan',
        'UZ': 'Uzbekistan',
        'KZ': 'Kazakhstan',
        'TM': 'Turkmenistan',
        'AZ': 'Azerbaijan',
        'GE': 'Georgia',
        'AM': 'Armenia',
        'BY': 'Belarus',
        'MD': 'Moldova',
        'LT': 'Lithuania',
        'LV': 'Latvia',
        'EE': 'Estonia',
        'SK': 'Slovakia',
        'SI': 'Slovenia',
        'HR': 'Croatia',
        'BA': 'Bosnia and Herzegovina',
        'RS': 'Serbia',
        'ME': 'Montenegro',
        'MK': 'North Macedonia',
        'AL': 'Albania',
        'XK': 'Kosovo',
        'IS': 'Iceland',
        'LU': 'Luxembourg',
        'MT': 'Malta',
        'CY': 'Cyprus',
      };
      
      const upperValue = String(value).toUpperCase();
      const countryName = countryNames[upperValue];
      
      if (countryName) {
        return `${value} (${countryName})`;
      }
    }
    
    return String(value);
  };

  const getFieldLabel = (key: string) => {
    const labels: { [key: string]: string } = {
      date_collected: 'Date Collected',
      ip: 'IP Address',
      country: 'Country',
      pc_name: 'PC Name',
      user_name: 'User Name',
      url: 'URL',
      id: 'ID',
      pw: 'Password',
      browser: 'Browser',
      main_domain: 'Main Domain',
      main_email: 'Main Email',
      type: 'Type'
    };
    return labels[key] || key;
  };

  return (
    <div className="w-96 bg-white border-l shadow-xl flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">Row Details</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex-1 p-4">
        <div className="space-y-4">
          {/* Selected Cell */}
          <div className="bg-gray-100 border border-gray-300 rounded-lg px-3 py-2">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-900">
                {getFieldLabel(columnKey)}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCopy(data[columnKey], columnKey)}
                className="h-8 px-2"
              >
                {copiedField === columnKey ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <div className="text-sm text-gray-800 break-all font-mono">
              {formatValue(data[columnKey], columnKey)}
            </div>
          </div>

          {/* All Row Data */}
          <div>
            <h3 className="text-sm font-semibold text-gray-600 mb-3">
              Complete Row Data
            </h3>
            <div className="space-y-1">
              {Object.entries(data).filter(([key, value]) => {
                // Hide debug fields unless showDebug is true
                if (!showDebug && (key === 'main_domain' || key === 'main_email')) {
                  return false;
                }
                return true;
              }).map(([key, value]) => (
                <div
                  key={key}
                  className={`p-1 ${
                    key === columnKey ? 'bg-gray-100' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-medium text-gray-600">
                      {getFieldLabel(key)}
                    </label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(String(value || ''), key)}
                      className="h-6 px-1"
                    >
                      {copiedField === key ? (
                        <Check className="h-3 w-3 text-green-600" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                  <div className="text-sm text-gray-800 break-all font-mono">
                    {formatValue(value, key)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Copy All Button */}
          <div className="pt-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                const allData = Object.entries(data)
                  .map(([key, value]) => `${getFieldLabel(key)}: ${value || ''}`)
                  .join('\n');
                handleCopy(allData, 'all');
              }}
            >
              {copiedField === 'all' ? (
                <>
                  <Check className="h-4 w-4 mr-2 text-green-600" />
                  Copied All!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy All Data
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}