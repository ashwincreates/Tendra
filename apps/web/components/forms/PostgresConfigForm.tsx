import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface PostgresConfigFormProps {
  onSubmit: (data: any) => void;
  onBack: () => void;
}

export function PostgresConfigForm({
  onSubmit,
  onBack,
}: PostgresConfigFormProps) {
  const form = useForm({
    defaultValues: {
      uri: "",
    },
  });

  const handleSubmit = (values: any) => {
    if (!values.uri) {
      toast.info("Please give a valid url");
      return;
    }
    onSubmit(values); // contains { sheetName, fileName, data }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4 mt-4"
      >
        <FormField
          control={form.control}
          name="uri"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Postgres Url</FormLabel>
              <FormControl>
                <Input placeholder="postgres://..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-between">
          <Button type="button" variant="ghost" onClick={onBack}>
            ← Back
          </Button>
          <Button type="submit">Save</Button>
        </div>
      </form>
    </Form>
  );
}
