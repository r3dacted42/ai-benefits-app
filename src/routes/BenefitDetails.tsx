import { useCallback, useEffect, useRef, useState } from 'react';
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

    const abortControllerRef = useRef<AbortController | null>(null);

    const benefit = allBenefits.find(b => b.id === id);

    const fetchActionPlan = useCallback(async () => {
        if (!benefit) return;
        abortControllerRef.current?.abort();
        const controller = new AbortController();
        abortControllerRef.current = controller;

        setIsLoading(true);
        setError(null);
        try {
            const plan = await generateActionPlan(benefit.title, controller.signal);
            setActionPlan(plan);
        } catch (err) {
            setError(`${err instanceof Error ? err.message : "An unknown error occurred."}`);
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [benefit, generateActionPlan]);

    useEffect(() => {
        fetchActionPlan();
        return () => {
            abortControllerRef.current?.abort();
        };
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
