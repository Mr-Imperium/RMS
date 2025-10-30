import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { supabase } from '../api/supabaseClient';

/**
 * A custom hook to subscribe to Supabase Realtime changes for a specific table.
 * It automatically dispatches Redux actions for INSERT, UPDATE, and DELETE events.
 * 
 * @param {object} config
 * @param {string} config.channelName - The name for the Supabase channel (e.g., 'public:clients').
 * @param {string} config.tableName - The name of the table to listen to.
 * @param {import('@reduxjs/toolkit').ActionCreatorWithPayload} config.upsertAction - The Redux action to dispatch for inserts/updates.
 * @param {import('@reduxjs/toolkit').ActionCreatorWithPayload} config.deleteAction - The Redux action to dispatch for deletes.
 * @param {function} [config.refetcher] - An optional thunk to refetch the entire row with joins if the payload is insufficient.
 */
const useRealtime = ({ channelName, tableName, upsertAction, deleteAction, refetcher }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    // A single subscription is created when the hook is first used in a component.
    const subscription = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: tableName },
        async (payload) => {
          console.log('Realtime change received!', payload);

          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            // If a refetcher function is provided, use it to get the full data with joins.
            // This is crucial when the table view needs related data (e.g., client names).
            if (refetcher) {
              // We pass the ID of the changed record to the refetcher.
              const action = await dispatch(refetcher(payload.new.id));
              if (action.payload) {
                dispatch(upsertAction(action.payload));
              }
            } else {
              // Otherwise, just use the payload from the event.
              dispatch(upsertAction(payload.new));
            }
          } else if (payload.eventType === 'DELETE') {
            // The 'old' property contains the data of the deleted row.
            // We only need the ID to remove it from the Redux store.
            dispatch(deleteAction(payload.old.id));
          }
        }
      )
      .subscribe();

    // The cleanup function is crucial. It runs when the component unmounts,
    // preventing memory leaks and duplicate subscriptions.
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [channelName, tableName, upsertAction, deleteAction, refetcher, dispatch]);

  // This hook doesn't return any JSX, it just performs an effect.
  return null;
};

export default useRealtime;