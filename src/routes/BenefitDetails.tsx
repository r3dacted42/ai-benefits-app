import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, MessageSquareWarning, RefreshCw } from 'lucide-react';

import allBenefits from '@/data/benefits.json';
import { LoadingAnimation } from '@/components/LoadingAnimation';
import type { Benefit } from '@/lib/types';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

export function BenefitDetails() {
    const { id } = useParams<{ id: string }>();
    const { generateActionPlan } = useAppContext();

    const [actionPlan, setActionPlan] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);

    const benefit = allBenefits.find(b => b.id === id) as Benefit;

    const fetchActionPlan = useCallback(async () => {
        if (!benefit) return;
        setIsLoading(true);
        setError(false);
        try {
            const plan = await generateActionPlan(benefit);
            setActionPlan(plan);
        } catch (err) {
            setError(true);
            toast(err instanceof Error ? err.message : "An unknown error occurred.", {
                icon: <MessageSquareWarning />,
                description: "Please try again.",
                duration: Infinity,
                action: { label: 'OK', onClick: () => { fetchActionPlan() } },
            });
        } finally {
            setIsLoading(false);
        }
    }, [benefit]);

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

    function ErrorSkeleton() {
        return (<div className='space-y-4'>
            <div className='space-y-2'>
                <Skeleton className='h-6 w-full' />
                <Skeleton className='h-6 w-2/3' />
            </div>
            <div className='space-y-2'>
                <Skeleton className='h-6 w-full' />
                <Skeleton className='h-6 w-5/6' />
            </div>
            <div className='space-y-2'>
                <Skeleton className='h-6 w-full' />
                <Skeleton className='h-6 w-3/4' />
            </div>
        </div>);
    }

    return (
        <div className="flex justify-center h-full">
            <div className='flex flex-col w-full p-4 max-w-3xl mx-auto'>
                <Card className='flex-shrink-0 gap-2'>
                    <CardHeader>
                        <CardTitle className="text-2xl font-semibold">{benefit.title}</CardTitle>
                        <CardDescription>{benefit.coverage}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {benefit.description}
                    </CardContent>
                </Card>

                <div className="flex-grow flex flex-col mt-4 min-h-0 bg-background p-4 rounded-lg border">
                    <div className="flex-shrink-0 flex items-center justify-between">
                        <h2 className="text-2xl font-semibold">Your Action Plan</h2>
                        <Button variant="outline" className='cursor-pointer' size="icon" onClick={fetchActionPlan} disabled={isLoading}>
                            <RefreshCw className={`${isLoading ? 'animate-spin' : ''}`} />
                        </Button>
                    </div>

                    <div className='flex-grow scroll-fade'>
                        {isLoading ? (
                            <LoadingAnimation />
                        ) : error ? (
                            <ErrorSkeleton />
                        ) : (
                            <div className="space-y-4">
                                {actionPlan.map((step, index) => (
                                    <p key={index} className="pl-2">{step}</p>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <Button className="flex-shrink-0 mt-4" asChild>
                    <Link to="/benefits">
                        <ArrowLeft className='mr-2' />
                        Choose a Different Benefit
                    </Link>
                </Button>
            </div>
        </div>
    );
}
