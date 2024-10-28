import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Subject, subjectApi } from "@/lib/db";

interface CreateSubjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubjectCreated: () => void;
}

export function CreateSubjectDialog({
  open,
  onOpenChange,
  onSubjectCreated,
}: CreateSubjectDialogProps) {
  const [newSubject, setNewSubject] = useState<Subject>({
    name: "",
    short_name: "",
  });

  async function handleCreateSubject(e: React.FormEvent) {
    e.preventDefault();
    try {
      await subjectApi.create(newSubject);
      setNewSubject({ name: "", short_name: "" });
      onOpenChange(false);
      onSubjectCreated();
    } catch (error) {
      console.error("Failed to create subject:", error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>Neues Fach</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Neues Fach anlegen</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleCreateSubject} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={newSubject.name}
              onChange={(e) =>
                setNewSubject({ ...newSubject, name: e.target.value })
              }
              placeholder="z.B. Mathematik"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="shortName">Kürzel</Label>
            <Input
              id="shortName"
              value={newSubject.short_name}
              onChange={(e) =>
                setNewSubject({ ...newSubject, short_name: e.target.value })
              }
              placeholder="z.B. M"
            />
          </div>
          <Button type="submit" className="w-full">
            Speichern
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}