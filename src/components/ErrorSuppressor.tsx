'use client';

import { useEffect } from 'react';

export function ErrorSuppressor() {
    useEffect(() => {
        const handleError = (event: ErrorEvent) => {
            // Suppress "Cannot set property ethereum of #<Window> which has only a getter"
            if (
                event.message?.includes('property ethereum') ||
                event.message?.includes('#<Window>')
            ) {
                event.preventDefault();
                console.warn('Suppressed browser extension conflict error:', event.message);
            }
        };

        const handleRejection = (event: PromiseRejectionEvent) => {
            if (
                event.reason?.message?.includes('property ethereum') ||
                event.reason?.message?.includes('#<Window>')
            ) {
                event.preventDefault();
                console.warn('Suppressed browser extension conflict promise rejection:', event.reason);
            }
        };

        window.addEventListener('error', handleError);
        window.addEventListener('unhandledrejection', handleRejection);

        return () => {
            window.removeEventListener('error', handleError);
            window.removeEventListener('unhandledrejection', handleRejection);
        };
    }, []);

    return null;
}
