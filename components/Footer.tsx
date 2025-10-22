import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          {/* Links */}
          <nav className="flex gap-6" aria-label="Footer navigation">
            <Link
              href="/terms"
              className="text-sm text-gray-600 hover:text-indigo-600 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded px-1"
            >
              Terms & Conditions
            </Link>
            <Link
              href="/privacy"
              className="text-sm text-gray-600 hover:text-indigo-600 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded px-1"
            >
              Privacy Policy
            </Link>
          </nav>

          {/* Copyright */}
          <p className="text-sm text-gray-500 text-center sm:text-right">
            © {currentYear} tPBM Protocols by Pinguis Vir. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

