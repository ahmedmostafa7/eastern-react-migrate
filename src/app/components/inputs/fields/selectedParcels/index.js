import {lazy} from 'react';
export const SelectedParcels = lazy(() => import ('./Component/plan_approval_parcels'));
export const SelectedParcelsView = lazy(() => import ('./Component/selected_parcels_view'));
export const FarzParcels = lazy(() => import ('./Component/farz_parcels'));
export const FarzSuggestedParcels = lazy(() => import ('./Component/farz_suggested_parcels'));