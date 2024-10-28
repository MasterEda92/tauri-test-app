import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Subject, subjectApi } from "@/lib/db";
import { CreateSubjectDialog } from "./CreateSubjectDialog";

export function SubjectList() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    loadSubjects();
  }, []);

  async function loadSubjects() {
    try {
      const allSubjects = await subjectApi.getAll();
      setSubjects(allSubjects);
    } catch (error) {
      console.error("Failed to load subjects:", error);
    }
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {subjects.map((subject) => (
          <Card key={subject.id}>
            <CardHeader>
              <CardTitle>{subject.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Kürzel: {subject.short_name}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}