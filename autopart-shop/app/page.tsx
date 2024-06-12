"use client";

import Banner from "@/components/Banner/banner";
import Card from "@/components/ProductCard/Card";
import { AutoPart } from "@/types";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Navbar } from "@nextui-org/navbar";
import { AuthProvider } from "@/components/context/authContext";

export default function Home() {
  const [autoParts, setAutoParts] = useState<AutoPart[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<AutoPart[]>(
          "http://localhost:4000/shop/autoparts"
        );

        const limitData = response.data.slice(0, 5);
        setAutoParts(limitData);
      } catch (error) {
        console.error("Error fetching auto parts data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center p-24 gap-20">
      <div className="main__container">
        <Banner />
        <div className="autopart__cards flex gap-5 justify-center mt-20">
          {autoParts.map((part) => (
            <Card key={part.id} part={part} />
          ))}
        </div>
      </div>
    </main>
  );
}
