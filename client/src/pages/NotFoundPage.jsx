import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-cyber-dark px-4 text-center min-h-[calc(100vh-128px)]">
      <div className="inline-flex items-center justify-center p-4 rounded-full bg-cyber-red/10 border border-cyber-red/30 mb-6">
        <ShieldAlert className="h-16 w-16 text-cyber-red animate-bounce" />
      </div>
      <h1 className="text-6xl font-extrabold text-white tracking-tight">404</h1>
      <h2 className="text-2xl font-bold text-cyber-text mt-3">Threat Detected: Page Not Found</h2>
      <p className="text-cyber-muted mt-2 max-w-md">
        The system could not resolve the requested route. It may have been relocated, deleted, or never existed.
      </p>
      <Link
        to="/"
        className="mt-8 inline-flex items-center space-x-2 px-6 py-3 bg-cyber-accent hover:bg-cyber-hover text-cyber-dark font-semibold rounded-lg shadow-lg shadow-cyber-accent/20 transition duration-200"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Return to Safe Zone</span>
      </Link>
    </div>
  );
};

export default NotFoundPage;
