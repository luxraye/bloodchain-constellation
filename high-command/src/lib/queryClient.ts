import { QueryClient } from '@tanstack/react-query';

const isGuestDemo =
    typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('guest') === '1';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 30_000,
            retry: isGuestDemo ? false : 2,
            refetchOnWindowFocus: false,
        },
    },
});
