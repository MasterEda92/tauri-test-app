import { useEffect, useState } from "react";
import { Subject, subjectApi } from "@/lib/db";
import { CreateSubjectDialog } from "./CreateSubjectDialog";
import { SubjectCard } from "./SubjectCard";
import { Card, CardContent } from "../ui/card";

export function SubjectList() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);  // Neuer State für Loading

  useEffect(() => {
    loadSubjects();
  }, []);

  async function loadSubjects() {
    try {
      setLoading(true);
      const allSubjects = await subjectApi.getAll();
      setSubjects(allSubjects);
    } catch (error) {
      console.error("Failed to load subjects:", error);
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
        <h2 className="text-3xl font-bold">Fächer</h2>
        <CreateSubjectDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSubjectCreated={loadSubjects}
        />
      </div>
      {subjects.length === 0 ? (
        <Card>
          <CardContent className="flex justify-center items-center h-32 text-muted-foreground">
            Noch keine Fächer vorhanden
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects.map((subject) => (
            <SubjectCard 
              key={subject.id} 
              subject={subject} 
              onSubjectDeleted={loadSubjects}
            />
          ))}
        </div>
      )}
    </div>
  );
}