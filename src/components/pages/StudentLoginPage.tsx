import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { authApi } from '../../services/api';
import { GraduationCap, Lock, ArrowRight, UserCheck, AlertCircle, ArrowLeft } from 'lucide-react';

export const StudentLoginPage: React.FC = () => {
  const { setCurrentPage, showToast, setIsStudentLoggedIn, setCurrentStudent } = useApp();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password) {
      setErrorMsg('Please enter your Student ID or Email and password.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await authApi.studentLogin(identifier.trim(), password);
      if (res.ok && res.data) {
        localStorage.setItem('deca_token', res.data.token);
        localStorage.setItem('deca_role', 'student');
        localStorage.setItem('deca_student_id', res.data.student.student_id);

        setIsStudentLoggedIn(true);
        setCurrentStudent(res.data.student);

        showToast(`Welcome back, ${res.data.student.full_name}!`, 'success');
        setCurrentPage('student-portal');
      } else {
        setErrorMsg(res.error || 'Invalid credentials. Please verify your Student ID and password.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-[#f8fafc] min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-['Poppins',sans-serif]">
      <div className="max-w-md w-full space-y-6 bg-white p-8 sm:p-10 rounded-3xl border-2 border-slate-200 shadow-xl">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-sky-50 text-[#0284c7] flex items-center justify-center mx-auto border-2 border-sky-200 shadow-xs">
            <UserCheck className="w-7 h-7 text-[#0284c7]" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Student Portal Sign In</h2>
          <p className="text-xs text-slate-500">
            Access your CBT practice tests, study materials, attendance, and tuition receipts.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2 animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Student ID or Registered Email *
            </label>
            <input
              type="text"
              placeholder="e.g. DECA-2026-0001 or email@student.dec.ng"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 text-xs font-medium focus:outline-hidden focus:border-[#0284c7] focus:ring-2 focus:ring-sky-100"
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700">Password *</label>
            </div>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 text-xs font-medium focus:outline-hidden focus:border-[#0284c7] focus:ring-2 focus:ring-sky-100"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Portal'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Credentials Helper */}
        <div className="p-4 bg-sky-50/70 rounded-2xl border border-sky-200 text-xs space-y-1.5">
          <span className="font-bold text-[#0369a1] block text-[11px] uppercase tracking-wider">
            Quick Demo Candidate Accounts:
          </span>
          <div className="text-[11px] text-slate-700 space-y-1">
            <p>
              <strong className="text-slate-900">Active Student:</strong> ID: <code className="bg-white px-1 py-0.5 rounded font-mono font-bold text-[#0284c7]">DECA-2026-0001</code> / Pass: <code className="bg-white px-1 py-0.5 rounded font-mono font-bold">Student1234#</code>
            </p>
            <p>
              <strong className="text-slate-900">Expired Tuition:</strong> ID: <code className="bg-white px-1 py-0.5 rounded font-mono font-bold text-[#ea580c]">DECA-2026-0002</code> / Pass: <code className="bg-white px-1 py-0.5 rounded font-mono font-bold">Student1234#</code>
            </p>
          </div>
        </div>

        {/* Action Links */}
        <div className="pt-2 border-t border-slate-100 flex flex-col items-center gap-3 text-xs text-slate-500">
          <div>
            Don&apos;t have a student account yet?{' '}
            <button
              type="button"
              onClick={() => setCurrentPage('register')}
              className="text-[#ea580c] hover:underline font-bold cursor-pointer"
            >
              Apply / Register Now
            </button>
          </div>

          <button
            type="button"
            onClick={() => setCurrentPage('home')}
            className="text-slate-400 hover:text-slate-600 flex items-center gap-1 cursor-pointer"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>Return to Academy Homepage</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentLoginPage;
