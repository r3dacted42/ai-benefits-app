import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppContext } from '@/context/AppContext';
import { useNavigate } from 'react-router-dom';
import { ThemeToggle } from '@/components/ThemeToggle';

const suggestions = [
    'I have tooth pain, what can I do?',
    'I need new glasses',
    'I need to see a therapist',
    'What are my maternity benefits?',
    'Can I get a health check-up?',
];

export function BenefitInput() {
    const { isLoading, startBenefitSearch } = useAppContext();
    const [inputValue, setInputValue] = useState('');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const abortControllerRef = useRef<AbortController | null>(null);

    const handleSubmit = useCallback(async () => {
        if (!inputValue.trim() || isLoading) return;
        abortControllerRef.current?.abort();
        const controller = new AbortController();
        abortControllerRef.current = controller;

        setError(null);
        try {
            await startBenefitSearch(inputValue, controller.signal);
            navigate('/benefits');
        } catch (err) {
            setError(`${err instanceof Error ? err.message : "An unknown error occurred."}`);
            console.error(err);
        }
    }, [inputValue, startBenefitSearch]);

    useEffect(() => {
        return () => {
            abortControllerRef.current?.abort();
        };
    }, []);

    const handleSuggestionClick = (suggestion: string) => {
        setInputValue(suggestion);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950">
            <div className="absolute top-4 right-4">
                <ThemeToggle />
            </div>
            <Card className="m-4 w-full max-w-lg shadow-lg">
                <CardHeader>
                    <CardTitle className="text-4xl font-bold">Discover Your Benefits</CardTitle>
                    <CardDescription>
                        Tell us about your health need, and we'll find the right benefits for you.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-4">
                        <Label className="text-sm font-medium text-slate-600">
                            Select one of the common needs below:
                        </Label>
                        <div className="flex flex-row flex-wrap gap-2">
                            {suggestions.map((suggestion) => (
                                <Button
                                    key={suggestion}
                                    type="button"
                                    variant="outline"
                                    className="cursor-pointer"
                                    onClick={() => handleSuggestionClick(suggestion)}
                                >
                                    {suggestion}
                                </Button>
                            ))}
                        </div>
                        <Label htmlFor="health-need">...or enter your own:</Label>
                        <Textarea
                            id="health-need"
                            placeholder="Describe your health need..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            disabled={isLoading}
                            rows={4}
                        />
                        {error && (
                            <p className="text-sm font-medium text-red-500">{error}</p>
                        )}
                    </div>
                </CardContent>
                <CardFooter>
                    <Button onClick={handleSubmit} className="w-full cursor-pointer" disabled={isLoading || !inputValue.trim()}>
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 animate-spin" />
                                Analyzing...
                            </>
                        ) : (
                            'Find Benefits'
                        )}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}