import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Class } from "@/lib/db";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CaretDownIcon, CheckIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";

// Schema und Interfaces aus CreateClassDialog übernommen
export interface ClassFormData {
  name: string;
  grade: number;
  section: string;
}

const classSchema = z.object({
  name: z.string().min(1, "Klassenname ist erforderlich"),
  grade: z.number().min(1, "Mindestens 1").max(13, "Maximal 13"),
  section: z.string().min(1, "Sektion ist erforderlich").max(1, "Maximal ein Buchstabe"),
});

const grades = Array.from({ length: 13 }, (_, i) => ({
  value: i + 1,
  label: `${i + 1}. Jahrgangsstufe`
}));

interface ClassFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ClassFormData) => Promise<void>;
  initialData?: Class;
  triggerButton: React.ReactNode;
  title: string;
  submitButtonText: string;
}

export function ClassFormDialog({
    open,
    onOpenChange,
    onSubmit,
    initialData,
    triggerButton,
    title,
    submitButtonText,
  }: ClassFormDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [openCombobox, setOpenCombobox] = useState(false);
  
    const {
      register,
      handleSubmit,
      reset,
      control,
      formState: { errors },
    } = useForm<ClassFormData>({
      resolver: zodResolver(classSchema),
      defaultValues: {
        name: initialData?.name ?? "",
        grade: initialData?.grade,
        section: initialData?.section ?? "",
      },
    });
  
    // Diese useEffect Hook sorgt dafür, dass die Formulardaten aktualisiert werden
    useEffect(() => {
      if (initialData) {
        reset({
          name: initialData.name,
          grade: initialData.grade,
          section: initialData.section,
        });
      }
    }, [initialData, reset]);
  
    // Diese Funktion wird aufgerufen, wenn sich der Dialog-Status ändert
    const handleOpenChange = (newOpen: boolean) => {
      if (!newOpen) {
        // Wenn der Dialog geschlossen wird, setzen wir die Werte zurück
        reset({
          name: initialData?.name ?? "",
          grade: initialData?.grade,
          section: initialData?.section ?? "",
        });
      }
      onOpenChange(newOpen);
    };
  
    const handleFormSubmit = async (data: ClassFormData) => {
      setIsSubmitting(true);
      try {
        await onSubmit(data);
        onOpenChange(false);        
      } catch (error) {
        console.error("Failed to submit class:", error);
      } finally {
        setIsSubmitting(false);
      }
    };

  // Rest des Formularcodes aus CreateClassDialog übernommen...
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {triggerButton}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {/* Formularfelder aus CreateClassDialog übernommen */}
          <div className="space-y-2">
            <Label 
              htmlFor="name"
              className={errors.name ? "text-red-500" : ""}
            >
              Klassenname
            </Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="z.B. 5a Mathematik"
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
              htmlFor="grade"
              className={errors.grade ? "text-red-500" : ""}
            >
              Jahrgangsstufe
            </Label>
            <Controller
              control={control}
              name="grade"
              render={({ field }) => (
                <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openCombobox}
                      className={cn(
                        "w-full justify-between",
                        errors.grade ? "border-red-500" : "",
                        !field.value && "text-muted-foreground"
                      )}
                      disabled={isSubmitting}
                    >
                      {field.value
                        ? `${field.value}. Jahrgangsstufe`
                        : "Jahrgangsstufe wählen..."}
                      <CaretDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput 
                        placeholder="Jahrgangsstufe suchen..."
                        className="h-9"
                      />
                      <CommandList>
                        <CommandEmpty>Keine Jahrgangsstufe gefunden</CommandEmpty>
                        <CommandGroup className="max-h-60 overflow-auto">
                          {grades.map((grade) => (
                            <CommandItem
                              key={grade.value}
                              value={grade.value.toString()}
                              onSelect={() => {
                                field.onChange(grade.value);
                                setOpenCombobox(false);
                              }}
                              className="cursor-pointer"
                            >
                              {grade.label}
                              <CheckIcon
                                className={cn(
                                  "ml-auto h-4 w-4",
                                  grade.value === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              )}
            />
            {errors.grade && (
              <p className="text-sm text-red-500 mt-1">
                {errors.grade.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label 
              htmlFor="section"
              className={errors.section ? "text-red-500" : ""}
            >
              Klasse
            </Label>
            <Input
              id="section"
              maxLength={1}
              {...register("section")}
              placeholder="z.B. a"
              className={errors.section ? "border-red-500" : ""}
              disabled={isSubmitting}
            />
            {errors.section && (
              <p className="text-sm text-red-500 mt-1">
                {errors.section.message}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Wird gespeichert..." : submitButtonText}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}