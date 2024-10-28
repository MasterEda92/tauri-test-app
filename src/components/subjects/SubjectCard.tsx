import { Subject } from "@/lib/db";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";


export interface SubjectCardProps {
    subject: Subject;
    className?: string;
  }
  
  // Separate Komponente für die Subject Card für bessere Wartbarkeit
 export function SubjectCard({ subject, className }: SubjectCardProps) {
    return (
      <Card className={cn("flex flex-col", className)}>
        <CardHeader>
          <CardTitle className="break-words line-clamp-2 overflow-hidden" title={subject.name}>
            {subject.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Kürzel: {subject.short_name}
          </p>
        </CardContent>
      </Card>
    );
  }