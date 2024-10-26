import { useState } from 'react';
import { Class, classApi } from '../../lib/db';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

// Validierungsschema für das Formular
const formSchema = z.object({
  name: z.string().min(1, 'Klassenname ist erforderlich'),
  grade: z.string().transform(val => parseInt(val, 10))
    .pipe(z.number().min(1, 'Mindestens 1').max(13, 'Maximal 13')),
  section: z.string().min(1, 'Sektion ist erforderlich').max(1, 'Maximal ein Buchstabe'),
});

interface ClassFormProps {
    onClassCreated: () => void;
}

export function ClassForm({ onClassCreated }: ClassFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            grade: 0,
            section: '',
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsSubmitting(true);
        try {
            const newClass: Class = {
                name: values.name,
                grade: values.grade,
                section: values.section
            };

            await classApi.create(newClass);
            form.reset();
            onClassCreated();
        } catch (err) {
            console.error('Failed to create class:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Neue Klasse anlegen</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Klassenname</FormLabel>
                                    <FormControl>
                                        <Input placeholder="z.B. Mathematik" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="grade"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Jahrgangsstufe</FormLabel>
                                    <FormControl>
                                        <Input 
                                            type="number" 
                                            min={1} 
                                            max={13}
                                            placeholder="1-13"
                                            {...field} 
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="section"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Klasse</FormLabel>
                                    <FormControl>
                                        <Input 
                                            maxLength={1}
                                            placeholder="z.B. a"
                                            {...field} 
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button 
                            type="submit" 
                            className="w-full"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Wird gespeichert...' : 'Klasse anlegen'}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
