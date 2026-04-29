import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { socket, joinAdminRoom } from '../services/socket';

export const useGlobalSocket = () => {
    const { user } = useAuth();
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        if (!user) return;

        if (user.role === 'admin') {
            // L'administrateur rejoint sa salle sécurisée
            joinAdminRoom();

            const handleNewSubmission = (submission) => {
                const studentName = submission.user?.fullname || 'Un étudiant';
                const examTitle = submission.exam?.title || 'une épreuve';
                setNotification(`Nouvelle copie soumise par ${studentName} pour l'épreuve : ${examTitle}`);
            };

            socket.on('newSubmission', handleNewSubmission);

            return () => {
                socket.off('newSubmission', handleNewSubmission);
            };
        }
    }, [user]);

    const clearNotification = () => setNotification(null);

    return { notification, clearNotification };
};