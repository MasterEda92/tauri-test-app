import { Subject, subjectApi } from "@/lib/db";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useState } from "react";

export interface SubjectCardProps {
  subject: Subject;
  className?: string;
  onSubjectDeleted: () => void;
}

export function SubjectCard({ subject, className, onSubjectDeleted }: SubjectCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await subjectApi.delete(subject.id!);
      onSubjectDeleted();
    } catch (error) {
      console.error("Failed to delete subject:", error);
      // Hier könnte eine Toast-Benachrichtigung eingebaut werden
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className={cn("flex flex-col relative", className)}>
      <CardHeader>
        <CardTitle 
          className="break-words line-clamp-2 overflow-hidden pr-8" 
          title={subject.name}
        >
          {subject.name}
        </CardTitle>
        <div className="absolute top-4 right-4">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-red-500"
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Fach löschen</AlertDialogTitle>
                <AlertDialogDescription>
                  Möchten Sie das Fach {subject.name} ({subject.short_name}) wirklich löschen?
                  Diese Aktion kann nicht rückgängig gemacht werden.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDelete}
                  className="bg-red-500 hover:bg-red-600"
                  disabled={isDeleting}
                >
                  {isDeleting ? "Wird gelöscht..." : "Löschen"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Kürzel: {subject.short_name}
        </p>
      </CardContent>
    </Card>
  );
}