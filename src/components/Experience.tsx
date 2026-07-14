"use client";

import { useState } from "react";
import { ChatCourse } from "./course/ChatCourse";

export function Experience() {
  const [runKey, setRunKey] = useState(0);
  return (
    <ChatCourse key={runKey} onRestart={() => setRunKey((k) => k + 1)} />
  );
}
