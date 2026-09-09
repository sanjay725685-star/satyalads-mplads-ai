import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { 
  X, 
  QrCode, 
  Smartphone, 
  Copy, 
  Check, 
  ExternalLink, 
  ShieldCheck,
  Camera
} from 'lucide-react';
import { WORK_ITEMS } from '../data/mockData';

interface QRCodeHandoffModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialWorkCode?: string;
  onOpenSimulator?: (workCode: string) => void;
}

export const QRCodeHandoffModal: React.FC<QRCodeHandoffModalProps> = ({
  isOpen,
  onClose,
  initialWorkCode = 'MPLADS/2024-25/UP-VAR-0104',
  onOpenSimulator
}) => {
  const [selectedCode, setSelectedCode] = useState<string>(initialWorkCode);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  // Compute capture URL
  const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
  const cleanCode = selectedCode.replace(/\//g, '-');
  const captureUrl = `${origin}/capture/${cleanCode}`;

  useEffect(() => {
    setSelectedCode(initialWorkCode);
  }, [initialWorkCode]);

  useEffect(() => {
    if (isOpen) {
      QRCode.toDataURL(captureUrl, {
        width: 260,
        margin: 1.5,
        color: {
          dark: '#002244',
          light: '#FFFFFF'
        }
      })
      .then(url => setQrDataUrl(url))
      .catch(console.error);
    }
  }, [isOpen, captureUrl]);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(captureUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleLaunchSim = () => {
    if (onOpenSimulator) {
      onOpenSimulator(selectedCode);
      onClose();
    } else {
      window.open(captureUrl, '_blank');
    }
  };

  const currentWork = WORK_ITEMS.find(w => w.code === selectedCode || w.code.replace(/\//g, '-') === cleanCode) || WORK_ITEMS[0];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-300 rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border-t-4 border-[#003366] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 bg-[#F8FAFC] border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#003366] text-white flex items-center justify-center">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#002244] font-serif">
                Scan to Capture from Mobile Phone
              </h3>
              <p className="text-[11px] text-slate-500">
                Desktop-to-Phone Handoff for Instant On-Site Ground Verification
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 text-xs text-slate-700">
          {/* Work Selector */}
          <div>
            <label className="block text-slate-700 font-mono font-bold text-[11px] mb-1">
              Target MPLADS Project Work Code:
            </label>
            <select
              value={selectedCode}
              onChange={e => setSelectedCode(e.target.value)}
              className="w-full bg-[#F8FAFC] border border-slate-300 rounded p-2 text-xs text-slate-900 font-mono outline-none focus:border-[#003366]"
            >
              {WORK_ITEMS.map(w => (
                <option key={w.id} value={w.code}>
                  {w.code} — {w.title.slice(0, 42)}...
                </option>
              ))}
            </select>
          </div>

          {/* QR Code Graphic Container */}
          <div className="flex flex-col items-center justify-center p-4 bg-[#F8FAFC] rounded-xl border border-slate-200">
            {qrDataUrl ? (
              <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-300 relative group">
                <img 
                  src={qrDataUrl} 
                  alt="Mobile Capture QR Code" 
                  className="w-52 h-52 object-contain"
                />
                <div className="absolute inset-x-0 -bottom-2 flex justify-center">
                  <span className="bg-[#003366] text-white text-[9px] font-mono px-2 py-0.5 rounded shadow">
                    SCAN WITH ANY PHONE CAMERA
                  </span>
                </div>
              </div>
            ) : (
              <div className="w-52 h-52 flex items-center justify-center text-slate-400 font-mono">
                Generating QR Code...
              </div>
            )}

            <div className="text-center mt-4 space-y-1">
              <span className="text-[11px] text-slate-600 block">
                Point your mobile camera at this QR code to launch the <strong>SATYALADS Camera PWA</strong> with automatic GPS and hardware EXIF linking.
              </span>
            </div>
          </div>

          {/* Shareable Link Input */}
          <div className="space-y-1">
            <label className="text-[11px] font-mono font-bold text-slate-600">
              Direct Mobile Capture URL:
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={captureUrl}
                className="flex-1 bg-white border border-slate-300 rounded p-2 text-[11px] font-mono text-slate-700 select-all outline-none"
              />
              <button
                onClick={handleCopyLink}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Handoff Actions */}
          <div className="pt-2 border-t border-slate-200 grid grid-cols-2 gap-3">
            <button
              onClick={handleLaunchSim}
              className="py-2.5 px-4 rounded bg-[#003366] hover:bg-[#002244] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
            >
              <Smartphone className="w-4 h-4 text-[#FF9933]" />
              <span>Launch Simulator</span>
            </button>
            <button
              onClick={() => window.open(captureUrl, '_blank')}
              className="py-2.5 px-4 rounded bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <ExternalLink className="w-4 h-4 text-slate-600" />
              <span>Open in New Tab</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
