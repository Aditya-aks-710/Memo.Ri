import type { ReactNode } from "react";


export type LogoIconprops = {
    className?: string;
};

export type SubSidebarProps = {
    icon?: React.ElementType;
    title?: string;
    onClick?: () => void;
};

export type NavbarProps = {
    title?: string;
    image: string;
};

export type InputProps = {
    type: string;
    placeholder?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    name: string;
};

const contentTypes = ['image', 'video', 'pdf', 'article', 'audio'] as const;
export type ContentTypes = typeof contentTypes[number];

export type CardProps = {
    title: string;
    link: string;
    type: ContentTypes;
    tags: string | string[];
    previewhtml?: string;
    onDelete?: () => void;
};

export type AuthRouteProps = {
    children: ReactNode;
};