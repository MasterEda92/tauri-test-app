import { Button } from "@/components/ui/button";
import { subjectApi } from "@/lib/db";
import { SubjectFormData, SubjectFormDialog } from "./SubjectFormDialog";

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
  const handleSubmit = async (data: SubjectFormData) => {
    await subjectApi.create(data);
    onSubjectCreated();
  };

  return (
    <SubjectFormDialog
      open={open}
      onOpenChange={onOpenChange}
      onSubmit={handleSubmit}
      triggerButton={<Button variant="outline">Neues Fach</Button>}
      title="Neues Fach anlegen"
      submitButtonText="Speichern"
    />
  );
}