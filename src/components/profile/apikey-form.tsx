"use client";

import { useToast } from "@/components/ui/use-toast";
import { ClipboardCopyIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export function ApiKeyForm({ apiKey }: { apiKey: string }) {
  const { toast } = useToast();

  const handleCopyClick = () => {
    navigator.clipboard.writeText(apiKey);
    toast({ description: "API key byl zkopírován do schránky." });
  };

  return (
    <>
      <div>
        <Label>API Key</Label>
        <Input className="select-all" name={"apiKey"} value={apiKey} readOnly />
      </div>
      <Button onClick={handleCopyClick}>
        <ClipboardCopyIcon />
      </Button>
    </>
  );
}
