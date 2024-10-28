import { useState, useEffect } from 'react';
import { Class, classApi } from '../../lib/db';
import { ClassForm } from './ClassForm';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export function ClassList() {
    const [classes, setClasses] = useState<Class[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    const loadClasses = async () => {
        try {
            const result = await classApi.getAll();
            setClasses(result);
        } catch (error) {
            console.error('Failed to load classes:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadClasses();
    }, []);

    const handleClassCreated = () => {
        loadClasses();
        setShowForm(false);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col items-center gap-2">
                <h2 className="text-3xl font-bold tracking-tight">Klassen</h2>
                <Button
                    className='w-32'
                    onClick={() => setShowForm(!showForm)}
                    variant="outline"
                >
                    {showForm ? 'Formular schließen' : 'Neue Klasse'}
                </Button>
            </div>

            {showForm && (
                <div className="mb-6">
                    <ClassForm onClassCreated={handleClassCreated} />
                </div>
            )}

            {classes.length === 0 ? (
                <Card>
                    <CardContent className="flex justify-center items-center h-32 text-muted-foreground">
                        Noch keine Klassen vorhanden
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {classes.map(class_ => (
                        <Card key={class_.id}>
                            <CardHeader>
                                <CardTitle>{class_.grade}{class_.section}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">{class_.name}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}