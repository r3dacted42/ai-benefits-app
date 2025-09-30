import { useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Croissant, Donut, Loader2, MessageSquareWarning } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppContext } from '@/context/AppContext';
import { useNavigate } from 'react-router-dom';
import { ThemeToggle } from '@/components/theme-toggle';
import { toast } from 'sonner';

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
    const navigate = useNavigate();

    const handleSubmit = useCallback(async () => {
        if (!inputValue.trim() || isLoading) return;
        if (inputValue.toLowerCase().includes("unicorn")) {
            toast("🦄🦄🦄", {
                icon: <Donut />,
                description: "hehe, nice try.",
                duration: Infinity,
                action: { label: <Croissant />, onClick: () => { } },
            });
            return;
        }
        try {
            await startBenefitSearch(inputValue);
            navigate('/benefits');
        } catch (err) {
            toast(err instanceof Error ? err.message : "An unknown error occurred.", {
                icon: <MessageSquareWarning />,
                description: "Please try again.",
                duration: 5000,
                action: { label: 'OK', onClick: () => { } },
            });
        }
    }, [inputValue, startBenefitSearch]);

    const handleSuggestionClick = (suggestion: string) => {
        setInputValue(suggestion);
    };

    return (
        <div className="size-full p-4 overflow-y-auto">
            <div className='min-h-full min-w-full flex flex-col justify-center items-center'>
                <Card className="w-full max-w-lg shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex flex-row justify-between text-3xl font-bold">
                            Discover Your Benefits
                            <ThemeToggle className='self-start' />
                        </CardTitle>
                        <CardDescription>
                            Tell us about your health need, and we'll find the right benefits for you.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-4">
                            <Label>Select one of the common needs below:</Label>
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
        </div>
    );
}