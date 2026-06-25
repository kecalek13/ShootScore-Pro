import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Competition } from "../types";

export function CompetitionDialog({
  open,
  onOpenChange,
  onSave,
  competition
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (name: string) => void;
  competition?: Competition | null;
}) {
  const [name, setName] = useState("");

  useEffect(() => {
    if (open) {
      setName(competition?.name || "");
    }
  }, [open, competition]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{competition ? "Edit Competition" : "Add Competition"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="comp-name">Name</Label>
            <Input id="comp-name" value={name} onChange={e => setName(e.target.value)} autoFocus data-testid="input-competition-name" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} data-testid="btn-cancel-competition">Cancel</Button>
          <Button onClick={() => { onSave(name); onOpenChange(false); }} disabled={!name.trim()} data-testid="btn-save-competition">Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
