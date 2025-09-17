import { useState } from 'react';
import ReactCountryFlag from 'react-country-flag';

interface CountryFlagProps {
  countryCode: string;
  className?: string;
}

// Map common country names to ISO codes
// ISO 국가 코드를 국가 이름으로 매핑
export const countryNameMap: { [key: string]: string } = {
  'NU': 'Niue',
  'US': 'United States',
  'CN': 'China',
  'JP': 'Japan',
  'KR': 'South Korea',
  'GB': 'United Kingdom',
  'FR': 'France',
  'DE': 'Germany',
  'IT': 'Italy',
  'ES': 'Spain',
  'RU': 'Russia',
  'BR': 'Brazil',
  'IN': 'India',
  'AU': 'Australia',
  'CA': 'Canada',
  'MX': 'Mexico',
  'NL': 'Netherlands',
  'SE': 'Sweden',
  'NO': 'Norway',
  'FI': 'Finland',
  'DK': 'Denmark',
  'PL': 'Poland',
  'UA': 'Ukraine',
  'TH': 'Thailand',
  'VN': 'Vietnam',
  'SG': 'Singapore',
  'MY': 'Malaysia',
  'ID': 'Indonesia',
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
  'IL': 'Israel',
  'SA': 'Saudi Arabia',
  'AE': 'UAE',
  'TR': 'Turkey',
  'GR': 'Greece',
  'PT': 'Portugal',
  'BE': 'Belgium',
  'CH': 'Switzerland',
  'AT': 'Austria',
  'CZ': 'Czech Republic',
  'HU': 'Hungary',
  'RO': 'Romania',
  'BG': 'Bulgaria',
  'HR': 'Croatia',
  'RS': 'Serbia',
  'SK': 'Slovakia',
  'SI': 'Slovenia',
  'LT': 'Lithuania',
  'LV': 'Latvia',
  'EE': 'Estonia',
  'IE': 'Ireland',
  'IS': 'Iceland',
  'LU': 'Luxembourg',
  'MT': 'Malta',
  'CY': 'Cyprus',
};

const countryCodeMap: { [key: string]: string } = {
  // Common English names
  'United States': 'US',
  'United Kingdom': 'GB',
  'Germany': 'DE',
  'France': 'FR',
  'Canada': 'CA',
  'Australia': 'AU',
  'Japan': 'JP',
  'China': 'CN',
  'South Korea': 'KR',
  'Korea': 'KR',
  'India': 'IN',
  'Brazil': 'BR',
  'Mexico': 'MX',
  'Spain': 'ES',
  'Italy': 'IT',
  'Netherlands': 'NL',
  'Russia': 'RU',
  'Switzerland': 'CH',
  'Sweden': 'SE',
  'Norway': 'NO',
  'Denmark': 'DK',
  'Finland': 'FI',
  'Poland': 'PL',
  'Turkey': 'TR',
  'Saudi Arabia': 'SA',
  'UAE': 'AE',
  'United Arab Emirates': 'AE',
  'Israel': 'IL',
  'Singapore': 'SG',
  'Hong Kong': 'HK',
  'Taiwan': 'TW',
  'Thailand': 'TH',
  'Vietnam': 'VN',
  'Indonesia': 'ID',
  'Malaysia': 'MY',
  'Philippines': 'PH',
  'New Zealand': 'NZ',
  'Argentina': 'AR',
  'Chile': 'CL',
  'Colombia': 'CO',
  'Peru': 'PE',
  'Venezuela': 'VE',
  'Egypt': 'EG',
  'South Africa': 'ZA',
  'Nigeria': 'NG',
  'Kenya': 'KE',
  'Morocco': 'MA',
  'Ukraine': 'UA',
  'Belgium': 'BE',
  'Austria': 'AT',
  'Czech Republic': 'CZ',
  'Czechia': 'CZ',
  'Hungary': 'HU',
  'Romania': 'RO',
  'Bulgaria': 'BG',
  'Greece': 'GR',
  'Portugal': 'PT',
  'Ireland': 'IE',
  'Scotland': 'GB',
  'Wales': 'GB',
  'England': 'GB',
  
  // ISO codes (if already provided)
  'US': 'US',
  'USA': 'US',
  'UK': 'GB',
  'GB': 'GB',
  'DE': 'DE',
  'FR': 'FR',
  'CA': 'CA',
  'AU': 'AU',
  'JP': 'JP',
  'CN': 'CN',
  'KR': 'KR',
  'IN': 'IN',
  'BR': 'BR',
  'MX': 'MX',
  'ES': 'ES',
  'IT': 'IT',
  'NL': 'NL',
  'RU': 'RU',
  'CH': 'CH',
  'SE': 'SE',
  'NO': 'NO',
  'DK': 'DK',
  'FI': 'FI',
  'PL': 'PL',
  'TR': 'TR',
  'SA': 'SA',
  'AE': 'AE',
  'IL': 'IL',
  'SG': 'SG',
  'HK': 'HK',
  'TW': 'TW',
  'TH': 'TH',
  'VN': 'VN',
  'ID': 'ID',
  'MY': 'MY',
  'PH': 'PH',
  'NZ': 'NZ',
  'AR': 'AR',
  'CL': 'CL',
  'CO': 'CO',
  'PE': 'PE',
  'VE': 'VE',
  'EG': 'EG',
  'ZA': 'ZA',
  'NG': 'NG',
  'KE': 'KE',
  'MA': 'MA',
  'UA': 'UA',
  'BE': 'BE',
  'AT': 'AT',
  'CZ': 'CZ',
  'HU': 'HU',
  'RO': 'RO',
  'BG': 'BG',
  'GR': 'GR',
  'PT': 'PT',
  'IE': 'IE',
};

// Valid ISO 3166-1 alpha-2 codes (most common ones)
const validCountryCodes = new Set([
  'AD', 'AE', 'AF', 'AG', 'AI', 'AL', 'AM', 'AO', 'AQ', 'AR', 'AS', 'AT',
  'AU', 'AW', 'AX', 'AZ', 'BA', 'BB', 'BD', 'BE', 'BF', 'BG', 'BH', 'BI',
  'BJ', 'BL', 'BM', 'BN', 'BO', 'BQ', 'BR', 'BS', 'BT', 'BV', 'BW', 'BY',
  'BZ', 'CA', 'CC', 'CD', 'CF', 'CG', 'CH', 'CI', 'CK', 'CL', 'CM', 'CN',
  'CO', 'CR', 'CU', 'CV', 'CW', 'CX', 'CY', 'CZ', 'DE', 'DJ', 'DK', 'DM',
  'DO', 'DZ', 'EC', 'EE', 'EG', 'EH', 'ER', 'ES', 'ET', 'FI', 'FJ', 'FK',
  'FM', 'FO', 'FR', 'GA', 'GB', 'GD', 'GE', 'GF', 'GG', 'GH', 'GI', 'GL',
  'GM', 'GN', 'GP', 'GQ', 'GR', 'GS', 'GT', 'GU', 'GW', 'GY', 'HK', 'HM',
  'HN', 'HR', 'HT', 'HU', 'ID', 'IE', 'IL', 'IM', 'IN', 'IO', 'IQ', 'IR',
  'IS', 'IT', 'JE', 'JM', 'JO', 'JP', 'KE', 'KG', 'KH', 'KI', 'KM', 'KN',
  'KP', 'KR', 'KW', 'KY', 'KZ', 'LA', 'LB', 'LC', 'LI', 'LK', 'LR', 'LS',
  'LT', 'LU', 'LV', 'LY', 'MA', 'MC', 'MD', 'ME', 'MF', 'MG', 'MH', 'MK',
  'ML', 'MM', 'MN', 'MO', 'MP', 'MQ', 'MR', 'MS', 'MT', 'MU', 'MV', 'MW',
  'MX', 'MY', 'MZ', 'NA', 'NC', 'NE', 'NF', 'NG', 'NI', 'NL', 'NO', 'NP',
  'NR', 'NU', 'NZ', 'OM', 'PA', 'PE', 'PF', 'PG', 'PH', 'PK', 'PL', 'PM',
  'PN', 'PR', 'PS', 'PT', 'PW', 'PY', 'QA', 'RE', 'RO', 'RS', 'RU', 'RW',
  'SA', 'SB', 'SC', 'SD', 'SE', 'SG', 'SH', 'SI', 'SJ', 'SK', 'SL', 'SM',
  'SN', 'SO', 'SR', 'SS', 'ST', 'SV', 'SX', 'SY', 'SZ', 'TC', 'TD', 'TF',
  'TG', 'TH', 'TJ', 'TK', 'TL', 'TM', 'TN', 'TO', 'TR', 'TT', 'TV', 'TW',
  'TZ', 'UA', 'UG', 'UM', 'US', 'UY', 'UZ', 'VA', 'VC', 'VE', 'VG', 'VI',
  'VN', 'VU', 'WF', 'WS', 'YE', 'YT', 'ZA', 'ZM', 'ZW'
]);

export function CountryFlag({ countryCode, className = "" }: CountryFlagProps) {
  if (!countryCode) {
    return (
      <div className="flex items-center justify-center" title="Unknown country">
        <span className="text-xs text-gray-500 px-1">Unknown</span>
      </div>
    );
  }

  // Try to map the country name to ISO code
  const code = countryCodeMap[countryCode] || countryCodeMap[countryCode.toUpperCase()] || countryCode.toUpperCase();

  // Check if it's a valid 2-letter code and exists in our valid codes set
  if (code.length !== 2 || !validCountryCodes.has(code)) {
    return (
      <div className="flex items-center justify-center" title={countryCode}>
        <span className="text-xs text-gray-500 px-1">Unknown</span>
      </div>
    );
  }

  // Only render flag if we have a valid country code
  return (
    <div className="flex items-center justify-center" title={countryCode}>
      <ReactCountryFlag
        countryCode={code}
        svg
        style={{
          fontSize: '1.5em',
          lineHeight: '1.5em',
        }}
        aria-label={countryCode}
        className={className}
      />
    </div>
  );
}