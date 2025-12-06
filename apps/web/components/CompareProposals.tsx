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
import { Request, Thread } from "@/hooks/useLLMQuery";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { toast } from "sonner";

type Proposals = Request & { Vendor: { id: string; name: string } };

export interface Vendor {
  id: string;
  name: string;
}
interface CompareProposalsProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  thread: Thread | null;
}
export function CompareProposalDialog({
  open,
  setOpen,
  thread,
}: CompareProposalsProps) {
  const {
    data: proposals,
    refetch,
    isLoading,
  } = useQuery<Proposals[]>({
    queryKey: ["proposals"],
    queryFn: async () => {
      if (!thread) return [];
      try {
        const response = await axios
          .get(`http://localhost:8080/proposals/${thread.id}`)
          .then((res) => res.data);
        return response.data.proposals;
      } catch (error) {
        toast.error("Failed to fetch proposals");
        return [];
      }
    },
    throwOnError: false,
  });

  React.useEffect(() => {
    if (open) {
      refetch();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Proposals</DialogTitle>
          <DialogDescription>
            Choose vendors to receive proposals
          </DialogDescription>
          {isLoading && <Loader2 className="animate-spin" />}
          {!isLoading && !proposals?.length && (
            <div>
              <p>No proposals found</p>
            </div>
          )}
          {!isLoading && proposals?.length && (
            <div>
              {(proposals || []).map((proposal, index) => {
                return (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle>{proposal.Vendor.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2">
                        <p>Reqirements: </p>
                        <p>{proposal.requirements}</p>
                        <p>Price: </p>
                        <p>{proposal.budget}</p>
                        <p>Delivery Time: </p>
                        <p>{proposal.delivery}</p>
                        <p>Payment Terms: </p>
                        <p>{proposal.payment}</p>
                        <p>Other Terms: </p>
                        <p>{proposal.otherTerms}</p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
