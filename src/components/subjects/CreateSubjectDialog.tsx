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
import { subjectApi } from "@/lib/db";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Schema Definition
const subjectSchema = z.object({
    name: z.string().min(1, "Der Name des Fachs ist erforderlich"),
    short_name: z.string().min(1, "Das Kürzel ist erforderlich"),
  });
  
  // TypeScript Typ aus dem Schema ableiten
  type SubjectFormData = z.infer<typeof subjectSchema>;

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
    const [isSubmitting, setIsSubmitting] = useState(false);
  
    const {
      register,
      handleSubmit,
      reset,
      formState: { errors },
    } = useForm<SubjectFormData>({
      resolver: zodResolver(subjectSchema),
      defaultValues: {
        name: "",
        short_name: "",
      },
    });
  
    const onSubmit = async (data: SubjectFormData) => {
      setIsSubmitting(true);
      try {
        await subjectApi.create(data);
        reset();
        onOpenChange(false);
        onSubjectCreated();
      } catch (error) {
        console.error("Failed to create subject:", error);
      } finally {
        setIsSubmitting(false);
      }
    };
  
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>
          <Button variant="outline">Neues Fach</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Neues Fach anlegen</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label 
                htmlFor="name" 
                className={errors.name ? "text-red-500" : ""}
              >
                Name
              </Label>
              <Input
                id="name"
                {...register("name")}
                placeholder="z.B. Mathematik"
                className={errors.name ? "border-red-500" : ""}
                disabled={isSubmitting}
              />
              {errors.name && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label 
                htmlFor="shortName" 
                className={errors.short_name ? "text-red-500" : ""}
              >
                Kürzel
              </Label>
              <Input
                id="shortName"
                {...register("short_name")}
                placeholder="z.B. M"
                className={errors.short_name ? "border-red-500" : ""}
                disabled={isSubmitting}
              />
              {errors.short_name && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.short_name.message}
                </p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Wird gespeichert..." : "Speichern"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    );
  }