
import React from 'react';
import { Heart, Github, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-12">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-center md:text-left">
            <p className="text-sm text-gray-600">
              Made with <Heart className="inline h-4 w-4 text-red-500" /> for South African students
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Created by Soli Tsaagane • June 2025
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <a
              href="mailto:support@schooliscool.co.za"
              className="text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="Contact us"
            >
              <Mail className="h-4 w-4" />
            </a>
            <a
              href="https://github.com/solitsaagane/school-is-cool"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="View on GitHub"
            >
              <Github className="h-4 w-4" />
            </a>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-4 pt-4 text-center">
          <p className="text-xs text-gray-500">
            Data sources: Universities South Africa (USAf), South African Qualifications Authority (SAQA)
          </p>
        </div>
      </div>
    </footer>
  );
};
