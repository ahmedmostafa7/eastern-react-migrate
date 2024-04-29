import {lazy} from 'react'

export const label = lazy(()=>import('./label'))
export const input = lazy(()=>import('./input'))
export const actions = lazy(()=>import('./actions'))
export const image = lazy(()=>import('./image'))