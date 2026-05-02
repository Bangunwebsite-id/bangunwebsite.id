'use client';

import { useEffect } from 'react';

export function ScrollReveal() {
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('show');
                    }
                });
            },
            { threshold: 0.1 }
        );

        const elements = document.querySelectorAll('.animate-on-scroll');
        elements.forEach((el) => observer.observe(elements.length > 0 ? el : el)); // dummy check for observer

        return () => {
            elements.forEach((el) => observer.unobserve(el));
        };
    }, []);

    return null;
}
