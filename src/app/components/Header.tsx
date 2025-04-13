import Link from "next/link";
import "@/app/styles/Header.css";

export default function Header() {
    return (
        <header className="header">
        <Link href="/">
          <h1>shimaTech</h1>
        </Link>
        <div className="nav">
        <a href="/blog">
            <span>blog</span>
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