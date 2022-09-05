import React from 'react';
import TodoProvider from './TodoProvider';
import CategoryProvider from './CategoryProvider';
import AuthProvider from './AuthProvider';
import LoginFormProvider from './LoginFormProvider';
import UserProvider from './UserProvider';
import TodoFilterProvider from './TodoFilterProvider';

const ContextProvider = ({ children }) => {
  return (
    <AuthProvider>
      <LoginFormProvider>
        <UserProvider>
          <TodoProvider>
            <TodoFilterProvider>
              <CategoryProvider>{children}</CategoryProvider>
            </TodoFilterProvider>
          </TodoProvider>
        </UserProvider>
      </LoginFormProvider>
    </AuthProvider>
  );
};

export default ContextProvider;
