import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "./ui/table";
import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";

export interface Vendor {
  id: string;
  name: string;
}

interface ConfigDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSubmit: (data: { vendors: string[] }) => void;
}

export function PublishDialog({ open, setOpen, onSubmit }: ConfigDialogProps) {
  const [selectedVendors, setSelectedVendors] = React.useState<string[]>([]);
  const { data: vendors, refetch } = useQuery<Vendor[]>({
    queryKey: ["vendors"],
    queryFn: async () => {
      const response = await axios
        .get("http://localhost:8080/vendors/")
        .then((res) => res.data);
      return response.data.vendors;
    },
    throwOnError: false,
  });

  const handleSubmit = (data: any) => {
    onSubmit({ vendors: selectedVendors });
  };

  React.useEffect(() => {
    if (open) {
      refetch();
    }
  }, [open]);

  const handleVendors = (id: string) => {
    setSelectedVendors((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Request</DialogTitle>
          <DialogDescription>
            Choose vendors to receive proposals
          </DialogDescription>
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell>
                  <div>
                    <Checkbox disabled />
                  </div>
                </TableCell>
                <TableCell>Vendor</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(vendors || []).map((vendor) => (
                <TableRow key={vendor.id}>
                  <TableCell>
                    <div>
                      <Checkbox
                        onCheckedChange={() => handleVendors(vendor.id)}
                      />
                    </div>
                  </TableCell>
                  <TableCell>{vendor.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={() => handleSubmit({ vendors: selectedVendors })}>
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
