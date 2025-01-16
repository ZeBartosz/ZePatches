"use client";
import { Observer } from "tailwindcss-intersect";
import React, { useEffect } from "react";

export default function ObserverProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    useEffect(() => {
        Observer.start();
    }, []);

    return <>{children}</>;
}
