import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import { ExcelConfigForm } from "./forms/ExcelConfigForm";
import { PostgresConfigForm } from "./forms/PostgresConfigForm";
import { Source } from "@/types/Source";

interface ConfigDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSubmit: (data: any) => void;
}

export function ConfigDialog({ open, setOpen, onSubmit }: ConfigDialogProps) {
  const [source, setSource] = React.useState<Source | null>(null);

  const handleSubmit = (data: any) => {
    onSubmit({ source, config: data });
    setOpen(false);
    setSource(null);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Configuration Source</DialogTitle>
          <DialogDescription>
            Choose the source and configure its connection.
          </DialogDescription>
        </DialogHeader>

        {/* Step 1: Choose source */}
        {!source && (
          <div className="grid gap-4">
            <Card
              className="cursor-pointer hover:bg-muted transition"
              onClick={() => setSource(Source.EXCEL)}
            >
              <CardHeader>
                <CardTitle>📊 Excel File</CardTitle>
              </CardHeader>
              <CardContent>Import data from an Excel file (.xlsx)</CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:bg-muted transition"
              onClick={() => setSource(Source.POSTGRES)}
            >
              <CardHeader>
                <CardTitle>🗄️ Postgres Database</CardTitle>
              </CardHeader>
              <CardContent>Connect to a PostgreSQL database</CardContent>
            </Card>
          </div>
        )}

        {/* Step 2: Show selected form */}
        {source === Source.EXCEL && (
          <ExcelConfigForm
            onBack={() => setSource(null)}
            onSubmit={handleSubmit}
          />
        )}

        {source === Source.POSTGRES && (
          <PostgresConfigForm
            onBack={() => setSource(null)}
            onSubmit={handleSubmit}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
