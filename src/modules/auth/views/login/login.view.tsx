'use client';

import React from 'react';

import { useLoginBusiness, useLoginController } from './hooks';

/**
 * Login View (Symbolic)
 *
 * Basic login form structure as template example.
 * Projects should customize with their specific requirements and styling.
 */
export const LoginView = () => {
  // Business logic layer
  const { login, isLoading, error } = useLoginBusiness();

  // UI controller layer
  const { credentials, handleEmailChange, handlePasswordChange, handleSubmit } = useLoginController();

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h2>Login</h2>
      <p style={{ color: '#666', fontSize: '14px', marginBottom: '20px' }}>
        This is a symbolic login form. Projects should customize with their own styling and requirements.
      </p>

      <form onSubmit={handleSubmit(login)}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="email">Email:</label>
          <input
            required
            id="email"
            style={{
              width: '100%',
              padding: '8px',
              marginTop: '5px',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
            type="email"
            value={credentials.email}
            onChange={handleEmailChange}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="password">Password:</label>
          <input
            required
            id="password"
            style={{
              width: '100%',
              padding: '8px',
              marginTop: '5px',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
            type="password"
            value={credentials.password}
            onChange={handlePasswordChange}
          />
        </div>

        {error && <div style={{ color: 'red', marginBottom: '15px', fontSize: '14px' }}>{error.message}</div>}

        <button
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: isLoading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
          }}
          type="submit"
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};
