'use client'
import React from "react";
import { useState } from "react";
import "@/app/styles/News.css";
import { db } from "@/firebase";
import { doc, getDoc, getDocs, collection, limit, query, orderBy} from "firebase/firestore";
import News from "@/app/components/News";


type News = {
    title: string;
    content: string;
    date: number | string;
}

export default function NewsList() {
    const [news, setNews] = React.useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    React.useEffect(() => {
        async function fetchNews() {
            try {
                // "news" コレクションからすべてのドキュメントを取得
                const querySnapshot = await getDocs(collection(db, "news"));

                // ニュースリストに整形
                const newsList = querySnapshot.docs.map(doc => ({
                    id: doc.id, // "001", "002", ...
                    link: `/blog/${doc.id}`, // "/news/001", "/news/002", ...
                    ...doc.data() // title, date, content
                }));

                setNews(newsList);
            } catch (error) {
                console.error("Error fetching news:", error);
            }
        }

        fetchNews();
    }, []);
    console.log("news", news);
    return (
        <section className="news section">
            <div className="container">
                <div className="news-header">
                    <h2>お知らせ</h2>
                    <div className="divider"></div>
                </div>
                <div className="news-list">
                    {news.length > 0 ? (
                        news.map((newsItem) => (
                            <News title={newsItem.title} date={newsItem.date} link={newsItem.link} key={newsItem.id} />
                        ))
                    ) : (
                        <div className="news-empty">
                            <p>現在お知らせはありません</p>
                        </div>
                    )}
                </div>
                <div className="news-action">
                    <a href="/blog" className="btn-secondary">すべて見る</a>
                </div>
            </div>
        </section>
    )
}