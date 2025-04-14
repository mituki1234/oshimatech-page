export default function News({ title, date, link }: { title: string; date: string; link: string }) {
    // 日付を整形
    const formatDate = (dateString: string) => {
        try {
            const dateObj = new Date(dateString);
            return dateObj.toLocaleDateString('ja-JP', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            }).replace(/\//g, '.');
        } catch {
            return dateString; // パースできない場合はそのまま返す
        }
    };

    return (
        <a href={link} className="news-item">
            <div className="news-item-date">{formatDate(date)}</div>
            <h3 className="news-item-title">{title}</h3>
        </a>
    )
}