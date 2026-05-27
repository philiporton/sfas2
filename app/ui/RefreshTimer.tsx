"use client";

import React, { useState, useEffect } from "react";

export default function RefreshTimer() {
  const [secondsUntilRefresh, setSecondsUntilRefresh] = useState(5 * 60); // 300 seconds (5 minutes)

  useEffect(() => {
    const countdownId = setInterval(() => {
      setSecondsUntilRefresh((prev) => (prev > 0 ? prev - 1 : 5 * 60));
    }, 1000); // Update every second

    return () => clearInterval(countdownId); // Cleanup on unmount
  }, []);

  const minutes = Math.floor(secondsUntilRefresh / 60);
  const seconds = (secondsUntilRefresh % 60).toString().padStart(2, '0');

  return (
    <div className="mt-4 text-left text-gray-600 text-sm">
      Map will refresh in {minutes}:{seconds}
    </div>
  );
}
