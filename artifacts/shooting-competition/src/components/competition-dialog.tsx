// =============================================================================
// competition-dialog.tsx — Modal dialog for adding or renaming a shooting
// discipline (a column in the scores table).
//
// Works similarly to CompetitorDialog:
//   - When `competition` prop is null  → "Add Competition" mode
//   - When `competition` prop has data → "Edit Competition" mode, pre-filled
//
// The dialog only collects a name string. Saving is handled by the parent.
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
import { Competition } from "../types";
import { useLanguage } from "../hooks/use-language";

interface CompetitionDialogProps {
  open: boolean;                           // Whether the dialog is visible
  onOpenChange: (open: boolean) => void;   // Called when the dialog should close
  onSave: (name: string) => void;          // Called with the entered name on save
  competition?: Competition | null;         // If set, the dialog is in edit mode
}

export function CompetitionDialog({
  open,
  onOpenChange,
  onSave,
  competition,
}: CompetitionDialogProps) {
  const { t } = useLanguage();

  // Local state for the single name input.
  const [name, setName] = useState("");

  // Pre-fill the name when opening in edit mode; clear it for add mode.
  useEffect(() => {
    if (open) {
      setName(competition?.name || "");
    }
  }, [open, competition]);

  /** Submit the form: call onSave and close the dialog. */
  const handleSave = () => {
    onSave(name);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>

        <DialogHeader>
          {/* Title switches between "Edit Competition" and "Add Competition" */}
          <DialogTitle>
            {competition ? t.editCompetition : t.addCompetitionTitle}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="disc-name">{t.name}</Label>
            <Input
              id="disc-name"
              value={name}
              onChange={e => setName(e.target.value)}
              autoFocus
              data-testid="input-competition-name"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            data-testid="btn-cancel-competition"
          >
            {t.cancel}
          </Button>

          {/* Disabled until the user has typed something */}
          <Button
            onClick={handleSave}
            disabled={!name.trim()}
            data-testid="btn-save-competition"
          >
            {t.save}
          </Button>
        </DialogFooter>

      </DialogContent>
    </Dialog>
  );
}
