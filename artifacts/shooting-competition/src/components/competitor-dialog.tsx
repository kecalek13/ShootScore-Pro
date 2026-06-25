import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Competitor } from "../types";

export function CompetitorDialog({
  open,
  onOpenChange,
  onSave,
  competitor
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: Omit<Competitor, "id" | "scores">) => void;
  competitor?: Competitor | null;
}) {
  const [name, setName] = useState("");
  const [teamName, setTeamName] = useState("");

  useEffect(() => {
    if (open) {
      setName(competitor?.name || "");
      setTeamName(competitor?.teamName || "");
    }
  }, [open, competitor]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{competitor ? "Edit Competitor" : "Add Competitor"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={name} onChange={e => setName(e.target.value)} autoFocus data-testid="input-competitor-name" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="team">Team (Optional)</Label>
            <Input id="team" value={teamName} onChange={e => setTeamName(e.target.value)} data-testid="input-competitor-team" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} data-testid="btn-cancel-competitor">Cancel</Button>
          <Button onClick={() => { onSave({ name, teamName }); onOpenChange(false); }} disabled={!name.trim()} data-testid="btn-save-competitor">Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
