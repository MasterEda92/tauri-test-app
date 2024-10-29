import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
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
  import { Class, classApi } from "@/lib/db";
  import { useState } from "react";
  
  export interface ClassCardProps {
    class_: Class;
    onClassDeleted: () => void;
  }
  
  export const ClassCard = ({ class_, onClassDeleted }: ClassCardProps) => {
    const [isDeleting, setIsDeleting] = useState(false);
  
    const handleDelete = async () => {
      try {
        setIsDeleting(true);
        await classApi.delete(class_.id!);
        onClassDeleted();
      } catch (error) {
        console.error("Failed to delete class:", error);
        // Hier könnte eine Toast-Benachrichtigung eingebaut werden
      } finally {
        setIsDeleting(false);
      }
    };
  
    return (
      <Card>
        <CardHeader className="relative">
          <CardTitle>{class_.grade}{class_.section}</CardTitle>
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
                  <AlertDialogTitle>Klasse löschen</AlertDialogTitle>
                  <AlertDialogDescription>
                    Möchten Sie die Klasse {class_.grade}{class_.section} ({class_.name}) wirklich löschen?
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
          <p className="text-muted-foreground">{class_.name}</p>
        </CardContent>
      </Card>
    );
  };
  
  export default ClassCard;