"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Info, AlertCircle, X } from "lucide-react";

type NotificationType = "success" | "info" | "error";

interface NotificationProps {
  message: string;
  type?: NotificationType;
}

const iconMap = {
  success: <CheckCircle className="text-green-500 w-5 h-5" />,
  info: <Info className="text-blue-500 w-5 h-5" />,
  error: <AlertCircle className="text-red-500 w-5 h-5" />,
};

const alertStyleMap = {
  success: "bg-green-50 text-green-700 border-green-400",
  info: "bg-blue-50 text-blue-700 border-blue-400",
  error: "bg-red-50 text-red-700 border-red-400",
};

export function Notification({ message, type = "info" }: Readonly<NotificationProps>) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          id={`notification-${type}`}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          transition={{ duration: 0.3 }}
          className={cn(
            "fixed top-10 right-4 z-50 max-w-md w-full border px-4 py-3 rounded-md shadow-lg flex items-start gap-3",
            alertStyleMap[type]
          )}
        >
          <div data-testid="alert-icon">{iconMap[type]}</div>
          <div className="flex-1 text-sm">{message}</div>
          <button onClick={() => setVisible(false)}>
            <X className="w-4 h-4 text-current" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
