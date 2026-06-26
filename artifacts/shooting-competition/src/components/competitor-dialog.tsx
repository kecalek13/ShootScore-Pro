// =============================================================================
// competitor-dialog.tsx — Modal dialog for adding or editing a competitor.
//
// Used for both the "Add Competitor" and "Edit Competitor" workflows:
//   - When `competitor` prop is null  → dialog title says "Add Competitor"
//   - When `competitor` prop has data → dialog title says "Edit Competitor"
//     and the fields are pre-filled with the existing values.
//
// The dialog does NOT save data itself. It calls `onSave` with the entered
// name and team name; the parent component (MainPage) handles the actual
// data mutation.
// =============================================================================

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input }  from "@/components/ui/input";
import { Label }  from "@/components/ui/label";
import { Competitor } from "../types";
import { useLanguage } from "../hooks/use-language";

interface CompetitorDialogProps {
  open: boolean;                                         // Whether the dialog is visible
  onOpenChange: (open: boolean) => void;                 // Called when the dialog should close
  onSave: (data: Omit<Competitor, "id" | "scores">) => void; // Called with form values on save
  competitor?: Competitor | null;                        // If set, the dialog is in edit mode
}

export function CompetitorDialog({
  open,
  onOpenChange,
  onSave,
  competitor,
}: CompetitorDialogProps) {
  const { t } = useLanguage();

  // Local form state — controlled inputs.
  const [name,     setName]     = useState("");
  const [teamName, setTeamName] = useState("");

  // When the dialog opens, populate fields with the existing competitor's
  // data (edit mode) or clear them (add mode).
  useEffect(() => {
    if (open) {
      setName(competitor?.name     || "");
      setTeamName(competitor?.teamName || "");
    }
  }, [open, competitor]);

  /** Submit the form: call onSave and close the dialog. */
  const handleSave = () => {
    onSave({ name, teamName });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>

        <DialogHeader>
          {/* Title changes based on whether we are adding or editing */}
          <DialogTitle>
            {competitor ? t.editCompetitor : t.addCompetitorTitle}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">

          {/* Competitor name — required field */}
          <div className="grid gap-2">
            <Label htmlFor="comp-name">{t.name}</Label>
            <Input
              id="comp-name"
              value={name}
              onChange={e => setName(e.target.value)}
              autoFocus
              data-testid="input-competitor-name"
            />
          </div>

          {/* Team name — optional field */}
          <div className="grid gap-2">
            <Label htmlFor="comp-team">{t.teamOptional}</Label>
            <Input
              id="comp-team"
              value={teamName}
              onChange={e => setTeamName(e.target.value)}
              data-testid="input-competitor-team"
            />
          </div>

        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            data-testid="btn-cancel-competitor"
          >
            {t.cancel}
          </Button>

          {/* Save is disabled while the name field is empty */}
          <Button
            onClick={handleSave}
            disabled={!name.trim()}
            data-testid="btn-save-competitor"
          >
            {t.save}
          </Button>
        </DialogFooter>

      </DialogContent>
    </Dialog>
  );
}
