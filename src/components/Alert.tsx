"use client";
import { useState } from "react";

export default function Alert({
  children,
  type = "warning",
}: {
  children: React.ReactNode;
  type?: "warning" | "info" | "success" | "error";
}) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  const styles =
    type === "warning"
      ? "bg-white border border-[#b7c6cd] border-l-[20px] border-l-[#ffc107] rounded-sm"
      : type === "success"
      ? "bg-white border border-[#b7c6cd] border-l-[20px] border-l-[#47ad52] rounded-sm"
      : type === "error"
      ? "bg-white border border-[#b7c6cd] border-l-[20px] border-l-[#f44336] rounded-sm"
      : "bg-blue-50 text-blue-900 border-blue-200";

  return (
    <div className={`border ${styles} rounded-lg p-3 text-sm leading-relaxed flex justify-between items-start`}>
      <span>{children}</span>
      <button
        onClick={() => setVisible(false)}
        className="ml-3 text-gray-500 hover:text-gray-700"
        aria-label="Fechar alerta"
      >
        ✕
      </button>
    </div>
  );
}
