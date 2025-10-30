import { useDispatch, useSelector } from 'react-redux';

/**
 * A pre-typed version of the `useDispatch` hook.
 * @returns {import('@reduxjs/toolkit').Dispatch}
 */
export const useAppDispatch = () => useDispatch();

/**
 * A pre-typed version of the `useSelector` hook.
 * @type {import('react-redux').TypedUseSelectorHook<import('./store').RootState>}
 */
export const useAppSelector = useSelector;
