'use client'
import React from "react";
import { useState } from "react";
import "@/app/styles/News.css";
import { db } from "@/firebase";
import { doc, getDoc, getDocs, collection, limit, query} from "firebase/firestore";
import News from "@/app/components/News";
import { link } from "fs";


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
        <div className="news">
            <div className="news-title">
                <h2>news</h2>
            </div>
            <div className="news-list">
                {news.map((newsItem) => (
                    <News title={newsItem.title} date={newsItem.date} link={newsItem.link} key={newsItem.id} />
                ))}
            </div>
        </div>
    )
}