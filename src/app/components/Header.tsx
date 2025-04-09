import "@/app/styles/Header.css";

export default function Header() {
    return (
        <header className="header">
        <div className="logo">
          <h1>shimaTech</h1>
        </div>
        <div className="nav">
        <a href="/news">
            <span>news</span>
          </a>
          <a href="/#about">
            <span>about</span>
          </a>
          <a href="/games">
            <span>games</span>
          </a>
        </div>
      </header>
    )
}