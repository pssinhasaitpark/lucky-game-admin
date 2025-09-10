import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 text-sm py-3 px-6 flex justify-between items-center border-t border-gray-200 dark:border-gray-700">
      <div>
        &copy; {new Date().getFullYear()} YourCompany. All rights reserved.
      </div>
      <div className="flex space-x-4">
        <span>v1.3.2</span>
        <a
          href="/docs"
          className="hover:text-gray-900 dark:hover:text-white transition"
          target="_blank"
          rel="noopener noreferrer"
        >
          Docs
        </a>
        <a
          href="/support"
          className="hover:text-gray-900 dark:hover:text-white transition"
          target="_blank"
          rel="noopener noreferrer"
        >
          Support
        </a>
      </div>
    </footer>
  );
};

export default Footer;
