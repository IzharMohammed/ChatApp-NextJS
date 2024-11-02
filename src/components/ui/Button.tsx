// Import necessary utility functions and components
import { cn } from '@/lib/utils' // Utility function for class name manipulation
import { cva, VariantProps } from 'class-variance-authority' // Function for handling class variants
import { Loader2 } from 'lucide-react' // Loader component for loading state indication
import React, { ButtonHTMLAttributes, FC } from 'react' // React and TypeScript types

// Define button variants using class-variance-authority
export const buttonVariants = cva(
    'active:scale-95 inline-flex items-center justify-center rounded-md text-sm font-medium transition-color focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
    {
        // Variants for different styles and sizes of the button
        variants: {
            variant: {
                default: 'bg-slate-900 text-white hover:bg-slate-800', // Default button style
                ghost: 'bg-transparent hover:text-slate-900 hover:bg-slate-200', // Ghost button style
            },
            size: {
                default: 'h-10 py-2 px-4', // Default size
                sm: 'h-9 px-2', // Small size
                lg: 'h-11 px-8', // Large size
            },
        },
        // Default variants if none are specified
        defaultVariants: {
            variant: 'default', // Default variant is 'default'
            size: 'default', // Default size is 'default'
        },
    }
)

// Define the props for the Button component
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
    isLoading?: boolean // Optional prop to indicate loading state
}

// Create the Button component
const Button: FC<ButtonProps> = ({ className, children, variant, isLoading, size, ...props }) => {
    return (
        <button
            className={cn(buttonVariants({ variant, size, className }))} // Apply variants and additional class names
            disabled={isLoading} // Disable the button if loading
            {...props} // Spread additional props to the button element
        >
            {isLoading ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : null} // Show loader if loading
            {children} // Render the button's children
        </button>
    )
}

// Export the Button component as default
export default Button
