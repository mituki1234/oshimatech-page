export default function News({ title, date, link }: { title: string; date: string; link: string }) {
    return (
        <a href={link} className="news-item">
            <h3>{date}</h3>
            <p>{title}</p>
        </a>
    )
}