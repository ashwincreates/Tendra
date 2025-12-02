import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ExcelConfigFormProps {
  onSubmit: (data: any) => void;
  onBack: () => void;
}

export function ExcelConfigForm({ onSubmit, onBack }: ExcelConfigFormProps) {
  const form = useForm({
    defaultValues: {
      data: "",
    },
  });

  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      // Get only the base64 part (strip data:...;base64,)
      const result = reader.result as string;
      const base64 = (result.split(",")[1] ?? "") as string;
      form.setValue("data", base64);
      setFileName(file.name);
    };
    reader.readAsDataURL(file);
  };

  const submit = form.handleSubmit((values) => {
    onSubmit(values);
  });

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="excel-file">Upload Excel File</Label>
        <Input
          id="excel-file"
          type="file"
          accept=".xls,.xlsx,.csv"
          onChange={handleFileUpload}
        />
        {fileName && (
          <p className="text-sm text-muted-foreground mt-1">
            Selected: {fileName}
          </p>
        )}
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="ghost" onClick={onBack}>
          ← Back
        </Button>
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
}
