import React from 'react';
import { signInWithPassword, signOut, getCurrentUser } from '../services/authService';
import { uploadFile, getPublicUrl } from '../services/storageService';
import { STORAGE_BUCKETS } from '../utils/constants';
import { formatDate } from '../utils/helpers';

const TestPage = () => {
    // Test Auth
    const handleLogin = async () => {
        const { data, error } = await signInWithPassword('test@example.com', 'password123');
        if (error) console.error('Login Error:', error);
        else console.log('Login Success:', data);
    };

    const handleGetUser = async () => {
        const user = await getCurrentUser();
        console.log('Current User:', user);
    };

    // Test Storage
    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const { data, error } = await uploadFile(file, STORAGE_BUCKETS.DOCUMENTS);
        if (error) {
            console.error('Upload Error:', error.message);
        } else {
            console.log('Upload Success:', data);
            // Test getPublicUrl if the bucket were public
            // const urlData = getPublicUrl(STORAGE_BUCKETS.DOCUMENTS, data.path);
            // console.log('Public URL:', urlData?.publicUrl);
        }
    };
    
    // Test Helpers
    const testDate = () => {
        console.log('Formatted Date:', formatDate(new Date()));
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h1>Test Page</h1>
            
            <h2>Auth</h2>
            <button onClick={handleLogin}>Test Login</button>
            <button onClick={handleGetUser}>Get Current User</button>
            <button onClick={() => signOut()}>Test Logout</button>

            <h2>Storage</h2>
            <p>Select a file to upload to the 'documents' bucket:</p>
            <input type="file" onChange={handleFileUpload} />

            <h2>Utils</h2>
            <button onClick={testDate}>Test Date Formatter</button>
        </div>
    );
};

export default TestPage;