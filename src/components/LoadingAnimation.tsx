import Lottie from 'lottie-react';
import animationData from '@/data/loading-animation.json';

interface LoadingAnimationProps {
    message?: string;
}

export function LoadingAnimation({ message = 'Analyzing...' }: LoadingAnimationProps) {
    return (
        <div className="flex flex-col items-center justify-center">
            <div className="w-32 h-32">
                <Lottie animationData={animationData} loop={true} />
            </div>
            <p className="font-medium text-muted-foreground">{message}</p>
        </div>
    );
}