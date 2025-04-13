'use client'

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";
import { auth } from "@/firebase";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import "./style.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // エラーメッセージを人間にやさしい形式に変換する関数
  const getErrorMessage = (errorCode: string) => {
    switch (errorCode) {
      case "auth/user-not-found":
        return "登録されていないメールアドレスです";
      case "auth/wrong-password":
        return "パスワードが正しくありません";
      case "auth/invalid-email":
        return "メールアドレスの形式が正しくありません";
      case "auth/too-many-requests":
        return "ログイン試行回数が多すぎます。しばらく経ってからお試しください";
      default:
        return "ログインに失敗しました。もう一度お試しください";
    }
  };

  // メールアドレスとパスワードでログイン
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard"); // ログイン後のリダイレクト先
    } catch (error: any) {
      console.error("Login error:", error);
      setError(getErrorMessage(error.code));
    } finally {
      setLoading(false);
    }
  };

  // Googleでログイン
  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push("/admin");
    } catch (error: any) {
      console.error("Google login error:", error);
      setError(getErrorMessage(error.code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <Header />
      <main>
        <div className="login-container">
          <div className="login-form">
            <h2>ログイン</h2>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label htmlFor="email">メールアドレス</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">パスワード</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" disabled={loading}>
                {loading ? "ログイン中..." : "ログイン"}
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}