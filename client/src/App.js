import React from 'react';
import { AuthProvider } from './context/AuthContext';
import AppRoute from './routes/AppRoute';

function App() {
    return (
        // The AuthProvider wraps everything so all components can access auth state
        <AuthProvider>
            <AppRoute />
        </AuthProvider>
    );
}

export default App;