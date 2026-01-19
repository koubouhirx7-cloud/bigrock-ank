import React from 'react';
import styles from './ui.module.css';

// Card
export function Card({ children, className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return <div className={`${styles.card} ${className}`} {...props}>{children}</div>;
}

// Button
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline';
}
export function Button({ children, variant = 'primary', className = '', ...props }: ButtonProps) {
    return (
        <button className={`${styles.button} ${styles[variant]} ${className}`} {...props}>
            {children}
        </button>
    );
}

// Input
export function Input({ className = '', ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
    return <input className={`${styles.input} ${className}`} {...props} />;
}

// Label
export function Label({ children, className = '', ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
    return <label className={`${styles.label} ${className}`} {...props}>{children}</label>;
}

// Textarea
export function Textarea({ className = '', ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
    return <textarea className={`${styles.textarea} ${className}`} {...props} />;
}

// Radio
interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
}
export function Radio({ label, className = '', ...props }: RadioProps) {
    return (
        <label className={`${styles.radioContainer} ${className}`}>
            <input type="radio" className={styles.radioInput} {...props} />
            <span className={styles.radioCustom}></span>
            <span className={styles.radioLabel}>{label}</span>
        </label>
    );
}

// Checkbox
interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
}
export function Checkbox({ label, className = '', ...props }: CheckboxProps) {
    return (
        <label className={`${styles.checkboxContainer} ${className}`}>
            <input type="checkbox" className={styles.checkboxInput} {...props} />
            <span className={styles.checkboxCustom}></span>
            <span className={styles.checkboxLabel}>{label}</span>
        </label>
    );
}
