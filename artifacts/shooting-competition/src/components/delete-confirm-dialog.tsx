// =============================================================================
// delete-confirm-dialog.tsx — A safety confirmation dialog shown before any
// destructive delete action (removing a competitor or a competition column).
//
// Uses shadcn's <AlertDialog> which is specifically designed for dangerous
// actions — it cannot be closed by clicking outside, forcing the user to make
// an explicit choice.
//
// The title and description text are passed as props by the parent so this
// component can be reused for both competitor and competition deletion.
// =============================================================================

import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useLanguage } from "../hooks/use-language";

interface DeleteConfirmDialogProps {
  open: boolean;                         // Whether the dialog is visible
  onOpenChange: (open: boolean) => void; // Called when the dialog should close
  onConfirm: () => void;                 // Called when the user clicks "Delete"
  title: string;                         // Dialog heading (e.g. "Delete Competitor")
  description: string;                   // Explanation sentence shown to the user
}

export function DeleteConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
}: DeleteConfirmDialogProps) {
  const { t } = useLanguage();

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>

        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          {/* Cancel — closes the dialog without doing anything */}
          <AlertDialogCancel data-testid="btn-cancel-delete">
            {t.cancel}
          </AlertDialogCancel>

          {/* Confirm delete — styled in destructive red to signal danger */}
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            data-testid="btn-confirm-delete"
          >
            {t.confirmDelete}
          </AlertDialogAction>
        </AlertDialogFooter>

      </AlertDialogContent>
    </AlertDialog>
  );
}
