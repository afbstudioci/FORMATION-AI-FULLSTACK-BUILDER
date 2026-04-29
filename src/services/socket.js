import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

export const socket = io(SOCKET_URL, {
  withCredentials: true,
  autoConnect: true
});

export const subscribeToExams = (cb) => {
  socket.on('new_exam', (exam) => cb(exam));
};

export const subscribeToSubmissions = (cb) => {
  socket.on('new_submission', (submission) => cb(submission));
};
