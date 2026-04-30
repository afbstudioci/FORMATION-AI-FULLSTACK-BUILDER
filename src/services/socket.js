import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

export const socket = io(SOCKET_URL, {
  withCredentials: true,
  autoConnect: true
});

export const joinAdminRoom = () => {
  socket.emit('join_admin');
};

export const subscribeToExams = (cb) => {
  socket.on('examCreated', (exam) => cb(exam));
};

export const subscribeToSubmissions = (cb) => {
  if (!socket) return;
  socket.on('newSubmission', cb);
};

export const subscribeToSubmissionUpdates = (cb) => {
  if (!socket) return;
  socket.on('submissionUpdate', cb);
};

export const subscribeToDeletedExams = (cb) => {
  socket.on('examDeleted', (examId) => cb(examId));
};

export const subscribeToUserRegistered = (cb) => {
  socket.on('userRegistered', (user) => cb(user));
};

// Utilitaire pour nettoyer les écoutes et éviter les fuites de mémoire
export const unsubscribeAll = () => {
  socket.off('examCreated');
  socket.off('newSubmission');
  socket.off('examDeleted');
  socket.off('userRegistered');
};