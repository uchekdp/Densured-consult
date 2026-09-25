import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { OfficialReceipt } from '../../types';
import { generateCryptographicReceipt, CryptographicPayload } from '../../utils/cryptoVerification';
import {
  X,
  Printer,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  Building,
  Smartphone,
  Lock,
  Copy,
  Check,
  Download,
  ExternalLink,
  Award,
  Calendar,
  Clock,
  User,
  Hash,
  Sparkles,
  FileText,
  Key,
  Fingerprint,
  RefreshCw,
} from 'lucide-react';

export interface ReceiptAndIDCardModalProps {
  receipt: OfficialReceipt | null;
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'receipt' | 'id-card' | 'gateway';
  studentAvatar?: string;
  onPaymentSuccess?: (amount: number, description: string, method: string) => void;
}

export const ReceiptAndIDCardVerificationModal: React.FC<ReceiptAndIDCardModalProps> = ({
  receipt,
  isOpen,
  onClose,
  initialTab = 'receipt',
  studentAvatar,
  onPaymentSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<'receipt' | 'id-card' | 'gateway'>(initialTab);
  const [receiptWidth, setReceiptWidth] = useState<'80mm' | '57mm'>('80mm');
  const [idCardScale, setIdCardScale] = useState<number>(1.25);
  const [showCryptoSignatureInspector, setShowCryptoSignatureInspector] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);

  // Gateway states
  const [gatewayMethod, setGatewayMethod] = useState<'card' | 'transfer' | 'ussd'>('card');
  const [gatewayAmount, setGatewayAmount] = useState<number>(
    receipt?.amount || 20000
  );
  const [gatewayShift, setGatewayShift] = useState<'Morning' | 'Evening'>(
    receipt?.studentShift || 'Morning'
  );
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);
  const [copiedAccount, setCopiedAccount] = useState(false);

  if (!isOpen) return null;

  // Generate cryptographic signature packet
  const cryptoPayload: CryptographicPayload = receipt
    ? generateCryptographicReceipt({
        reference: receipt.transactionReference,
        registrationNumber: receipt.registrationNumber,
        studentName: receipt.studentName,
        studentShift: receipt.studentShift,
        amount: receipt.amount,
        monthPeriod: receipt.monthPeriod,
        validUntil: receipt.validUntil,
        issuedAt: receipt.issueDate,
      })
    : generateCryptographicReceipt({
        reference: `DEC-REF-${Date.now().toString().slice(-6)}`,
        registrationNumber: 'DEC-2026-8821',
        studentName: 'Candidate Scholar',
        studentShift: gatewayShift,
        amount: gatewayAmount,
        monthPeriod: 'September 2026',
        validUntil: '30 Sep 2026',
      });

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    if (activeTab === 'receipt') {
      const receiptEl = document.getElementById('printable-official-receipt');
      if (receiptEl) {
        const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>DEC_Official_Receipt_${receipt?.receiptNumber || '2026'}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @page { 
      size: ${receiptWidth} auto; 
      margin: 0; 
    }
    @media print { 
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; margin: 0; padding: 0; background: #fff; }
      .thermal-receipt-container { width: ${receiptWidth} !important; max-width: ${receiptWidth} !important; margin: 0 !important; box-shadow: none !important; border: none !important; }
    }
    body { background: #f1f5f9; font-family: monospace, ui-monospace, sans-serif; margin: 0; padding: 16px; display: flex; justify-content: center; }
  </style>
</head>
<body>
  <div class="thermal-receipt-container bg-white" style="width: ${receiptWidth}; max-width: ${receiptWidth};">
    ${receiptEl.innerHTML}
  </div>
  <script>
    window.onload = function() {
      window.print();
    };
  </script>
</body>
</html>`;
        const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `DEC_Receipt_${receiptWidth}_${receipt?.receiptNumber || '2026'}.html`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } else {
        window.print();
      }
    } else if (activeTab === 'id-card') {
      const idEl = document.getElementById('printable-student-id-card-front');
      const idBackEl = document.getElementById('printable-student-id-card-back');
      if (idEl) {
        const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>DEC_Student_ID_${cryptoPayload.registrationNumber}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @page { 
      size: 3.375in 2.125in; 
      margin: 0; 
    }
    @media print { 
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; margin: 0; padding: 0; background: #fff; }
      .cr80-id-card { 
        width: 3.375in !important; 
        height: 2.125in !important; 
        max-width: 3.375in !important; 
        max-height: 2.125in !important; 
        margin: 0 !important; 
        page-break-after: always; 
        border-radius: 0.125in !important;
        box-shadow: none !important;
      }
    }
    body { 
      background: #f1f5f9; 
      font-family: ui-sans-serif, system-ui, sans-serif; 
      margin: 0; 
      padding: 16px; 
      display: flex; 
      flex-direction: column; 
      align-items: center; 
      gap: 16px; 
    }
  </style>
</head>
<body>
  <div class="cr80-id-card" style="width: 3.375in; height: 2.125in;">
    ${idEl.innerHTML}
  </div>
  ${idBackEl ? `<div class="cr80-id-card" style="width: 3.375in; height: 2.125in;">${idBackEl.innerHTML}</div>` : ''}
  <script>
    window.onload = function() {
      window.print();
    };
  </script>
</body>
</html>`;
        const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `DEC_Student_ID_3.375x2.125_${cryptoPayload.registrationNumber}.html`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } else {
        window.print();
      }
    } else {
      window.print();
    }
  };

  const handleCopySig = (sig: string) => {
    navigator.clipboard.writeText(sig);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleExecutePayment = () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      setPaymentDone(true);
      if (onPaymentSuccess) {
        onPaymentSuccess(
          gatewayAmount,
          `Monthly Tuition Pass - ${gatewayShift} Student`,
          gatewayMethod === 'card' ? 'Debit/Credit Card' : gatewayMethod === 'transfer' ? 'Bank Transfer' : 'USSD *737*'
        );
      }
    }, 1200);
  };

  const avatarUrl =
    studentAvatar ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/65 backdrop-blur-xs overflow-y-auto print:p-0 print:bg-white animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto print:shadow-none print:border-none print:w-full print:max-w-none">
        {/* Navigation Bar / Mode Switcher */}
        <div className="bg-[#D5241B] text-white px-5 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 print:hidden border-b-2 border-[#FFC600]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white p-1 shrink-0 border border-[#FFC600] shadow-xs">
              <img src="/logo.jpg" alt="DEC Logo" className="w-full h-full object-contain rounded" />
            </div>
            <div>
              <span className="font-black text-sm block tracking-tight">D Ensured Consult</span>
              <span className="text-[10px] text-[#FFC600] font-bold uppercase tracking-wider">
                Official Verification Desk • 2026/2027
              </span>
            </div>
          </div>

          {/* Tab buttons */}
          <div className="flex items-center gap-1.5 bg-black/20 p-1 rounded-xl text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab('receipt')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'receipt'
                  ? 'bg-white text-[#D5241B] shadow-xs font-black'
                  : 'text-white/90 hover:text-white hover:bg-white/10'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Official Receipt</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('id-card')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'id-card'
                  ? 'bg-white text-[#D5241B] shadow-xs font-black'
                  : 'text-white/90 hover:text-white hover:bg-white/10'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Student ID Card</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('gateway')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'gateway'
                  ? 'bg-[#FFC600] text-[#25166B] shadow-xs font-black'
                  : 'text-white/90 hover:text-white hover:bg-white/10'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Payment Gateway</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-xs font-bold flex items-center gap-1.5 text-white transition-colors cursor-pointer border border-white/20"
            >
              <Printer className="w-4 h-4 text-[#FFC600]" />
              <span className="hidden sm:inline">Print</span>
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="px-3 py-1.5 rounded-lg bg-[#FFC600] hover:bg-[#e6b300] text-xs font-black flex items-center gap-1.5 text-[#25166B] transition-colors cursor-pointer shadow-xs"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Download</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/20 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ============================================================ */}
        {/* VIEW 1: OFFICIAL PAYMENT CLEARANCE RECEIPT (80mm / 57mm)     */}
        {/* ============================================================ */}
        {activeTab === 'receipt' && (
          <div className="p-4 sm:p-6 space-y-4 bg-slate-100">
            {/* Thermal Receipt Width Switcher */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs print:hidden text-xs">
              <div className="flex items-center gap-2">
                <span className="font-black text-[#25166B]">Receipt Width:</span>
                <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setReceiptWidth('80mm')}
                    className={`px-3 py-1 rounded-lg font-black text-xs transition-all cursor-pointer ${
                      receiptWidth === '80mm'
                        ? 'bg-[#D5241B] text-white shadow-xs'
                        : 'text-slate-600 hover:text-[#25166B]'
                    }`}
                  >
                    3⅛ inches (80mm) Standard
                  </button>
                  <button
                    type="button"
                    onClick={() => setReceiptWidth('57mm')}
                    className={`px-3 py-1 rounded-lg font-black text-xs transition-all cursor-pointer ${
                      receiptWidth === '57mm'
                        ? 'bg-[#D5241B] text-white shadow-xs'
                        : 'text-slate-600 hover:text-[#25166B]'
                    }`}
                  >
                    2¼ inches (57mm) Compact
                  </button>
                </div>
              </div>

              <div className="text-[11px] font-mono text-slate-500">
                Print Format: <strong className="text-[#25166B]">{receiptWidth === '80mm' ? '80mm / 3.125″ POS' : '57mm / 2.25″ POS'}</strong>
              </div>
            </div>

            {/* Thermal Receipt Container */}
            <div className="flex justify-center overflow-x-auto py-2">
              <div
                id="printable-official-receipt"
                style={{
                  width: receiptWidth,
                  minWidth: receiptWidth,
                  maxWidth: receiptWidth,
                }}
                className={`bg-white text-[#111827] shadow-xl border border-slate-300 font-mono ${
                  receiptWidth === '57mm' ? 'p-2.5 text-[9px] leading-tight' : 'p-4 text-[11px] leading-normal'
                }`}
              >
                {/* Header */}
                <div className="text-center space-y-1 pb-2 border-b-2 border-dashed border-slate-400">
                  <div className="w-12 h-12 rounded-full overflow-hidden border border-[#D5241B] mx-auto p-0.5 bg-white">
                    <img src="/logo.jpg" alt="Logo" className="w-full h-full object-contain rounded-full" />
                  </div>
                  <h1 className={`${receiptWidth === '57mm' ? 'text-xs' : 'text-sm'} font-black tracking-tight text-[#25166B] uppercase`}>
                    D ENSURED CONSULT
                  </h1>
                  <p className="text-[9px] font-black text-[#D5241B] uppercase tracking-wider">
                    Official 2026/2027 academic session
                  </p>
                  <p className="text-[8px] text-[#028D3B] font-bold italic">
                    "Education is power"
                  </p>
                  <p className="text-[8px] text-slate-600">
                    DOYIN PLAZA, IGBOELERIN BUSSTOP, OKOMAIKO, LAGOS
                  </p>
                  <p className="text-[8px] text-slate-700">
                    HOTLINE: <strong className="font-bold">08147896930</strong>
                  </p>
                  <p className="text-[8px] text-slate-600 truncate">
                    Densuredconsult@gmail.com
                  </p>
                </div>

                {/* Receipt Title & Meta */}
                <div className="py-2 border-b-2 border-dashed border-slate-300 space-y-1">
                  <div className="text-center font-black text-[#D5241B] uppercase tracking-wider text-[10px]">
                    OFFICIAL BURSARY RECEIPT
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">REC NO:</span>
                    <strong className="font-bold">{receipt?.receiptNumber || 'DEC-REC-2026-0041'}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">TX REF:</span>
                    <span className="truncate max-w-[120px] font-bold">{cryptoPayload.reference}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">DATE:</span>
                    <span>{receipt?.approvedAt || receipt?.issueDate || new Date().toLocaleDateString('en-GB')}</span>
                  </div>
                </div>

                {/* Candidate Particulars */}
                <div className="py-2 border-b-2 border-dashed border-slate-300 space-y-1">
                  <div className="flex justify-between gap-1">
                    <span className="text-slate-500 shrink-0">STUDENT:</span>
                    <strong className="font-black text-right truncate text-[#25166B]">
                      {receipt?.studentName || cryptoPayload.studentName}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">REG NO:</span>
                    <strong className="font-black text-[#D5241B]">
                      {receipt?.registrationNumber || cryptoPayload.registrationNumber}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">PROGRAM:</span>
                    <span className="font-bold truncate">{receipt?.program || 'UTME (JAMB)'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">SHIFT:</span>
                    <strong className="font-bold text-[#25166B]">
                      {cryptoPayload.studentShift} ({cryptoPayload.studentShift === 'Morning' ? '9am-1:30pm' : '2pm-6:30pm'})
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">CYCLE:</span>
                    <span>{cryptoPayload.monthPeriod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">VALID TO:</span>
                    <span className="font-bold text-[#028D3B]">{cryptoPayload.validUntil}</span>
                  </div>
                </div>

                {/* Charges & Breakdown */}
                <div className="py-2 border-b-2 border-dashed border-slate-300 space-y-1">
                  <div className="flex justify-between font-bold text-slate-500 pb-0.5 border-b border-slate-200">
                    <span>DESCRIPTION</span>
                    <span>AMOUNT</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span>Monthly Tuition & CBT Hall Drills</span>
                    <span className="font-bold">₦{cryptoPayload.amount.toLocaleString()}</span>
                  </div>
                  <div className="text-[8px] text-slate-500">
                    Includes syllabus lectures & weekly simulated mock tests.
                  </div>
                  <div className="flex justify-between pt-2 border-t-2 border-dashed border-slate-400 font-black text-xs text-[#25166B]">
                    <span>TOTAL PAID:</span>
                    <span className="text-[#D5241B]">₦{cryptoPayload.amount.toLocaleString()}</span>
                  </div>
                  <div className="text-[8px] font-bold text-[#028D3B] text-center pt-0.5">
                    ★ DIRECTORATE CLEARED & PAID ★
                  </div>
                </div>

                {/* Cryptographic QR Code & Barcode */}
                <div className="py-3 border-b-2 border-dashed border-slate-300 flex flex-col items-center text-center space-y-2">
                  <div className="bg-white p-1 border border-slate-300 rounded shadow-2xs">
                    <QRCodeSVG
                      value={cryptoPayload.verificationUrl}
                      size={receiptWidth === '57mm' ? 76 : 100}
                      level="M"
                      includeMargin={false}
                    />
                  </div>
                  <span className="text-[8px] font-bold tracking-wider text-[#D5241B]">
                    SCAN TO VERIFY AUTHENTICITY
                  </span>
                  <div className="tracking-widest font-black text-slate-700 text-xs">
                    |||| || ||||| || |||| ||||
                  </div>
                  <div className="text-[7.5px] text-slate-500 break-all">
                    Sig: {cryptoPayload.signatureHash.slice(0, 20)}...
                  </div>
                </div>

                {/* Authorized Signatory */}
                <div className="pt-2 text-center space-y-0.5">
                  <div className="font-serif italic font-bold text-xs text-[#25166B]">
                    Mr. Akinjo Rotimi
                  </div>
                  <div className="text-[8px] text-slate-600 font-bold uppercase">
                    Founder • Sole Authorized Signatory
                  </div>
                  <p className="text-[7.5px] text-slate-400 pt-1">
                    Official D Ensured Consult Receipt • Keep in safe custody
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* VIEW 2: CANDIDATE STUDENT ID CARD - LIGHT DESIGN             */}
        {/* ============================================================ */}
        {activeTab === 'id-card' && (
          <div className="p-6 sm:p-8 space-y-6 text-[#1D1918] bg-slate-50">
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs print:hidden text-xs">
              <div>
                <span className="font-black text-[#25166B] block">
                  Candidate Student ID Card (CR80 Standard)
                </span>
                <span className="text-[11px] text-slate-500">
                  Exact Dimensions: <strong className="text-[#D5241B]">3.375 x 2.125 inches</strong> (85.6mm × 54.0mm)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-500 text-[11px] font-bold">Zoom:</span>
                <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200">
                  {[1, 1.25, 1.5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setIdCardScale(s)}
                      className={`px-2.5 py-0.5 rounded-lg font-black text-xs transition-all cursor-pointer ${
                        idCardScale === s
                          ? 'bg-[#25166B] text-white shadow-xs'
                          : 'text-slate-600 hover:text-[#25166B]'
                      }`}
                    >
                      {s === 1 ? '100% (3.375"×2.125")' : `${Math.round(s * 100)}%`}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Scaled ID Cards Container */}
            <div className="overflow-x-auto py-2 flex flex-col items-center gap-6">
              {/* Front of ID Card (3.375in x 2.125in) */}
              <div
                style={{
                  transform: idCardScale !== 1 ? `scale(${idCardScale})` : undefined,
                  transformOrigin: 'top center',
                  marginBottom: idCardScale > 1 ? `${(idCardScale - 1) * 204}px` : '0',
                }}
                className="transition-transform duration-150"
              >
                <div
                  id="printable-student-id-card-front"
                  className="cr80-id-card relative bg-white border-2 border-[#D5241B] shadow-xl overflow-hidden flex flex-col justify-between"
                  style={{
                    width: '3.375in',
                    height: '2.125in',
                    minWidth: '3.375in',
                    minHeight: '2.125in',
                    maxWidth: '3.375in',
                    maxHeight: '2.125in',
                    borderRadius: '0.125in',
                  }}
                >
                  {/* Top Red & Gold Header */}
                  <div className="bg-[#D5241B] text-white px-2.5 py-1.5 flex items-center justify-between border-b border-[#FFC600]">
                    <div className="flex items-center gap-1.5">
                      <div className="w-6 h-6 rounded-full bg-white p-0.5 shrink-0 border border-[#FFC600]">
                        <img src="/logo.jpg" alt="Logo" className="w-full h-full object-contain rounded-full" />
                      </div>
                      <div>
                        <span className="font-black text-[10px] tracking-tight block text-white leading-tight">
                          D ENSURED CONSULT
                        </span>
                        <span className="text-[7px] uppercase tracking-widest text-[#FFC600] font-extrabold block leading-none">
                          Education is power
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="px-1.5 py-0.5 rounded text-[7.5px] font-black bg-[#FFC600] text-[#25166B] uppercase tracking-wider block">
                        {cryptoPayload.studentShift}
                      </span>
                      <span className="text-[6.5px] text-white/90 font-bold block mt-0.5">
                        2026/2027 Session
                      </span>
                    </div>
                  </div>

                  {/* Body: Photo & Credentials */}
                  <div className="px-2.5 py-1.5 flex items-start gap-2 flex-1 bg-linear-to-b from-white via-slate-50/50 to-white">
                    {/* Photo with double border */}
                    <div className="relative shrink-0">
                      <img
                        src={avatarUrl}
                        alt={cryptoPayload.studentName}
                        style={{ width: '0.72in', height: '0.90in' }}
                        className="rounded-lg object-cover border border-[#D5241B] ring-1 ring-[#FFC600] shadow-xs bg-slate-100"
                      />
                      <div className="absolute -bottom-1 -right-0.5 px-1 py-0.2 rounded bg-[#028D3B] text-white font-black text-[6.5px] uppercase tracking-wider">
                        CLEARED
                      </div>
                    </div>

                    <div className="flex-1 space-y-0.5 leading-tight">
                      <div>
                        <span className="text-[7px] text-slate-400 uppercase font-black tracking-wider block">Candidate Name</span>
                        <h3 className="text-[10.5px] font-black text-[#25166B] leading-tight truncate">
                          {cryptoPayload.studentName}
                        </h3>
                      </div>

                      <div>
                        <span className="text-[6.5px] text-slate-400 uppercase font-bold tracking-wider block">Reg Number</span>
                        <strong className="font-mono text-[9.5px] font-black text-[#D5241B]">
                          {cryptoPayload.registrationNumber}
                        </strong>
                      </div>

                      <div className="grid grid-cols-2 gap-1 pt-0.5 border-t border-slate-200 text-[7px]">
                        <div>
                          <span className="text-slate-400 block">Shift</span>
                          <strong className="text-[#25166B]">{cryptoPayload.studentShift}</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 block">Session</span>
                          <strong className="text-[#25166B]">2026/2027</strong>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Bar: Barcode, Expiry & QR */}
                  <div className="px-2.5 py-1 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[7px]">
                    <div className="space-y-0.2">
                      <div className="font-mono text-[#25166B] text-[7.5px] tracking-widest font-black leading-none">
                        |||| || ||||| || ||||
                      </div>
                      <span className="text-[6.5px] text-[#028D3B] font-mono font-bold block">
                        EXPIRES: {cryptoPayload.validUntil}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <div className="text-right leading-none">
                        <span className="text-[6px] text-[#D5241B] font-black block">DIRECTORATE</span>
                        <span className="text-[5.5px] text-slate-500">Mr. Akinjo Rotimi</span>
                      </div>
                      <div className="bg-white p-0.5 rounded border border-[#D5241B]/30 shadow-2xs shrink-0">
                        <QRCodeSVG
                          value={cryptoPayload.verificationUrl}
                          size={28}
                          level="M"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Back of ID Card (3.375in x 2.125in) */}
              <div
                style={{
                  transform: idCardScale !== 1 ? `scale(${idCardScale})` : undefined,
                  transformOrigin: 'top center',
                  marginBottom: idCardScale > 1 ? `${(idCardScale - 1) * 204}px` : '0',
                }}
                className="transition-transform duration-150"
              >
                <div
                  id="printable-student-id-card-back"
                  className="cr80-id-card relative bg-white border-2 border-slate-300 shadow-md overflow-hidden flex flex-col justify-between p-2.5 text-[7.5px] text-[#1D1918]"
                  style={{
                    width: '3.375in',
                    height: '2.125in',
                    minWidth: '3.375in',
                    minHeight: '2.125in',
                    maxWidth: '3.375in',
                    maxHeight: '2.125in',
                    borderRadius: '0.125in',
                  }}
                >
                  <div className="border-b border-[#D5241B] pb-1 flex items-center justify-between">
                    <span className="font-black uppercase tracking-wider text-[#D5241B] text-[8px]">
                      TERMS & CENTER REGULATIONS
                    </span>
                    <span className="text-[6.5px] font-bold text-[#028D3B] bg-emerald-50 px-1 py-0.2 rounded border border-emerald-200">
                      OFFICIAL 2026/2027
                    </span>
                  </div>

                  <ul className="list-disc pl-3 space-y-0.5 text-slate-600 text-[7px] leading-tight">
                    <li>This card is the property of D Ensured Consult and must be presented for CBT mock drills and physical classes.</li>
                    <li>Cardholder is cleared for student e-portal resources and test simulations.</li>
                    <li>Loss or damage must be promptly reported to the directorate desk.</li>
                  </ul>

                  <div className="pt-1 border-t border-slate-200 text-[6.5px] text-slate-600 space-y-0.2 leading-tight">
                    <p><strong>Campus:</strong> DOYIN PLAZA, IGBOELERIN BUSSTOP, OKOMAIKO, LAGOS</p>
                    <p><strong>Hotline:</strong> <span className="font-mono font-bold text-[#D5241B]">08147896930</span> | Densuredconsult@gmail.com</p>
                  </div>

                  <div className="flex justify-between items-center pt-0.5 border-t border-slate-200 text-[6.5px]">
                    <span className="font-mono text-slate-400">Card Type: CR80 PVC (3.375" × 2.125")</span>
                    <span className="font-serif italic font-bold text-[#25166B]">Akinjo Rotimi</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* VIEW 3: PAYMENT GATEWAY (CARD, TRANSFER, USSD)               */}
        {/* ============================================================ */}
        {activeTab === 'gateway' && (
          <div className="p-6 sm:p-8 space-y-6 text-[#1D1918]">
            <div className="text-center max-w-lg mx-auto space-y-1">
              <span className="text-[11px] font-black text-[#25166B] uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full border border-slate-200 inline-block">
                Secure Tuition Checkout Gateway
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-[#25166B]">
                Make Monthly Tuition Payment
              </h2>
              <p className="text-xs text-slate-500">
                Select your student shift and payment channel. Generating an approved receipt clears your e-portal account.
              </p>
            </div>

            {paymentDone ? (
              <div className="p-8 text-center bg-emerald-50 rounded-3xl border border-emerald-200 space-y-4 max-w-md mx-auto">
                <div className="w-16 h-16 rounded-full bg-[#028D3B] text-white flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-emerald-900">Payment Completed!</h3>
                  <p className="text-xs text-emerald-700 mt-1">
                    Your monthly tuition has been received. The official cryptographic receipt and ID card have been generated.
                  </p>
                </div>
                <div className="flex gap-2 justify-center pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('receipt')}
                    className="px-4 py-2.5 rounded-xl bg-[#25166B] hover:bg-[#1c1152] text-[#FFC600] font-bold text-xs cursor-pointer shadow-xs"
                  >
                    View Official Receipt
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('id-card')}
                    className="px-4 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-[#1D1918] font-bold text-xs cursor-pointer"
                  >
                    View ID Card
                  </button>
                </div>
              </div>
            ) : (
              <div className="max-w-xl mx-auto space-y-5">
                {/* Shift Selector */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setGatewayShift('Morning');
                      setGatewayAmount(20000);
                    }}
                    className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                      gatewayShift === 'Morning'
                        ? 'border-[#25166B] bg-[#25166B]/5 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-extrabold text-sm text-[#25166B]">Morning Shift</span>
                      <span className="text-[10px] font-black text-[#028D3B] bg-emerald-100 px-2 py-0.5 rounded-full">
                        09:00 AM – 01:30 PM
                      </span>
                    </div>
                    <div className="text-xl font-black text-[#25166B] font-mono">₦20,000</div>
                    <span className="text-[11px] text-slate-500 block mt-0.5">Per Calendar Month</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setGatewayShift('Evening');
                      setGatewayAmount(15000);
                    }}
                    className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                      gatewayShift === 'Evening'
                        ? 'border-[#25166B] bg-[#25166B]/5 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-extrabold text-sm text-[#25166B]">Evening Shift</span>
                      <span className="text-[10px] font-black text-[#098CD0] bg-sky-100 px-2 py-0.5 rounded-full">
                        02:00 PM – 06:30 PM
                      </span>
                    </div>
                    <div className="text-xl font-black text-[#25166B] font-mono">₦15,000</div>
                    <span className="text-[11px] text-slate-500 block mt-0.5">Per Calendar Month</span>
                  </button>
                </div>

                {/* Method Tabs */}
                <div className="flex bg-slate-100 p-1 rounded-2xl text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setGatewayMethod('card')}
                    className={`flex-1 py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      gatewayMethod === 'card'
                        ? 'bg-white text-[#25166B] shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <CreditCard className="w-3.5 h-3.5 text-[#028D3B]" />
                    <span>Card Checkout</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setGatewayMethod('transfer')}
                    className={`flex-1 py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      gatewayMethod === 'transfer'
                        ? 'bg-white text-[#25166B] shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Building className="w-3.5 h-3.5 text-[#098CD0]" />
                    <span>Direct Bank Transfer</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setGatewayMethod('ussd')}
                    className={`flex-1 py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      gatewayMethod === 'ussd'
                        ? 'bg-white text-[#25166B] shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5 text-amber-600" />
                    <span>USSD Code</span>
                  </button>
                </div>

                {/* Method Content */}
                {gatewayMethod === 'card' && (
                  <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3 text-xs">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Card Number</label>
                      <input
                        type="text"
                        defaultValue="5399 •••• •••• 4821"
                        readOnly
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white font-mono text-xs font-bold"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Expiry Date</label>
                        <input
                          type="text"
                          defaultValue="08/28"
                          readOnly
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white font-mono text-xs font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">CVV</label>
                        <input
                          type="text"
                          defaultValue="823"
                          readOnly
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white font-mono text-xs font-bold"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {gatewayMethod === 'transfer' && (
                  <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3 text-xs">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200">
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase font-bold block">Account Number</span>
                        <strong className="font-mono text-base font-bold text-[#25166B]">8147896930</strong>
                        <span className="text-[11px] text-slate-600 block">Moniepoint Microfinance Bank</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText('8147896930');
                          setCopiedAccount(true);
                          setTimeout(() => setCopiedAccount(false), 2000);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-[#25166B] flex items-center gap-1 cursor-pointer"
                      >
                        {copiedAccount ? <Check className="w-3.5 h-3.5 text-[#028D3B]" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedAccount ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Account Name: <strong>D Ensured Consult Educational Services</strong>
                    </p>
                  </div>
                )}

                {gatewayMethod === 'ussd' && (
                  <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3 text-xs text-center">
                    <span className="text-[11px] text-slate-600 block font-medium">
                      Dial this USSD sequence on your registered phone:
                    </span>
                    <div className="font-mono text-lg font-black text-[#25166B] bg-white p-3 rounded-xl border border-slate-200">
                      *737*2*₦{gatewayAmount}*8147896930#
                    </div>
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="button"
                  disabled={isProcessingPayment}
                  onClick={handleExecutePayment}
                  className="w-full py-3.5 px-6 rounded-2xl bg-[#D5241B] hover:bg-[#b01c15] text-white font-black text-sm shadow-md cursor-pointer flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {isProcessingPayment ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                      <span>Authenticating Cryptographic Transaction...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>
                        Pay ₦{gatewayAmount.toLocaleString()} & Generate Cryptographic Receipt
                      </span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Modal Footer Controls */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 print:hidden text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#028D3B]" />
            <span>256-Bit SSL Encrypted • Directorate Registrar Certificate</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <button
              type="button"
              onClick={handleDownload}
              className="px-4 py-2 rounded-xl bg-[#028D3B] hover:bg-[#027531] text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
            >
              <Download className="w-4 h-4 text-white" />
              <span>Download {activeTab === 'receipt' ? 'Official Receipt' : activeTab === 'id-card' ? 'ID Card' : 'Slip'}</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-[#25166B] hover:bg-[#1c1152] text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
            >
              <Printer className="w-4 h-4 text-[#FFC600]" />
              <span>Print {activeTab === 'receipt' ? 'Receipt' : activeTab === 'id-card' ? 'ID Card' : 'Slip'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-200 font-bold text-xs text-slate-700 cursor-pointer transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
