// components/ui/ClientCalendar.jsx
"use client";

import { useState, useEffect } from "react";
import { Calendar as BaseCalendar } from "@/components/ui/calendar";

export default function Calendar({ date, onDateChange }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient ? (
    <BaseCalendar
      mode="single"
      selected={date}
      onSelect={onDateChange}
      className="rounded-md border"
    />
  ) : (
    <div className="border rounded-md p-4">
      <p className="text-gray-500 text-sm">Loading date picker...</p>
    </div>
  );
}