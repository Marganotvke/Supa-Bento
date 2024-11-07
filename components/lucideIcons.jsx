import { lazy } from 'react';
import dynamicIconImports from 'lucide-react/dynamicIconImports';

export function _genLucideIcon({iconString, ...props}){
    const LucideIcon = lazy(dynamicIconImports[iconString]);
    return (
        <LucideIcon {...props} />
    )
}