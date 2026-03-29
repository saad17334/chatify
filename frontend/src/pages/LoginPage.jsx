import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
import { MessageCircleIcon, MailIcon, LoaderIcon, LockIcon } from "lucide-react";
import { Link } from "react-router";

function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { login, isLoggingIn } = useAuthStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(formData);
  };

  return (
    <div className="w-full flex items-center justify-center bg-slate-900 px-4">
      
      {/* ✅ SAME CONTAINER AS SIGNUP */}
      <div className="relative w-full max-w-5xl h-[92dvh] sm:h-[700px] md:h-[600px] overflow-hidden">
        
        <BorderAnimatedContainer>
          <div className="w-full h-full flex flex-col md:flex-row">

            {/* LEFT */}
            <div className="w-full md:w-1/2 flex items-center justify-center md:border-r border-slate-600/30 p-4 md:p-6">
              <div className="w-full max-w-md">
                
                <div className="text-center mb-5">
                  <MessageCircleIcon className="w-10 h-10 mx-auto text-slate-400 mb-2" />
                  <h2 className="text-xl md:text-2xl font-bold text-slate-200 mb-1">
                    Welcome Back
                  </h2>
                  <p className="text-slate-400 text-sm">
                    Login to your account
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">

                  <div>
                    <label className="auth-input-label">Email</label>
                    <div className="relative">
                      <MailIcon className="auth-input-icon" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="input"
                        placeholder="Your Email"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="auth-input-label">Password</label>
                    <div className="relative">
                      <LockIcon className="auth-input-icon" />
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                        className="input"
                        placeholder="Enter your password"
                      />
                    </div>
                  </div>

                  <button className="auth-btn" type="submit" disabled={isLoggingIn}>
                    {isLoggingIn ? (
                      <LoaderIcon className="w-5 h-5 animate-spin mx-auto" />
                    ) : (
                      "Sign In"
                    )}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <Link to="/signup" className="auth-link">
                    Don't have an account? Sign Up
                  </Link>
                </div>

              </div>
            </div>

            {/* RIGHT */}
            <div className="hidden md:flex md:w-1/2 items-center justify-center p-6 bg-gradient-to-bl from-slate-800/20 to-transparent">
              <div>
                <img
                  src="/login.png"
                  alt="People using mobile devices"
                  className="w-full max-w-xs mx-auto"
                />
                <div className="mt-4 text-center">
                  <h3 className="text-lg font-medium text-cyan-400">
                    Connect anytime, anywhere
                  </h3>

                  <div className="mt-3 flex justify-center gap-2 flex-wrap">
                    <span className="auth-badge">Free</span>
                    <span className="auth-badge">Easy Setup</span>
                    <span className="auth-badge">Private</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </BorderAnimatedContainer>

      </div>
    </div>
  );
}

export default LoginPage;