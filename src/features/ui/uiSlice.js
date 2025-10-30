import { createSlice } from '@reduxjs/toolkit';

/**
 * @typedef {object} Notification
 * @property {string} message - The notification message.
 * @property {'success'|'error'|'info'|'warning'} severity - The type of notification.
 */

/**
 * @typedef {object} UIState
 * @property {Notification|null} notification - The current notification to display.
 * @property {boolean} isModalOpen - Whether a generic modal is open.
 * @property {string|null} modalContent - Identifier for the content to show in the modal.
 */

/** @type {UIState} */
const initialState = {
  notification: null,
  isModalOpen: false,
  modalContent: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    /**
     * Sets a notification to be displayed.
     * @param {UIState} state
     * @param {import('@reduxjs/toolkit').PayloadAction<Notification>} action
     */
    setNotification: (state, action) => {
      state.notification = action.payload;
    },
    /**
     * Clears the current notification.
     * @param {UIState} state
     */
    clearNotification: (state) => {
      state.notification = null;
    },
    /**
     * Opens a modal with specific content.
     * @param {UIState} state
     * @param {import('@reduxjs/toolkit').PayloadAction<string>} action
     */
    openModal: (state, action) => {
      state.isModalOpen = true;
      state.modalContent = action.payload;
    },
    /**
     * Closes the currently open modal.
     * @param {UIState} state
     */
    closeModal: (state) => {
      state.isModalOpen = false;
      state.modalContent = null;
    },
  },
});

export const { setNotification, clearNotification, openModal, closeModal } = uiSlice.actions;

// Selectors
export const selectNotification = (state) => state.ui.notification;
export const selectIsModalOpen = (state) => state.ui.isModalOpen;
export const selectModalContent = (state) => state.ui.modalContent;

export default uiSlice.reducer;