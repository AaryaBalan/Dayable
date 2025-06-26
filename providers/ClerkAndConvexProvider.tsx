import { ClerkProvider, useAuth } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import React from 'react';

const convexUrl = process.env.EXPO_PUBLIC_CONVEX_URL;

if (!convexUrl) {
    throw new Error('EXPO_PUBLIC_CONVEX_URL environment variable is not set');
}

const convex = new ConvexReactClient(convexUrl, {
    unsavedChangesWarning: false
});
interface ClerkAndConvexProviderProps {
    children: React.ReactNode;
}

export default function ClerkAndConvexProvider({ children }: ClerkAndConvexProviderProps) {
    return (
        <ClerkProvider tokenCache={tokenCache} publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}>
            <ConvexProviderWithClerk useAuth={useAuth} client={convex}>
                {children}
            </ConvexProviderWithClerk>
        </ClerkProvider>
    )
}