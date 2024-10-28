import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import { Class } from "@/lib/db";
  
  export interface ClassCardProps {
    class_: Class;
  }
  
  export const ClassCard = ({ class_ }: ClassCardProps) => {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{class_.grade}{class_.section}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{class_.name}</p>
        </CardContent>
      </Card>
    );
  };
  
  export default ClassCard;