import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { useAppContext } from '@/context/AppContext';
import { ArrowLeft, ArrowRight, Loader2, SearchX } from 'lucide-react';
import { Link } from 'react-router-dom';

export function BenefitList() {
    const { isLoading, category, benefits } = useAppContext();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="flex items-center text-lg">
                    <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                    Finding benefits...
                </div>
            </div>
        );
    }

    if (!isLoading && benefits.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center p-8">
                    <SearchX className="mx-auto h-16 w-16 text-gray-400" />
                    <h2 className="mt-4 text-2xl font-bold">No Benefits to Show</h2>
                    <p className="mt-2 text-muted-foreground">
                        It looks like you've landed here directly. Please start a new search to see your benefits.
                    </p>
                    <Button asChild className="mt-6">
                        <Link to="/">
                            <ArrowLeft className="mr-2" />
                            Back to Search
                        </Link>
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex justify-center h-screen">
            <div className='flex flex-col w-full p-4 max-w-4xl mx-auto'>
                <div className='flex-shrink-0'>
                    <h1 className='text-4xl font-bold'>{category} Benefits</h1>
                    <p className='text-muted-foreground text-sm'>
                        Here are some benefits that might help you.
                    </p>
                </div>

                <div className="flex-grow scroll-fade">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {benefits.map(benefit => (
                            <Card key={benefit.id} className='gap-2'>
                                <CardHeader className='text-xl font-semibold'>{benefit.title}</CardHeader>
                                <CardContent className='grow-1'>
                                    <p className="text-sm text-muted-foreground">{benefit.coverage}</p>
                                    <p>{benefit.description}</p>
                                </CardContent>
                                <CardFooter className='justify-end'>
                                    <Button variant="link" asChild>
                                        <Link to={`/benefits/${benefit.id}`}>
                                            View Details
                                            <ArrowRight className='ml-2' />
                                        </Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </div>

                <Button className='flex-shrink-0' asChild>
                    <Link to="/">
                        <ArrowLeft className="mr-2" />
                        Search Again
                    </Link>
                </Button>
            </div>
        </div>
    );
}