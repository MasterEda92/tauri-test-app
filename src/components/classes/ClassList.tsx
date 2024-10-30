import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Class, classApi } from "@/lib/db";
import { CreateClassDialog } from "./CreateClassDialog";
import { ClassCard } from "./ClassCard";

export function ClassList() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClasses();
  }, []);

  async function loadClasses() {
    try {
      const allClasses = await classApi.getAll();
      setClasses(allClasses);
    } catch (error) {
      console.error("Failed to load classes:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Klassen</h2>
        <CreateClassDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onClassCreated={loadClasses}
        />
      </div>

      {classes.length === 0 ? (
        <Card>
          <CardContent className="flex justify-center items-center h-32 text-muted-foreground">
            Noch keine Klassen vorhanden
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {classes.map((class_) => (
            <ClassCard 
              key={class_.id} 
              class_={class_} 
              onClassChanged={loadClasses}
            />
          ))}
        </div>
      )}
    </div>
  );
}