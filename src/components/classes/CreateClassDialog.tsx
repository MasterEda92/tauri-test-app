import { Button } from "@/components/ui/button";
import { Class, classApi } from "@/lib/db";
import { ClassFormData, ClassFormDialog } from "./ClassFormDialog";

interface CreateClassDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClassCreated: () => void;
}

export function CreateClassDialog({
  open,
  onOpenChange,
  onClassCreated,
}: CreateClassDialogProps) {
  const handleSubmit = async (data: ClassFormData) => {
    const newClass: Class = {
      name: data.name,
      grade: data.grade,
      section: data.section
    };
    await classApi.create(newClass);
    onClassCreated();
  };

  return (
    <ClassFormDialog
      open={open}
      onOpenChange={onOpenChange}
      onSubmit={handleSubmit}
      triggerButton={<Button variant="outline">Neue Klasse</Button>}
      title="Neue Klasse anlegen"
      submitButtonText="Speichern"
    />
  );
}