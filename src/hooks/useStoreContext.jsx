import { useContext } from 'react';
import {
  AuthContext,
  TodoContext,
  CategoryContext,
  FilterContext,
  LoginFormContext,
} from '../context/Context';

export const useAuth = () => useContext(AuthContext);

export const useTodos = () => useContext(TodoContext);

export const useCategory = () => useContext(CategoryContext);

export const useFilter = () => useContext(FilterContext);

export const useLoginForm = () => useContext(LoginFormContext);
