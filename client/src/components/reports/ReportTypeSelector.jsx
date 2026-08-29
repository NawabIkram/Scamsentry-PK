import React from 'react';
import { MessageSquare, Link2, Image, QrCode } from 'lucide-react';

const ReportTypeSelector = ({ selectedType, onSelect }) => {
  const types = [
    {
      id: 'text',
      label: 'Text Message',
      description: 'SMS spam, suspicious WhatsApp messages, or text links',
      icon: MessageSquare
    },
    {
      id: 'url',
      label: 'Suspicious URL',
      description: 'Phishing pages, clone sites, or malware download links',
      icon: Link2
    },
    {
      id: 'screenshot',
      label: 'Screenshot',
      description: 'Upload an image of a scam advertisement or chat conversation',
      icon: Image
    },
    {
      id: 'qr',
      label: 'QR Code',
      description: 'Scan or upload suspicious QR codes found in public or emails',
      icon: QrCode
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {types.map((type) => {
        const Icon = type.icon;
        const isSelected = selectedType === type.id;

        return (
          <button
            key={type.id}
            type="button"
            onClick={() => onSelect(type.id)}
            className={`flex flex-col items-center text-center p-5 rounded-xl border text-sm transition-all duration-200 focus:outline-none ${
              isSelected
                ? 'bg-cyber-accent/10 border-cyber-accent text-white shadow-lg shadow-cyber-accent/5 ring-1 ring-cyber-accent'
                : 'bg-cyber-card border-cyber-border text-cyber-text hover:border-cyber-accent hover:bg-cyber-dark'
            }`}
          >
            <div
              className={`p-3 rounded-lg border mb-3 transition-colors ${
                isSelected
                  ? 'bg-cyber-accent/20 border-cyber-accent/30 text-cyber-accent'
                  : 'bg-cyber-dark border-cyber-border text-cyber-muted group-hover:text-cyber-accent'
              }`}
            >
              <Icon className="h-6 w-6" />
            </div>
            <span className="font-bold tracking-wide block mb-1 text-sm">{type.label}</span>
            <span className="text-xs text-cyber-muted line-clamp-2">{type.description}</span>
          </button>
        );
      })}
    </div>
  );
};

export default ReportTypeSelector;
