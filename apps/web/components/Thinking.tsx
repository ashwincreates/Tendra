"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface ThinkingCardProps {
  text?: string;
  className?: string;
}

export function ThinkingCard({
  text = "Thinking...",
  className,
}: ThinkingCardProps) {
  return (
    <Card className={cn("w-fit shadow-none border-none py-0", className)}>
      <CardContent className="flex items-center space-x-3 py-4 px-5">
        <Loader2 className="size-5 animate-spin text-muted-foreground" />

        <div className="flex items-center">
          <span className="text-sm text-muted-foreground">{text}</span>
          <motion.span
            className="inline-block ml-1"
            animate={{ opacity: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 1 }}
          >
            .
          </motion.span>
          <motion.span
            className="inline-block"
            animate={{ opacity: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 1, delay: 0.3 }}
          >
            .
          </motion.span>
          <motion.span
            className="inline-block"
            animate={{ opacity: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 1, delay: 0.6 }}
          >
            .
          </motion.span>
        </div>
      </CardContent>
    </Card>
  );
}
