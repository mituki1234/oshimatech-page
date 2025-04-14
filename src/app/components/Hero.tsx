import "@/app/styles/Hero.css";

export default function Hero() {
    return (
        <div className="hero">
            <div className="hero-content">
                <h1 className="hero-title">oshima<span className="accent-text">Tech</span></h1>
                <p className="hero-subtitle">大島のプログラミングチーム</p>
                <div className="hero-buttons">
                    <a href="#about" className="btn-primary">詳しく見る</a>
                    <a href="/blog" className="btn-secondary">ブログを読む</a>
                </div>
            </div>
        </div>
    )
}