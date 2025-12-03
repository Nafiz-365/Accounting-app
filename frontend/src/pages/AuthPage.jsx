import React, { useState, useMemo } from "react";
import {
  Lock,
  User,
  Mail,
  Sun,
  Moon,
  ArrowRight,
  AlertTriangle,
  Calculator,
  Building2,
  Eye,
  EyeOff,
  Shield,
  Zap,
  CheckCircle,
  Loader2,
  Key,
  UserPlus,
  LogIn,
  RefreshCw,
  ArrowLeft,
  Fingerprint,
  LockKeyhole,
  Sparkles,
  Gem,
} from "lucide-react";
import { authAPI } from "../utils/api";

const AuthPage = ({ onLogin, theme, toggleTheme, t }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showSecurityTip, setShowSecurityTip] = useState(true);

  // Password strength checker
  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++;
    return strength;
  };

  // Derive passwordStrength without setting state in an effect to avoid cascading renders
  const passwordStrength = useMemo(
    () => checkPasswordStrength(formData.password),
    [formData.password]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setIsLoading(true);

    try {
      if (isLoginView) {
        // --- LOGIN LOGIC ---
        if (!formData.email || !formData.password) {
          setErrorMessage("Please fill in all required fields.");
          setIsLoading(false);
          return;
        }

        const response = await authAPI.login(formData.email, formData.password);

        setSuccessMessage(
          `Welcome back, ${response.user.name}! Redirecting...`
        );
        setTimeout(() => {
          onLogin({
            name: response.user.name,
            email: response.user.email,
            role: "Administrator",
          });
        }, 1500);
      } else {
        // --- REGISTRATION LOGIC ---
        // Validate form fields
        if (!formData.name || !formData.email || !formData.password) {
          setErrorMessage("Please fill in all required fields.");
          setIsLoading(false);
          return;
        }

        // Password confirmation check
        if (formData.password !== formData.confirmPassword) {
          setErrorMessage(
            "Passwords do not match. Please confirm your password."
          );
          setIsLoading(false);
          return;
        }

        // Password strength check
        if (passwordStrength < 2) {
          setErrorMessage(
            "Password is too weak. Please include uppercase, lowercase, numbers, and special characters."
          );
          setIsLoading(false);
          return;
        }

        await authAPI.register(
          formData.name,
          formData.email,
          formData.password
        );

        // Show success message and switch to login view
        setSuccessMessage(
          `Account created successfully for ${formData.name}! Please login to continue.`
        );
        setIsLoading(false);
        setTimeout(() => {
          setIsLoginView(true);
          setFormData({
            name: "",
            email: formData.email,
            password: "",
            confirmPassword: "",
          });
        }, 2000);
      }
    } catch (error) {
      setErrorMessage(error.message || "An error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 ${t.bg} transition-colors duration-300`}
    >
      {/* Theme Toggle in Corner */}
      <div className="absolute top-4 right-4">
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-full ${t.buttonSecondary} transition-colors`}
        >
          {theme === "dark" ? (
            <Sun size={20} className="text-yellow-300" />
          ) : (
            <Moon size={20} className="text-slate-500" />
          )}
        </button>
      </div>

      <div
        className={`w-full max-w-md ${t.cardBg} ${t.shadow} rounded-2xl p-6 border ${t.border}`}
      >
        {/* Enhanced Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-2 animate-pulse">
            FinanceFlow Pro
          </h1>
          <p
            className={`text-sm font-medium ${
              theme === "dark" ? "text-slate-400" : "text-gray-900"
            }`}
          >
            {isLoginView ? (
              <span className="flex items-center justify-center gap-2">
                <Sparkles size={14} className="text-cyan-400" />
                Welcome back! Sign in to access your financial dashboard
                <Sparkles size={14} className="text-cyan-400" />
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Zap size={14} className="text-blue-400" />
                Create your account and start managing finances like a pro
                <Zap size={14} className="text-blue-400" />
              </span>
            )}
          </p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-3 p-2 bg-lime-900/50 border border-lime-500 text-lime-300 rounded-lg font-medium text-sm flex items-center gap-2">
            <CheckCircle size={14} className="text-lime-400" />
            {successMessage}
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div className="mb-3 p-2 bg-red-900/50 border border-red-500 text-red-300 rounded-lg flex items-center font-medium text-sm">
            <AlertTriangle size={14} className="mr-2" />
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          {!isLoginView && (
            <div>
              <label className={`block text-xs font-medium mb-1 ${t.text}`}>
                <User size={14} className="inline mr-1" />
                FULL NAME
              </label>
              <div
                className={`relative transition-all duration-300 ${
                  focusedField === "name" ? "scale-[1.02]" : ""
                }`}
              >
                <User
                  size={18}
                  className="absolute left-3 top-3 text-slate-400 transition-colors duration-300"
                />
                <input
                  type="text"
                  required
                  value={formData.name}
                  className={`w-full pl-10 pr-3 py-2 border rounded-xl ${t.input} transition-all duration-300 focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500`}
                  placeholder="Enter your full name"
                  onFocus={() => setFocusedField("name")}
                  onBlur={() => setFocusedField("")}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          )}

          <div>
            <label className={`block text-xs font-medium mb-1 ${t.text}`}>
              <Mail size={14} className="inline mr-1" />
              EMAIL ADDRESS
            </label>
            <div
              className={`relative transition-all duration-300 ${
                focusedField === "email" ? "scale-[1.02]" : ""
              }`}
            >
              <Mail
                size={18}
                className="absolute left-3 top-3 text-slate-400 transition-colors duration-300"
              />
              <input
                type="email"
                required
                value={formData.email}
                className={`w-full pl-10 pr-3 py-2 border rounded-xl ${t.input} transition-all duration-300 focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500`}
                placeholder="your.email@example.com"
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField("")}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    email: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <div>
            <label className={`block text-xs font-medium mb-1 ${t.text}`}>
              <Key size={14} className="inline mr-1" />
              PASSWORD
            </label>
            <div
              className={`relative transition-all duration-300 ${
                focusedField === "password" ? "scale-[1.02]" : ""
              }`}
            >
              <Lock
                size={18}
                className="absolute left-3 top-3 text-slate-400 transition-colors duration-300"
              />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                className={`w-full pl-10 pr-12 py-2 border rounded-xl ${t.input} transition-all duration-300 focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500`}
                placeholder="Create a strong password"
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField("")}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    password: e.target.value,
                  })
                }
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-cyan-400 transition-colors duration-300"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* Password Strength Indicator */}
            {!isLoginView && formData.password && (
              <div className="mt-1.5 space-y-1">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        passwordStrength === 0
                          ? "w-0"
                          : passwordStrength === 1
                          ? "w-1/4 bg-red-500"
                          : passwordStrength === 2
                          ? "w-2/4 bg-yellow-500"
                          : passwordStrength === 3
                          ? "w-3/4 bg-blue-500"
                          : "w-full bg-green-500"
                      }`}
                    />
                  </div>
                  <span
                    className={`text-xs font-medium ${
                      passwordStrength < 2
                        ? "text-red-400"
                        : passwordStrength < 3
                        ? "text-yellow-400"
                        : "text-green-400"
                    }`}
                  >
                    {passwordStrength === 0
                      ? "Weak"
                      : passwordStrength === 1
                      ? "Weak"
                      : passwordStrength === 2
                      ? "Fair"
                      : passwordStrength === 3
                      ? "Good"
                      : "Strong"}
                  </span>
                </div>
                <div className="flex gap-1">
                  <div
                    className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                      passwordStrength >= 1 ? "bg-red-500" : "bg-gray-300"
                    }`}
                  />
                  <div
                    className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                      passwordStrength >= 2 ? "bg-yellow-500" : "bg-gray-300"
                    }`}
                  />
                  <div
                    className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                      passwordStrength >= 3 ? "bg-blue-500" : "bg-gray-300"
                    }`}
                  />
                  <div
                    className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                      passwordStrength >= 4 ? "bg-green-500" : "bg-gray-300"
                    }`}
                  />
                </div>
              </div>
            )}
          </div>

          {!isLoginView && (
            <div>
              <label className={`block text-xs font-medium mb-1 ${t.text}`}>
                <LockKeyhole size={14} className="inline mr-1" />
                CONFIRM PASSWORD
              </label>
              <div
                className={`relative transition-all duration-300 ${
                  focusedField === "confirmPassword" ? "scale-[1.02]" : ""
                }`}
              >
                <Lock
                  size={16}
                  className="absolute left-2 top-2 text-slate-400 transition-colors duration-300"
                />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={formData.confirmPassword}
                  className={`w-full pl-8 pr-10 py-2 border rounded-xl ${t.input} transition-all duration-300 focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500`}
                  placeholder="Confirm your password"
                  onFocus={() => setFocusedField("confirmPassword")}
                  onBlur={() => setFocusedField("")}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2 top-1.5 text-slate-400 hover:text-cyan-400 transition-colors duration-300"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={14} />
                  ) : (
                    <Eye size={14} />
                  )}
                </button>
              </div>
              {formData.confirmPassword &&
                formData.password !== formData.confirmPassword && (
                  <p className="text-red-400 text-xs mt-0.5 flex items-center gap-0.5">
                    <AlertTriangle size={10} />
                    Passwords do not match
                  </p>
                )}
            </div>
          )}

          {/* Security Tip for Login */}
          {isLoginView && showSecurityTip && (
            <div
              className={`p-2 rounded-lg ${
                theme === "dark"
                  ? "bg-blue-900/20 border-blue-500/30"
                  : "bg-blue-50 border-blue-200"
              } border text-blue-700 flex items-start gap-2`}
            >
              <Shield size={10} className="mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-medium mb-0.5 text-sm">Security Tip</p>
                <p className="opacity-80 text-xs">
                  Use a strong password with letters, numbers, and symbols.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowSecurityTip(false)}
                className={`text-xs ${
                  theme === "dark"
                    ? "text-blue-400 hover:text-blue-300"
                    : "text-blue-600 hover:text-blue-800"
                }`}
              >
                ×
              </button>
            </div>
          )}

          {/* Remember Me for Login */}
          {isLoginView && (
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-cyan-500 border-gray-300 rounded focus:ring-cyan-500"
              />
              <label htmlFor="remember" className={`text-sm ${t.text}`}>
                Remember me for 30 days
              </label>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 mt-4 rounded-xl font-bold tracking-wider flex items-center justify-center gap-3 transition-all duration-300 transform relative overflow-hidden ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : `${t.buttonPrimary} hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]`
            }`}
          >
            {/* Button gradient overlay effect */}
            {!isLoading && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700"></div>
            )}
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                {isLoginView ? "Authenticating..." : "Creating Account..."}
              </>
            ) : (
              <>
                {isLoginView ? (
                  <>
                    <LogIn size={18} />
                    Sign In to Dashboard
                    <ArrowRight size={18} />
                  </>
                ) : (
                  <>
                    <UserPlus size={18} />
                    Create My Account
                    <Sparkles size={18} />
                  </>
                )}
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <div
            className={`p-3 rounded-xl ${
              theme === "dark"
                ? "bg-gray-800/50 border-gray-700"
                : "bg-gray-50 border-gray-200"
            } border`}
          >
            <p
              className={`text-sm ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              } mb-2`}
            >
              {isLoginView
                ? "New to FinanceFlow Pro?"
                : "Already have an account?"}
            </p>
            <button
              onClick={() => {
                setIsLoginView(!isLoginView);
                setErrorMessage("");
                setSuccessMessage("");
                setShowSecurityTip(true);
              }}
              className={`inline-flex items-center gap-2 px-5 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
                theme === "dark"
                  ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 text-cyan-400 border border-cyan-500/30"
                  : "bg-gradient-to-r from-cyan-500/10 to-blue-500/10 hover:from-cyan-500/20 hover:to-blue-500/20 text-cyan-600 border border-cyan-300"
              }`}
            >
              {isLoginView ? (
                <>
                  <UserPlus size={16} />
                  Create Free Account
                  <ArrowRight size={16} />
                </>
              ) : (
                <>
                  <LogIn size={16} />
                  Sign In Instead
                  <ArrowLeft size={16} />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Security Badge */}
        <div className="mt-4 flex items-center justify-center gap-4 text-xs">
          <div
            className={`flex items-center gap-1 ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            <Shield size={10} className="text-green-400" />
            <span>Secure 256-bit encryption</span>
          </div>
          <div
            className={`flex items-center gap-1 ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            <CheckCircle size={10} className="text-blue-400" />
            <span>GDPR compliant</span>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-3 text-center">
          <p
            className={`text-xs ${
              theme === "dark" ? "text-gray-500" : "text-gray-400"
            }`}
          >
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>

      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
      </div>
    </div>
  );
};

export default AuthPage;
