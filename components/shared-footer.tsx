import Link from 'next/link';
import { Shield } from 'lucide-react';

export function SharedFooter() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              {/* <Shield className="h-6 w-6 text-gray-500" /> */}
              {/* <h4 className="text-lg font-semibold text-white">LeakJar</h4> */}
              <div className="inline-block mb-3 w-10 h-10 svg-lgs invert"></div>
            </div>
            <p className="text-sm">Enterprise breach monitoring and credential intelligence platform</p>
          </div>
          <div>
            <h5 className="text-white font-semibold mb-3">Product</h5>
            <ul className="space-y-2 text-sm">
              <li><Link href="/features" className="hover:text-white transition-colors">Features</Link></li>
              <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="/developer" className="hover:text-white transition-colors">API</Link></li>
              <li><Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="text-white font-semibold mb-3">Company</h5>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="/auth/signup" className="hover:text-white transition-colors">Get Started</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="text-white font-semibold mb-3">Legal</h5>
            <ul className="space-y-2 text-sm">
              <li><a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#terms" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#security" className="hover:text-white transition-colors">Security</a></li>
              <li><a href="#compliance" className="hover:text-white transition-colors">Compliance</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; 2025 SEW Inc. All rights reserved. Built with ❤️ in San Francisco, CA</p>
        </div>
      </div>
    </footer>
  );
}

