'use client';

import { useState, useEffect } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { getDocs, collection, deleteDoc, doc, addDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { auth, db } from "@/firebase";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import Link from "next/link";
import "./style.css";

// ニュース記事の型定義
type NewsItem = {
    id: string;
    title: string;
    content: string;
    date: number | string;
};

export default function AdminNewsPage() {
    const [authUser, setAuthUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [newsLoading, setNewsLoading] = useState(true);
    const [news, setNews] = useState<NewsItem[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [searchValue, setSearchValue] = useState("");
    const router = useRouter();
    
    // 新規記事作成モーダル用の状態
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTitle, setNewTitle] = useState("");
    const [newContent, setNewContent] = useState("");
    const [creating, setCreating] = useState(false);

    // ニュース記事を取得
    const fetchNews = async () => {
        setNewsLoading(true);
        try {
            const querySnapshot = await getDocs(collection(db, "news"));
            
            const newsList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data() as Omit<NewsItem, 'id'>
            }));
            
            // 日付の新しい順にソート
            newsList.sort((a, b) => {
                const dateA = a.date ? new Date(a.date).getTime() : 0;
                const dateB = b.date ? new Date(b.date).getTime() : 0;
                return dateB - dateA;
            });
            
            setNews(newsList);
            setError(null);
        } catch (err) {
            console.error("Error fetching news:", err);
            setError("ニュース記事の取得に失敗しました");
        } finally {
            setNewsLoading(false);
        }
    };

    useEffect(() => {
        fetchNews();
    }, []);

    // ユーザー認証状態を確認
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setLoading(false);
            
            if (user) {
                setAuthUser(user);
            } else {
                router.push('/login');
            }
        });

        return () => unsubscribe();
    }, [router]);

    // 記事を削除する関数
    const handleDeleteNews = async (id: string) => {
        if (window.confirm("この記事を削除しますか？")) {
            try {
                await deleteDoc(doc(db, "news", id));
                // 削除後にリストを更新
                setNews(news.filter(item => item.id !== id));
                alert("記事を削除しました");
            } catch (err) {
                console.error("Error deleting news:", err);
                alert("記事の削除に失敗しました");
            }
        }
    };
    
    // 新規記事を作成する関数
    const handleCreateNews = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!newTitle.trim() || !newContent.trim()) {
            alert('タイトルと内容を入力してください');
            return;
        }
        
        setCreating(true);
        
        try {
            const docRef = await addDoc(collection(db, "news"), {
                title: newTitle.trim(),
                content: newContent.trim(),
                date: Date.now(),
                createdAt: serverTimestamp()
            });
            
            // 新しい記事をリストに追加
            const newPost = {
                id: docRef.id,
                title: newTitle.trim(),
                content: newContent.trim(),
                date: Date.now()
            };
            
            // 最新の記事を先頭に追加
            setNews([newPost, ...news]);
            
            // フォームをクリアしてモーダルを閉じる
            setNewTitle("");
            setNewContent("");
            setIsModalOpen(false);
            
            alert("記事を作成しました");
        } catch (err) {
            console.error("Error creating news:", err);
            alert("記事の作成に失敗しました");
        } finally {
            setCreating(false);
        }
    };

    // 記事の短縮表示用の関数
    const truncateContent = (content: string, maxLength: number = 100) => {
        if (content.length <= maxLength) return content;
        return content.slice(0, maxLength) + '...';
    };
    
    // モーダルを開く
    const openModal = () => {
        setIsModalOpen(true);
    };
    
    // モーダルを閉じる
    const closeModal = () => {
        if (creating) return; // 作成中は閉じられないようにする
        
        // 入力内容があれば確認
        if (newTitle.trim() || newContent.trim()) {
            if (!window.confirm("入力内容が破棄されますが、よろしいですか？")) {
                return;
            }
        }
        
        setNewTitle("");
        setNewContent("");
        setIsModalOpen(false);
    };

    if (loading) {
        return (
            <div className="container">
                <Header />
                <div className="container-md py-5 text-center">
                    <div className="loading-spinner"></div>
                </div>
                <Footer />
            </div>
        );
    }

    if (!authUser) {
        return null; // リダイレクト処理中は何も表示しない
    }

    let foundNews = news.filter((newsItem) => {
        if (searchValue === "") return true; // 検索バーが空の場合は全て表示
        return newsItem.title.toLowerCase().includes(searchValue.toLowerCase());
    });

    return (
        <div className="container">
            <Header />
            <div className="container-md py-5">
                <div className="card">
                    <h1 className="mb-4">ニュース管理</h1>
                    <p className="mb-4">{authUser.email} でログイン中</p>
                    
                    <button className="create-button" onClick={openModal}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        新しい記事を作成
                    </button>

                    <div className="search-bar">
                        <input 
                            type="text" 
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)} 
                            className="search-input" 
                            placeholder="記事を検索..."
                        />
                    </div>

                    <div className="admin-menu">
                        <h2 className="mb-3">記事一覧</h2>
                        
                        {newsLoading ? (
                            <div className="text-center">
                                <div className="loading-spinner"></div>
                            </div>
                        ) : error ? (
                            <div className="text-center">
                                <p>{error}</p>
                                <button className="button-outline mt-4" onClick={fetchNews}>
                                    再読み込み
                                </button>
                            </div>
                        ) : news.length === 0 ? (
                            <div className="empty-state">
                                <p>まだ記事がありません</p>
                                <button className="button" onClick={openModal}>
                                    最初の記事を作成する
                                </button>
                            </div>
                        ) : (
                            <div className="admin-grid">
                                <div className="admin-item">
                                    {foundNews.map((newsItem) => (
                                        <div className="news-item" key={newsItem.id}>
                                            <h3>{newsItem.title}</h3>
                                            <p>{newsItem.date ? new Date(newsItem.date).toLocaleDateString('ja-JP') : '日付なし'}</p>
                                            <p>{truncateContent(newsItem.content)}</p>
                                            
                                            <div className="news-actions">
                                                <Link href={`/blog/${newsItem.id}`} className="button">
                                                    閲覧
                                                </Link>
                                                
                                                <div className="action-buttons">
                                                    <button 
                                                        className="edit-button"
                                                        onClick={() => router.push(`/admin/blog/edit/${newsItem.id}`)}
                                                    >
                                                        編集
                                                    </button>
                                                    <button 
                                                        className="delete-button"
                                                        onClick={() => handleDeleteNews(newsItem.id)}
                                                    >
                                                        削除
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    
                    <div className="mt-4">
                        <Link href="/admin" className="button-outline">
                            管理画面トップに戻る
                        </Link>
                    </div>
                </div>
            </div>
            
            {/* 新規記事作成モーダル */}
            <div className={`modal-overlay ${isModalOpen ? 'active' : ''}`}>
                <div className="modal-content">
                    <div className="modal-header">
                        <h2>新しい記事を作成</h2>
                        <button className="modal-close" onClick={closeModal}>×</button>
                    </div>
                    
                    <div className="modal-body">
                        <form onSubmit={handleCreateNews}>
                            <div className="modal-form-group">
                                <label htmlFor="title">タイトル</label>
                                <input 
                                    type="text" 
                                    id="title" 
                                    className="modal-form-control"
                                    value={newTitle}
                                    onChange={(e) => setNewTitle(e.target.value)}
                                    placeholder="記事のタイトルを入力してください"
                                    disabled={creating}
                                    required
                                />
                            </div>
                            
                            <div className="modal-form-group">
                                <label htmlFor="content">内容</label>
                                <textarea 
                                    id="content" 
                                    className="modal-form-control textarea"
                                    value={newContent}
                                    onChange={(e) => setNewContent(e.target.value)}
                                    placeholder="記事の内容を入力してください"
                                    disabled={creating}
                                    required
                                />
                            </div>
                        </form>
                    </div>
                    
                    <div className="modal-footer">
                        <button 
                            className="modal-button modal-button-secondary" 
                            onClick={closeModal}
                            disabled={creating}
                        >
                            キャンセル
                        </button>
                        <button 
                            className="modal-button modal-button-primary" 
                            onClick={handleCreateNews}
                            disabled={creating || !newTitle.trim() || !newContent.trim()}
                        >
                            {creating ? '作成中...' : '作成する'}
                        </button>
                    </div>
                </div>
            </div>
            
            <Footer />
        </div>
    );
}