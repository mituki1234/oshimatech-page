import Image from "next/image";
import styles from "./page.module.css";
import Header from "@/app/components/Header";
import Hero from "@/app/components/Hero";
import NewsList from "@/app/components/Newslist";
import About from "@/app/components/About";
import Footer from "@/app/components/Footer";
import "./main.css"

export default function Home() {
  return (
    <div className="page-wrapper">
      <Header />
      <main className="main-content">
        <Hero />
        <NewsList />
        <About />
      </main>
      <Footer />
    </div>
  );
}
