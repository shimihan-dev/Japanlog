import React, { useState } from "react";
import { X, Mail, Lock, LogIn, UserPlus, Sparkles, AlertCircle, CheckCircle2 } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  isConfigured: boolean;
  onClose: () => void;
  onSignIn: (email: string, pass: string) => Promise<any>;
  onSignUp: (email: string, pass: string) => Promise<any>;
  onMagicLink: (email: string) => Promise<any>;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  isConfigured,
  onClose,
  onSignIn,
  onSignUp,
  onMagicLink,
}) => {
  const [tab, setTab] = useState<"signin" | "signup" | "magic">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (tab === "signin") {
        await onSignIn(email.trim(), password);
        setSuccessMsg("로그인되었습니다!");
        setTimeout(() => {
          onClose();
        }, 1000);
      } else if (tab === "signup") {
        await onSignUp(email.trim(), password);
        setSuccessMsg("회원가입 요청이 완료되었습니다! 이메일 확인 또는 로그인을 시도해주세요.");
      } else if (tab === "magic") {
        await onMagicLink(email.trim());
        setSuccessMsg("입력하신 이메일로 매직링크(로그인 링크)를 발송했습니다!");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "인증 처리 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white dark:bg-[#151D2A] rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 dark:border-slate-800 relative transition-colors">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-2 mb-4">
          <div className="p-2 rounded-xl bg-blue-50 dark:bg-cyan-950 text-blue-600 dark:text-cyan-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              클라우드 데이터 동기화 로그인
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              어느 기기에서 접속하든 나와의 일본 여행 기록을 안전하게 보존하세요.
            </p>
          </div>
        </div>

        {/* Not Configured Warning Banner */}
        {!isConfigured && (
          <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/80 rounded-xl text-xs text-amber-800 dark:text-amber-300 space-y-1">
            <div className="font-bold flex items-center space-x-1">
              <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>Supabase API 설정 필요</span>
            </div>
            <p className="text-[11px] text-amber-700 dark:text-amber-400">
              현재 Supabase 프로젝트 URL 및 Anon Key가 설정되지 않았습니다. 프로젝트 루트의 <code className="bg-amber-100 dark:bg-amber-900 px-1 py-0.5 rounded text-amber-900 dark:text-amber-200">.env.local</code> 파일에 키를 입력해주세요.
            </p>
          </div>
        )}

        {/* Tabs */}
        <div className="flex bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl mb-4 text-xs font-semibold">
          <button
            type="button"
            onClick={() => { setTab("signin"); setErrorMsg(null); setSuccessMsg(null); }}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              tab === "signin"
                ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-xs"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            로그인
          </button>
          <button
            type="button"
            onClick={() => { setTab("signup"); setErrorMsg(null); setSuccessMsg(null); }}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              tab === "signup"
                ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-xs"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            회원가입
          </button>
          <button
            type="button"
            onClick={() => { setTab("magic"); setErrorMsg(null); setSuccessMsg(null); }}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              tab === "magic"
                ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-xs"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            매직링크
          </button>
        </div>

        {/* Alert Notifications */}
        {errorMsg && (
          <div className="mb-3 p-2.5 bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-xl text-xs flex items-center space-x-1.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-3 p-2.5 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 rounded-xl text-xs flex items-center space-x-1.5">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              이메일 주소
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-400 dark:text-slate-500" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-400"
              />
            </div>
          </div>

          {tab !== "magic" && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                비밀번호
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-400 dark:text-slate-500" />
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="6자 이상 입력"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-400"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !isConfigured}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-cyan-500 dark:to-blue-600 hover:from-blue-700 hover:to-indigo-700 dark:hover:from-cyan-600 dark:hover:to-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-1.5 disabled:opacity-50"
          >
            {loading ? (
              <span className="animate-pulse">인증 진행 중...</span>
            ) : tab === "signin" ? (
              <>
                <LogIn className="w-4 h-4" />
                <span>로그인하기</span>
              </>
            ) : tab === "signup" ? (
              <>
                <UserPlus className="w-4 h-4" />
                <span>새 계정 가입</span>
              </>
            ) : (
              <>
                <Mail className="w-4 h-4" />
                <span>매직링크 전송</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
