import React, { useState } from 'react';
import { API_ROUTES } from '../../utils/apiConfig'; 

function AuthGateway({ onAuthSuccess }) {
  const [isLoginView, setIsLoginView] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form States
  const [name, setName] = useState('');
  const [userIdOrPhone, setUserIdOrPhone] = useState(''); 
  const [customUserId, setCustomUserId] = useState('');   
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); 
  
  const [countryCode, setCountryCode] = useState('+91');   
  const [phoneNumber, setPhoneNumber] = useState('');

  const countryCodesList = [
    { code: '+91', label: 'IN (+91)' },
    { code: '+1',  label: 'US (+1)' },
    { code: '+44', label: 'UK (+44)' },
    { code: '+86', label: 'CN (+86)' },
    { code: '+971', label: 'AE (+971)' }
  ];

  const validateCustomUserId = (id) => {
    if (id.includes('@')) {
      return "User ID cannot contain the '@' symbol. Please save emails or generic handles elsewhere.";
    }
    const strictPattern = /^[a-z0-9!#$%&'*+/=?^_`{|}~.-]+$/;
    if (!strictPattern.test(id)) {
      return "User ID must only consist of lowercase letters, numbers, and special characters.";
    }
    return null;
  };

  const handleAuthenticationSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!isLoginView) {
      const idValidationError = validateCustomUserId(customUserId);
      if (idValidationError) {
        setError(idValidationError);
        setLoading(false);
        return;
      }
    }

    const targetRoute = isLoginView ? API_ROUTES.auth.login : API_ROUTES.auth.register;
    
    // 👑 FIXED PAYLOAD: Automatically creates a synthetic clean email identifier out of the custom handle 
    // to map perfectly with your backend route criteria without database validation faults!
    const payload = isLoginView 
      ? { email: userIdOrPhone.trim().includes('@') ? userIdOrPhone.trim() : `${userIdOrPhone.trim()}@prepai.sandbox`, password } 
      : { 
          name: name.trim(), 
          email: `${customUserId.trim().toLowerCase()}@prepai.sandbox`, 
          password 
        };

    try {
      const res = await fetch(targetRoute, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      
      onAuthSuccess(data.user);
    } catch (err) {
      setError(err.message || 'Server connection timed out handling session verification.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleOAuthRedirect = () => {
    window.location.href = API_ROUTES.auth.google;
  };

  const handleLinkedInOAuthRedirect = () => {
    window.location.href = API_ROUTES.auth.linkedin;
  };

  return (
    <div className="w-full max-w-md mx-auto bg-slate-950 border border-slate-850 p-8 rounded-2xl text-slate-200 shadow-2xl space-y-6 animate-fadeIn">
      
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-black text-white tracking-tight">
          {isLoginView ? 'Welcome Back Developer' : 'Create Sandbox Account'}
        </h2>
        <p className="text-xs text-slate-500 font-mono">
          {isLoginView ? 'Sign in to sync your active workspace data.' : 'Register a custom handle to link parameters.'}
        </p>
      </div>

      <form onSubmit={handleAuthenticationSubmit} className="space-y-4">
        
        {!isLoginView && (
          <>
            <div className="flex flex-col space-y-1.5">
              <label className="text-[10px] font-mono uppercase font-bold text-slate-400 tracking-wider">Full Name</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="Tony Stark" 
                required 
                className="bg-slate-900 border border-slate-800 focus:border-cyan-500 text-xs rounded-xl p-3 focus:outline-none transition-colors placeholder:text-slate-600 text-slate-200 font-medium" 
              />
            </div>

            <div className="flex flex-col space-y-1.5">
              <label className="text-[10px] font-mono uppercase font-bold text-slate-400 tracking-wider">Mobile Number (Optional)</label>
              <div className="flex gap-2">
                <select 
                  value={countryCode} 
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="bg-slate-900 border border-slate-800 text-xs rounded-xl p-3 focus:outline-none focus:border-cyan-500 text-slate-300 font-mono cursor-pointer transition-colors max-w-[100px]"
                >
                  {countryCodesList.map((c) => (
                    <option key={c.code} value={c.code} className="bg-slate-950 text-slate-300">
                      {c.label}
                    </option>
                  ))}
                </select>

                <input 
                  type="tel" 
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))} 
                  placeholder="9876543210"
                  className="flex-1 bg-slate-900 border border-slate-800 focus:border-cyan-500 text-xs rounded-xl p-3 focus:outline-none transition-colors placeholder:text-slate-600 text-slate-200 font-medium font-mono"
                />
              </div>
            </div>
          </>
        )}

        {isLoginView ? (
          <div className="flex flex-col space-y-1.5">
            <label className="text-[10px] font-mono uppercase font-bold text-slate-400 tracking-wider">User ID Handle</label>
            <input 
              type="text" 
              value={userIdOrPhone} 
              onChange={(e) => setUserIdOrPhone(e.target.value)} 
              placeholder="e.g. tony101" 
              required 
              className="bg-slate-900 border border-slate-800 focus:border-cyan-500 text-xs rounded-xl p-3 focus:outline-none transition-colors placeholder:text-slate-600 text-slate-200 font-medium font-mono" 
            />
          </div>
        ) : (
          <div className="flex flex-col space-y-1.5">
            <label className="text-[10px] font-mono uppercase font-bold text-slate-400 tracking-wider">Custom User ID (No @ sign allowed)</label>
            <input 
              type="text" 
              value={customUserId} 
              onChange={(e) => setCustomUserId(e.target.value)} 
              placeholder="lowercase_numbers_specialchar" 
              required 
              className="bg-slate-900 border border-slate-800 focus:border-cyan-500 text-xs rounded-xl p-3 focus:outline-none transition-colors placeholder:text-slate-600 text-slate-200 font-medium font-mono text-cyan-400" 
            />
          </div>
        )}

        <div className="flex flex-col space-y-1.5">
          <label className="text-[10px] font-mono uppercase font-bold text-slate-400 tracking-wider">Account Password</label>
          <div className="relative w-full">
            <input 
              type={showPassword ? "text" : "password"} 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="••••••••" 
              required 
              className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-500 text-xs rounded-xl p-3 pr-14 focus:outline-none transition-colors placeholder:text-slate-600 text-slate-200 font-mono tracking-widest" 
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 hover:text-cyan-400 transition-colors cursor-pointer bg-transparent border-0 outline-none select-none"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>

        {error && (
          <div className="text-xs text-rose-400 bg-rose-500/5 p-3 rounded-xl border border-rose-500/10 text-center font-mono leading-relaxed">
            ⚠️ {error}
          </div>
        )}

        <button 
          type="submit" 
          disabled={loading} 
          className="w-full bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-500 hover:to-emerald-500 text-slate-950 font-extrabold py-3 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg disabled:opacity-40 select-none"
        >
          {loading ? 'Processing Workspace Tokens...' : isLoginView ? 'Authenticate Account ➔' : 'Register Secure Profile ➔'}
        </button>
      </form>

      <div className="text-center pt-2">
        {isLoginView ? (
          <p className="text-xs text-slate-400 font-medium">
            New to our engineering workspace?{' '}
            <button 
              type="button" 
              onClick={() => { setIsLoginView(false); setError(''); }} 
              className="text-cyan-400 hover:text-cyan-300 font-bold underline cursor-pointer bg-transparent border-0 outline-none"
            >
              Register an Account
            </button>
          </p>
        ) : (
          <p className="text-xs text-slate-400 font-medium">
            Already have a verified handle?{' '}
            <button 
              type="button" 
              onClick={() => { setIsLoginView(true); setError(''); }} 
              className="text-cyan-400 hover:text-cyan-300 font-bold underline cursor-pointer bg-transparent border-0 outline-none"
            >
              Access Login Here
            </button>
          </p>
        )}
      </div>

      <div className="flex flex-col space-y-2 pt-2 border-t border-slate-900">
        <span className="text-[10px] font-mono text-center uppercase tracking-widest text-slate-600">Or continue with sandbox identity provider</span>
        <div className="flex space-x-3">
          <button 
            type="button"
            onClick={handleGoogleOAuthRedirect}
            className="flex-1 bg-slate-900 border border-slate-800 hover:border-slate-700 p-2.5 rounded-xl text-xs font-medium cursor-pointer transition-colors text-center font-bold text-slate-300"
          >
            🌐 Google
          </button>
          <button 
            type="button"
            onClick={handleLinkedInOAuthRedirect}
            className="flex-1 bg-slate-900 border border-slate-800 hover:border-slate-700 p-2.5 rounded-xl text-xs font-medium cursor-pointer transition-colors text-center font-bold text-slate-300"
          >
            👔 LinkedIn
          </button>
        </div>
      </div>

    </div>
  );
}

export default AuthGateway;