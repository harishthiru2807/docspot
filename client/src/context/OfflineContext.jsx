import React, { useState, useEffect, createContext, useContext } from 'react';

const OfflineContext = createContext({ isOnline: true, pendingSync: 0 });
export const useOffline = () => useContext(OfflineContext);

export function OfflineProvider({ children }) {
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [pendingSync, setPendingSync] = useState(() => {
        const q = localStorage.getItem('docspot_offline_queue');
        return q ? JSON.parse(q).length : 0;
    });

    useEffect(() => {
        const goOnline = () => {
            setIsOnline(true);
            // Simulate sync on reconnect
            const q = localStorage.getItem('docspot_offline_queue');
            if (q && JSON.parse(q).length > 0) {
                setTimeout(() => {
                    localStorage.removeItem('docspot_offline_queue');
                    setPendingSync(0);
                }, 2000);
            }
        };
        const goOffline = () => setIsOnline(false);
        window.addEventListener('online', goOnline);
        window.addEventListener('offline', goOffline);
        return () => { window.removeEventListener('online', goOnline); window.removeEventListener('offline', goOffline); };
    }, []);

    const addToQueue = (action) => {
        const q = JSON.parse(localStorage.getItem('docspot_offline_queue') || '[]');
        q.push({ ...action, timestamp: Date.now() });
        localStorage.setItem('docspot_offline_queue', JSON.stringify(q));
        setPendingSync(q.length);
    };

    return (
        <OfflineContext.Provider value={{ isOnline, pendingSync, addToQueue }}>
            {children}
        </OfflineContext.Provider>
    );
}
