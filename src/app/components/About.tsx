import "@/app/styles/About.css"

export default function About() {
    return (
        <section className="about" id="about">
            <div className="container">
                <div className="about-header">
                    <h2>About Us</h2>
                    <div className="divider"></div>
                </div>
                
                <div className="about-content">
                    <div className="about-text">
                        <h3>大島テクノロジーとは？</h3>
                        <p>
                            大島テクノロジーは、ゲームを中心に活動する中学生のプログラミングチームです。
                            ゲームやアプリの開発、公開を行っています。
                        </p>
                        <p>
                            シンプルで使いやすいデザインを大切にしながら、様々なプロジェクトに取り組んでいます。
                            これからも新しい技術に挑戦し続けますので、応援よろしくお願いします。
                        </p>
                        <div className="about-features">
                            <div className="feature">
                                <h4>ゲーム開発</h4>
                                <p>ユニークなゲーム体験をお届けします</p>
                            </div>
                            <div className="feature">
                                <h4>アプリ制作</h4>
                                <p>使いやすいアプリケーションを開発</p>
                            </div>
                            <div className="feature">
                                <h4>技術研究</h4>
                                <p>新しい技術に常に挑戦しています</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}