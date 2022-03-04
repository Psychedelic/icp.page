import { configureStore } from '@reduxjs/toolkit';
import plugReducer from '@/store/features/plug/plug-slice';
import recordsReducer from '@/store/features/records/records-slice'

// define view reducers and activity reducers here
export const store = configureStore({
  reducer: {
    plug: plugReducer,
    records: recordsReducer
  },
  middleware: (getDefaultMiddleware: any) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;

// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
