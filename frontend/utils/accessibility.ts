'use client';

import { useEffect } from 'react';

export function useAccessibilityAudit() {
    useEffect(() => {
        // Simulation of an accessibility audit
        // In a real app, this might use axe-core in development
        const missingAltTags = document.querySelectorAll('img:not([alt])');
        if (missingAltTags.length > 0) {
            console.warn(`[A11Y] Found ${missingAltTags.length} images missing alt text.`);
        }

        const interactiveWithoutLabel = document.querySelectorAll('button:not([aria-label]), a:not([aria-label])');
        if (interactiveWithoutLabel.length > 0) {
            console.warn(`[A11Y] Found ${interactiveWithoutLabel.length} interactive elements missing labels.`);
        }
    }, []);
}

export function trapFocus(elementId: string) {
    const element = document.getElementById(elementId);
    if (!element) return;

    const focusableElements = element.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    element.addEventListener('keydown', (e) => {
        if (e.key !== 'Tab') return;

        if (e.shiftKey) {
            if (document.activeElement === firstElement) {
                lastElement.focus();
                e.preventDefault();
            }
        } else {
            if (document.activeElement === lastElement) {
                firstElement.focus();
                e.preventDefault();
            }
        }
    });
}
