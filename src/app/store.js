import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import authReducer from '../features/auth/authSlice';
import uiReducer from '../features/ui/uiSlice';
import clientsReducer from '../features/clients/clientsSlice';
import jobsReducer from '../features/jobs/jobsSlice';
import candidatesReducer from '../features/candidates/candidatesSlice';
import remarksReducer from '../features/remarks/remarksSlice';
import publicJobsReducer from '../features/publicJobs/publicJobsSlice';
import staffReducer from '../features/staff/staffSlice';
import projectReducer from '../features/projects/projectSlice';
import referrersReducer from '../features/referrers/referrersSlice';
import settingsReducer from '../features/settings/settingsSlice';
import orientationReducer from '../features/orientation/orientationSlice';
import lineupsReducer from '../features/lineups/lineupsSlice';
import suggestionsReducer from '../features/suggestions/suggestionsSlice';
import detectionReducer from '../features/detection/detectionSlice';
import visitorsReducer from '../features/visitors/visitorsSlice';
import searchReducer from '../features/search/searchSlice';
import notificationsReducer from '../features/notifications/notificationsSlice';
import dashboardReducer from '../features/dashboard/dashboardSlice'; // Import new reducer

// Combine all your reducers into a single root reducer
const rootReducer = combineReducers({
    auth: authReducer,
ui: uiReducer,
clients: clientsReducer,
jobs: jobsReducer,
candidates: candidatesReducer,
remarks: remarksReducer,
publicJobs: publicJobsReducer,
staff: staffReducer,
project: projectReducer,
referrers: referrersReducer,
settings: settingsReducer,
orientation: orientationReducer,
lineups: lineupsReducer,
suggestions: suggestionsReducer,
detection: detectionReducer,
visitors: visitorsReducer,
search: searchReducer,
notifications: notificationsReducer,
dashboard: dashboardReducer, // Add new reducer here
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'settings'], // Only persist these slices. Persisting everything can be buggy.
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);