'use client';

import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/firebase"; // 既存のfirebase.tsからインポート
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import "./style.css"; // スタイルシートのインポート

export default function AdminPage() {
    const [authUser, setAuthUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // すでに初期化されたauth objectを使用
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setLoading(false);
            
            if (user) {
                // ログインしている
                console.log("ログイン中のユーザー:", user.email);
                setAuthUser(user);
            } else {
                // ログインしていない場合はログインページにリダイレクト
                console.log("ログインしていません");
                router.push('/login');
            }
        });

        return () => unsubscribe(); // クリーンアップ
    }, [router]);

    if (loading) {
        return (
            <div className="container">
                <Header />
                <div className="container-md py-5 text-center">
                    <p>読み込み中...</p>
                </div>
                <Footer />
            </div>
        );
    }

    if (!authUser) {
        return null; // リダイレクト処理中は何も表示しない
    }

    return (
        <div className="container">
            <Header />
            <div className="container-md py-5">
                <div className="card">
                    <h1 className="mb-4">管理者ページ</h1>
                    <p className="mb-4">{authUser.email} でログイン中</p>
                    
                    <div className="admin-menu">
                        <h2 className="mb-3">コンテンツ管理</h2>
                        <div className="admin-grid">
                            <div className="admin-card">
                                <h3>ニュース管理</h3>
                                <p>ニュース記事の追加・編集・削除</p>
                                <button onClick={() => router.push('/admin/blog')} className="button">
                                    管理する
                                </button>
                            </div>
                            
                            <div className="admin-card">
                                <h3>ユーザー管理</h3>
                                <p>ユーザーアカウントの管理</p>
                                <button onClick={() => router.push('/admin/users')} className="button">
                                    管理する
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <div className="mt-4">
                        <button onClick={() => auth.signOut()} className="button-outline">
                            ログアウト
                        </button>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}