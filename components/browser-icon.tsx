import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChrome,
  faEdge,
  faFirefoxBrowser,
  faSafari,
  faOpera,
  faBrave
} from '@fortawesome/free-brands-svg-icons';
import { faGlobe, faShield } from '@fortawesome/free-solid-svg-icons';

interface BrowserIconProps {
  browserName: string;
  className?: string;
}

export function BrowserIcon({ browserName, className = "h-5 w-5" }: BrowserIconProps) {
  const browser = browserName?.toLowerCase() || '';
  
  // Chrome detection
  if (browser.includes('chrome') || browser.includes('google chrome')) {
    return (
      <div className="flex items-center justify-center" title={browserName}>
        <FontAwesomeIcon icon={faChrome} className={`${className} text-gray-700`} />
      </div>
    );
  }
  
  // Edge detection
  if (browser.includes('edge') || browser.includes('microsoft edge')) {
    return (
      <div className="flex items-center justify-center" title={browserName}>
        <FontAwesomeIcon icon={faEdge} className={`${className} text-gray-700`} />
      </div>
    );
  }
  
  // Firefox detection
  if (browser.includes('firefox') || browser.includes('mozilla')) {
    return (
      <div className="flex items-center justify-center" title={browserName}>
        <FontAwesomeIcon icon={faFirefoxBrowser} className={`${className} text-gray-700`} />
      </div>
    );
  }
  
  // Safari detection
  if (browser.includes('safari')) {
    return (
      <div className="flex items-center justify-center" title={browserName}>
        <FontAwesomeIcon icon={faSafari} className={`${className} text-gray-700`} />
      </div>
    );
  }
  
  // Opera detection
  if (browser.includes('opera')) {
    return (
      <div className="flex items-center justify-center" title={browserName}>
        <FontAwesomeIcon icon={faOpera} className={`${className} text-gray-700`} />
      </div>
    );
  }
  
  // Brave detection
  if (browser.includes('brave')) {
    return (
      <div className="flex items-center justify-center" title={browserName}>
        <FontAwesomeIcon icon={faBrave} className={`${className} text-gray-700`} />
      </div>
    );
  }
  
  // Vivaldi detection (no specific icon, use globe)
  if (browser.includes('vivaldi')) {
    return (
      <div className="flex items-center justify-center" title={browserName}>
        <FontAwesomeIcon icon={faGlobe} className={`${className} text-gray-600`} />
      </div>
    );
  }
  
  // Tor detection
  if (browser.includes('tor')) {
    return (
      <div className="flex items-center justify-center" title={browserName}>
        <FontAwesomeIcon icon={faShield} className={`${className} text-gray-700`} />
      </div>
    );
  }
  
  // Default for unknown browsers
  if (browser) {
    return (
      <div className="flex items-center justify-center" title={browserName}>
        <FontAwesomeIcon icon={faGlobe} className={`${className} text-gray-500`} />
      </div>
    );
  }
  
  return null;
}