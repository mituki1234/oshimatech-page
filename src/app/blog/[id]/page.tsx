'use client'

import { db } from "@/firebase";
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Header from "@/app/components/Header";
import "./blog.css";

type News = {
    title: string;
    content: string;
    date: number | string;
}

export default function PostPage() {
    const params = useParams();
    const id = params?.id as string;

    const [post, setPost] = useState<News | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

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
                    setPost(docSnap.data() as News);
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

    if (loading) {
        return (
            <div className="container-md py-5">
                <div className="card text-center py-5">
                    <p>読み込み中...</p>
                </div>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="container-md py-5">
                <div className="card text-center py-4">
                    <h2>記事が見つかりませんでした</h2>
                    <p className="mb-3">お探しの記事は存在しないか、削除された可能性があります。</p>
                    <Link href="/news" className="button">ニュース一覧に戻る</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <Header />
            <div className="container-md py-5">

                <div className="card">
                    <div className="mb-4 text-secondary">
                        <p className="date">{post.date ? new Date(post.date).toLocaleDateString('ja-JP') : '日付なし'}</p>
                        <h1 className="mb-3">{post.title}</h1>
                    </div>
                    <div
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                </div>
            </div>
        </div>
    );
}