import "@/app/styles/Footer.css";

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-info">
                    <div className="footer-logo">
                        <h3>oshima<span className="accent-text">Tech</span></h3>
                    </div>
                    <p className="footer-description">
                        ゲームを中心に活動する中学生のプログラミングチーム
                    </p>
                </div>

                <div className="footer-links">
                    <div className="footer-links-column">
                        <h4>サイトマップ</h4>
                        <ul>
                            <li><a href="/">ホーム</a></li>
                            <li><a href="/blog">ブログ</a></li>
                            <li><a href="#about">チームについて</a></li>
                        </ul>
                    </div>
                    <div className="footer-links-column">
                        <h4>コンテンツ</h4>
                        <ul>
                            <li><a href="/games">ゲーム</a></li>
                            <li><a href="/blog">最新情報</a></li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <p>© {new Date().getFullYear()} oshimaTech. All rights reserved.</p>
            </div>
        </footer>
    )
}