'use client'
import React, { useEffect, useState } from "react";
import Image from "next/image";
import styles from "@/app/page.module.css";
import { db } from "@/firebase";
import Headers from "@/app/components/Header";
import Newslist from "@/app/components/NewsList2";
import Footer from "@/app/components/Footer";
import { ref, get } from "firebase/database";

export default function Home() {
  return (
    <div className="container">
      <Headers />
      <main className={styles.main}>
        <Newslist />
      </main>
      <Footer />
    </div>
  );
}
