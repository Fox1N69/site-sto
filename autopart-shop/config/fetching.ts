"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { AutoPart } from "@/types";

export const useFetchAutoParts = () => {
  const [autoParts, setAutoParts] = useState<AutoPart[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<AutoPart[]>(
          "http://localhost:4000/shop/autoparts"
        );

        setAutoParts(response.data);
      } catch (error) {
        console.error("Error fetching auto parts data:", error);
      }
    };

    fetchData();
  }, []);

  return autoParts;
};
