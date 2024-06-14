"use client";

import Banner from "@/components/Banner/banner";
import Example from "@/components/cart/CartModal";
import { title } from "@/components/primitives";
import Card from "@/components/product/ProductCard/Card";
import FullCard from "@/components/product/ProductCard/FullCard";
import { useFetchAutoParts } from "@/hooks/fetching";
import { AutoPart } from "@/types";
import axios from "axios";
import { useEffect, useState } from "react";

export default function AutoParts() {
  const autoParts = useFetchAutoParts();

  const chunkedAutoParts = (arr: AutoPart[], chunkSize: number) => {
    const chunks = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
      chunks.push(arr.slice(i, i + chunkSize));
    }
    return chunks;
  };

  const autoPartChunks = chunkedAutoParts(autoParts, 5);

  return (
    <main className="flex min-h-screen flex-col items-center p-24 gap-20">
      <div className="main__container">
        <div className="autopart__cards flex gap-5 justify-center mt-20 flex-col">
          {autoParts.map((part) => (
            <FullCard key={part.id} part={part} />
          ))}
        </div>
      </div>
    </main>
  );
}
