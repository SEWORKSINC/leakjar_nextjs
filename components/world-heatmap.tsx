'use client';

import { useEffect, useState } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup
} from 'react-simple-maps';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface WorldHeatmapProps {
  countryStats: any[];
}

export function WorldHeatmap({ countryStats }: WorldHeatmapProps) {
  const [tooltip, setTooltip] = useState<{ content: string; x: number; y: number } | null>(null);

  // Create a map for quick lookup
  const countryDataMap = new Map();
  const maxCount = Math.max(...countryStats.map(c => c.count), 1);

  countryStats.forEach(stat => {
    // Skip numeric country codes and empty values
    if (!stat.code || /^\d+$/.test(stat.code)) {
      return;
    }

    const dataObj = {
      count: stat.count,
      percentage: stat.percentage,
      name: stat.country
    };

    // Map country codes to ISO A3 codes for the map
    const isoA3 = getISO3Code(stat.code);
    countryDataMap.set(isoA3, dataObj);

    // Also set by country name for fallback
    countryDataMap.set(stat.country, dataObj);

    // Also set by ISO2 code in various formats
    countryDataMap.set(stat.code, dataObj);
    countryDataMap.set(stat.code.toUpperCase(), dataObj);
    countryDataMap.set(stat.code.toLowerCase(), dataObj);

    // Map common country names that might appear in the geo data
    const countryNameMap: { [key: string]: string } = {
      'IN': 'India',
      'BR': 'Brazil',
      'ID': 'Indonesia',
      'AR': 'Argentina',
      'VN': 'Vietnam',
      'EG': 'Egypt',
      'PH': 'Philippines',
      'PK': 'Pakistan',
      'US': 'United States of America',
      'ES': 'Spain',
      'MX': 'Mexico',
      'TH': 'Thailand',
      'BD': 'Bangladesh',
      'CO': 'Colombia',
      'FR': 'France',
      'PE': 'Peru',
      'TR': 'Turkey',
      'IT': 'Italy',
      'ZA': 'South Africa',
      'KE': 'Kenya',
      'CL': 'Chile',
      'GB': 'United Kingdom',
      'DZ': 'Algeria',
      'LK': 'Sri Lanka',
      'MA': 'Morocco',
      'RO': 'Romania',
      'NG': 'Nigeria',
      'SA': 'Saudi Arabia',
      'MY': 'Malaysia',
      'DE': 'Germany',
      'PT': 'Portugal',
      'DO': 'Dominican Republic',
      'PL': 'Poland'
    };

    const fullName = countryNameMap[stat.code.toUpperCase()];
    if (fullName) {
      countryDataMap.set(fullName, dataObj);
    }
  });

  console.log('Country data map size:', countryDataMap.size);
  console.log('Sample entries:', Array.from(countryDataMap.entries()).slice(0, 10));
  console.log('Country stats input:', countryStats.slice(0, 5));

  const getColor = (count: number) => {
    if (!count) return '#F3F4F6';
    const intensity = count / maxCount;

    if (intensity > 0.8) return '#1E40AF';
    if (intensity > 0.6) return '#2563EB';
    if (intensity > 0.4) return '#3B82F6';
    if (intensity > 0.2) return '#60A5FA';
    if (intensity > 0.1) return '#93C5FD';
    return '#DBEAFE';
  };

  // Function to get flag emoji from country code
  const getFlagEmoji = (countryCode: string): string => {
    if (!countryCode || countryCode.length !== 2) return '🏳️';
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  };

  return (
    <div className="flex gap-4">
      <div className="flex-1">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            scale: 90,
            center: [80, 50]
          }}
          height={350}
        >
        <ZoomableGroup>
          <Geographies geography={geoUrl}>
            {({ geographies }) => {
              // Log first geography to see structure
              if (geographies.length > 0 && !(window as any).geoLogged) {
                console.log('First geography properties:', geographies[0].properties);
                console.log('First geography id:', geographies[0].id);
                (window as any).geoLogged = true;
              }

              return geographies.map((geo, index) => {
                // Try multiple property names to find country data
                const props = geo.properties;

                const possibleKeys = [
                  props.ISO_A3,
                  props.ADM0_A3,
                  props.ISO_A2,
                  props.ISO_A2_EH,
                  props.NAME,
                  props.NAME_EN,
                  props.NAME_LONG,
                  props.ADMIN,
                  props.name,
                  geo.id,
                  geo.rsmKey
                ].filter(Boolean);

                let data = null;
                let matchedKey = null;
                for (const key of possibleKeys) {
                  data = countryDataMap.get(key);
                  if (data) {
                    matchedKey = key;
                    break;
                  }
                }

                // Log matches for debugging
                if (data && !(window as any).matchesLogged) {
                  console.log(`Matched ${matchedKey} -> ${data.name}: ${data.count}`);
                  if (index > 5) (window as any).matchesLogged = true;
                }

                const fillColor = data ? getColor(data.count) : '#F3F4F6';

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={fillColor}
                    stroke="#E5E7EB"
                    strokeWidth={0.5}
                    style={{
                      default: { outline: 'none' },
                      hover: { outline: 'none', fill: data ? '#1E40AF' : '#E5E7EB' },
                      pressed: { outline: 'none' }
                    }}
                    onMouseEnter={(evt) => {
                      if (data) {
                        setTooltip({
                          content: `${data.name}: ${data.count.toLocaleString()} (${data.percentage}%)`,
                          x: evt.clientX,
                          y: evt.clientY
                        });
                      }
                    }}
                    onMouseLeave={() => {
                      setTooltip(null);
                    }}
                  />
                );
              });
            }}
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>

        {tooltip && (
          <div
            className="fixed px-2 py-1 bg-gray-900 text-white text-xs rounded pointer-events-none z-50"
            style={{
              left: tooltip.x + 10,
              top: tooltip.y - 30
            }}
          >
            {tooltip.content}
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-gray-500 mt-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: '#F3F4F6' }}></div>
              <span>No Data</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: '#DBEAFE' }}></div>
              <span>Low</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: '#3B82F6' }}></div>
              <span>Medium</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: '#1E40AF' }}></div>
              <span>High</span>
            </div>
          </div>
          <span className="text-gray-400">
            Data from {countryStats.length} countries
          </span>
        </div>
      </div>

      {/* Country Ranking List */}
      <div className="w-96">
        <div className="bg-white rounded-lg border p-4">
          <h3 className="text-sm font-semibold mb-3">Top Countries by Breaches</h3>
          <div className="overflow-y-auto max-h-[400px]">
            <table className="w-full text-xs">
              <thead className="sticky top-0 bg-white border-b">
                <tr className="text-left text-gray-600">
                  <th className="py-2 pr-2">#</th>
                  <th className="py-2 px-2">Flag</th>
                  <th className="py-2 px-2">Country</th>
                  <th className="py-2 px-2">Code</th>
                  <th className="py-2 px-2 text-right">Count</th>
                  <th className="py-2 pl-2 text-right">%</th>
                </tr>
              </thead>
              <tbody>
                {countryStats
                  .filter(stat => stat.code && !/^\d+$/.test(stat.code))
                  .map((stat, index) => (
                    <tr key={stat.code} className="border-b hover:bg-gray-50">
                      <td className="py-2 pr-2 text-gray-500">{index + 1}</td>
                      <td className="py-2 px-2 text-lg">{getFlagEmoji(stat.code)}</td>
                      <td className="py-2 px-2 font-medium">{stat.country}</td>
                      <td className="py-2 px-2 text-gray-600">{stat.code}</td>
                      <td className="py-2 px-2 text-right font-medium">
                        {stat.count.toLocaleString()}
                      </td>
                      <td className="py-2 pl-2 text-right text-gray-600">
                        {stat.percentage}%
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function to convert ISO2 to ISO3 codes
function getISO3Code(iso2: string): string {
  const isoMap: { [key: string]: string } = {
    'US': 'USA',
    'GB': 'GBR',
    'CA': 'CAN',
    'DE': 'DEU',
    'FR': 'FRA',
    'JP': 'JPN',
    'CN': 'CHN',
    'IN': 'IND',
    'BR': 'BRA',
    'RU': 'RUS',
    'AU': 'AUS',
    'ES': 'ESP',
    'IT': 'ITA',
    'MX': 'MEX',
    'KR': 'KOR',
    'NL': 'NLD',
    'TR': 'TUR',
    'SA': 'SAU',
    'CH': 'CHE',
    'PL': 'POL',
    'BE': 'BEL',
    'SE': 'SWE',
    'AR': 'ARG',
    'NO': 'NOR',
    'AT': 'AUT',
    'AE': 'ARE',
    'DK': 'DNK',
    'SG': 'SGP',
    'MY': 'MYS',
    'IL': 'ISR',
    'HK': 'HKG',
    'EG': 'EGY',
    'PH': 'PHL',
    'FI': 'FIN',
    'CL': 'CHL',
    'PK': 'PAK',
    'GR': 'GRC',
    'PT': 'PRT',
    'VN': 'VNM',
    'ID': 'IDN',
    'TH': 'THA',
    'IE': 'IRL',
    'CZ': 'CZE',
    'NZ': 'NZL',
    'RO': 'ROU',
    'HU': 'HUN',
    'CO': 'COL',
    'UA': 'UKR',
    'ZA': 'ZAF',
    'BD': 'BGD',
    'PE': 'PER',
    'KE': 'KEN',
    'DZ': 'DZA',
    'LK': 'LKA',
    'MA': 'MAR',
    'NG': 'NGA',
    'DO': 'DOM',
    'EC': 'ECU',
    'GT': 'GTM',
    'VE': 'VEN',
    'BO': 'BOL',
    'HN': 'HND',
    'PY': 'PRY',
    'SV': 'SLV',
    'NI': 'NIC',
    'CR': 'CRI',
    'PA': 'PAN',
    'UY': 'URY',
    'JM': 'JAM',
    'TT': 'TTO',
    'UN': 'USA'  // Default UN to USA as fallback
  };

  return isoMap[iso2.toUpperCase()] || iso2;
}