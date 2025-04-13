'use client'

import { db } from "@/firebase";
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import "./style.css";

type News = {
    title: string;
    content: string;
    date: number | string;
}

export default function EditNewsPage() {
    const params = useParams();
    const id = params?.id as string;
    const router = useRouter();

    const [post, setPost] = useState<News | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(false);
    const [editTitle, setEditTitle] = useState<string>('');
    const [editContent, setEditContent] = useState<string>('');

    useEffect(() => {
        async function fetchPost() {
            if (!id) {
                setError(true);
                setLoading(false);
                return;
            }
            console.log("Fetching post with ID:", id);

            try {
                const docRef = doc(db, "news", id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const postData = docSnap.data() as News;
                    setPost(postData);
                    setEditTitle(postData.title);
                    setEditContent(postData.content);
                } else {
                    setError(true);
                }
            } catch (err) {
                console.error("Error fetching post:", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        }

        fetchPost();
    }, [id]);

    function formatDate(date: number | string | undefined) {
        return date ? new Date(date).toLocaleDateString('ja-JP') : '';
    }

    async function handleSave(e: React.FormEvent) {
        e.preventDefault();
        
        if (!editTitle.trim() || !editContent.trim()) {
            alert('タイトルと内容を入力してください');
            return;
        }
        
        setSaving(true);
        
        try {
            const docRef = doc(db, "news", id);
            await updateDoc(docRef, {
                title: editTitle.trim(),
                content: editContent.trim(),
                updatedAt: new Date().toISOString(),
            });
            
            alert('記事を更新しました');
            router.push('/admin/blog');
        } catch (err) {
            console.error("Error updating post:", err);
            alert('記事の更新に失敗しました');
        } finally {
            setSaving(false);
        }
    }
    
    if (loading) {
        return (
            <div className="container">
                <Header />
                <div className="edit-container py-5">
                    <div className="edit-card text-center">
                        <div className="loading-spinner"></div>
                        <p>記事を読み込み中...</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (error) {
        return (
            <div className="container">
                <Header />
                <div className="edit-container py-5">
                    <div className="edit-card text-center">
                        <h1>エラーが発生しました</h1>
                        <p>記事の読み込みに失敗しました。</p>
                        <div className="button-group">
                            <Link href="/admin/blog" className="cancel-button">
                                ニュース管理に戻る
                            </Link>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
    
    return (
        <div className="container">
            <Header />
            <div className="edit-container py-5">
                <div className="edit-card">
                    <h1>記事の編集</h1>
                    
                    <div className="meta-info">
                        <span>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                <line x1="3" y1="10" x2="21" y2="10"></line>
                            </svg>
                            投稿日: {formatDate(post?.date)}
                        </span>
                        <span>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 20h9"></path>
                                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                            </svg>
                            ID: {id}
                        </span>
                    </div>
                    
                    <form onSubmit={handleSave}>
                        <div className="form-group">
                            <label htmlFor="title">タイトル</label>
                            <input 
                                type="text" 
                                id="title" 
                                className="form-control"
                                value={editTitle} 
                                onChange={(e) => setEditTitle(e.target.value)} 
                                placeholder="記事のタイトルを入力してください"
                                required
                            />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="content">内容</label>
                            <textarea 
                                id="content" 
                                className="form-control textarea"
                                value={editContent} 
                                onChange={(e) => setEditContent(e.target.value)}
                                placeholder="記事の内容を入力してください"
                                required
                            />
                        </div>
                        
                        <div className="button-group">
                            <button 
                                type="submit" 
                                className="save-button" 
                                disabled={saving}
                            >
                                {saving ? '保存中...' : '保存する'}
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                                    <polyline points="17 21 17 13 7 13 7 21"></polyline>
                                    <polyline points="7 3 7 8 15 8"></polyline>
                                </svg>
                            </button>
                            
                            <Link href="/admin/blog" className="cancel-button">
                                キャンセル
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    );
}