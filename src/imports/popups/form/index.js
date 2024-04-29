import {lazy} from 'react'
export const create = lazy(() => (import("./create")))
export const edit = lazy(()=>(import("./edit")))
export const confirm = lazy(()=>(import("./confirm")))
