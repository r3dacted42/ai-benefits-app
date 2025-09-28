import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, RefreshCw } from 'lucide-react';

import allBenefits from '@/data/benefits.json';
import { LoadingAnimation } from '@/components/LoadingAnimation';

export function BenefitDetails() {
    const { id } = useParams<{ id: string }>();
    const { generateActionPlan } = useAppContext();

    const [actionPlan, setActionPlan] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const benefit = allBenefits.find(b => b.id === id);

    const fetchActionPlan = async () => {
        if (!benefit) return;

        setIsLoading(true);
        setError(null);
        try {
            const plan = await generateActionPlan(benefit.title);
            setActionPlan(plan);
        } catch (err) {
            setError("Failed to generate an action plan. Please try again.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchActionPlan();
    }, [id]);

    if (!benefit) {
        return (
            <div className="text-center p-8">
                <h2 className="text-2xl font-bold">Benefit Not Found</h2>
                <Button asChild className="mt-6">
                    <Link to="/"><ArrowLeft className="mr-2" />Back to Search</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="flex justify-center min-h-screen bg-slate-50 dark:bg-slate-950">
            <div className='w-full p-4 max-w-3xl mx-auto'>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-3xl font-semibold">{benefit.title}</CardTitle>
                        <CardDescription>{benefit.coverage}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p>{benefit.description}</p>
                    </CardContent>
                </Card>

                <div className="mt-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-semibold">Your Action Plan</h2>
                        <Button variant="outline" className='cursor-pointer' size="icon" onClick={fetchActionPlan} disabled={isLoading}>
                            <RefreshCw className={`${isLoading ? 'animate-spin' : ''}`} />
                        </Button>
                    </div>

                    <div className='bg-background p-6 rounded-lg border'>
                        {isLoading ? (
                            <LoadingAnimation />
                        ) : error ? (
                            <p className="text-red-500">{error}</p>
                        ) : (
                            <ol className="list-decimal list-inside space-y-4">
                                {actionPlan.map((step, index) => (
                                    <li key={index} className="pl-2">{step}</li>
                                ))}
                            </ol>
                        )}
                    </div>
                </div>

                <Button className="mt-6" asChild>
                    <Link to="/benefits">
                        <ArrowLeft className='mr-2' />
                        Back to Benefits List
                    </Link>
                </Button>
            </div>
        </div>
    );
}
