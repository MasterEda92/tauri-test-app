// CreateClassDialog.tsx
import { useState } from "react";
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
import { Class, classApi } from "@/lib/db";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CaretDownIcon, CheckIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";

// Interface für die Formular-Daten mit korrekten Typen
interface ClassFormData {
  name: string;
  grade: number;
  section: string;
}

// Schema Definition mit angepasster Validierung für grade
const classSchema = z.object({
  name: z.string().min(1, "Klassenname ist erforderlich"),
  grade: z.number().min(1, "Mindestens 1").max(13, "Maximal 13"),
  section: z.string().min(1, "Sektion ist erforderlich").max(1, "Maximal ein Buchstabe"),
});

// Generiere Array mit Jahrgangsstufen 1-13
const grades = Array.from({ length: 13 }, (_, i) => ({
  value: i + 1,  // Direkt als number
  label: `${i + 1}. Jahrgangsstufe`
}));

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
      name: "",
      grade: undefined,
      section: "",
    },
  });

  const onSubmit = async (data: ClassFormData) => {
    setIsSubmitting(true);
    try {
      const newClass: Class = {
        name: data.name,
        grade: data.grade,
        section: data.section
      };
      await classApi.create(newClass);
      reset();
      onOpenChange(false);
      onClassCreated();
    } catch (error) {
      console.error("Failed to create class:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">Neue Klasse</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Neue Klasse anlegen</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            {isSubmitting ? "Wird gespeichert..." : "Speichern"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}