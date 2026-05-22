'use client';

import React from 'react';

import { useLogoutBusiness, useLogoutController } from './hooks';

/**
 * Logout View (Symbolic)
 *
 * Basic logout confirmation component as template example.
 * Projects should customize with their specific requirements and styling.
 */
export const LogoutView = () => {
  // Business logic layer
  const { logout, isAuthenticated } = useLogoutBusiness();

  // UI controller layer
  const { showConfirmation, handleLogoutClick, handleConfirmLogout, handleCancelLogout } = useLogoutController();

  if (!isAuthenticated) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>You are not logged in.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto', textAlign: 'center' }}>
      <h2>Logout</h2>
      <p style={{ color: '#666', fontSize: '14px', marginBottom: '20px' }}>
        This is a symbolic logout component. Projects should customize with their own styling and requirements.
      </p>

      {!showConfirmation ? (
        <button
          style={{
            padding: '10px 20px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
          onClick={handleLogoutClick}
        >
          Logout
        </button>
      ) : (
        <>
          <p style={{ marginBottom: '20px' }}>Are you sure you want to log out?</p>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button
              style={{
                padding: '10px 20px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
              onClick={handleConfirmLogout(logout)}
            >
              Yes, Logout
            </button>

            <button
              style={{
                padding: '10px 20px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
              onClick={handleCancelLogout}
            >
              Cancel
            </button>
          </div>
        </>
      )}
    </div>
  );
};
