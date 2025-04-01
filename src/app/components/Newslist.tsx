'use client'
import React from "react";
import "@/app/styles/News.css";
import { database } from "@/firebase";
import { ref, get } from "firebase/database";
import News from "@/app/components/News";
export default function NewsList() {
    const [news, setNews] = React.useState<any[]>([]);
    const newsRef = ref(database, "news");
    React.useEffect(() => {
        get(newsRef)
            .then((snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    const newsList = Object.keys(data).map((key) => ({
                        id: key,
                        ...data[key],
                    }));
                    setNews(newsList);
                } else {
                    console.log("No data available");
                }
            })
            .catch((error) => {
                console.error("Error getting data:", error);
            });
    }, []);
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
            <a href="/news" className="news-more"><span>lead more</span></a>
        </div>
    )
}