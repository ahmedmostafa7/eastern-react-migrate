import {lazy} from 'react'
export const boolean = lazy(()=>import('./single'));
export const multiChecks = lazy(()=>import('./multi'));
export const op = lazy(()=>import('./op'));