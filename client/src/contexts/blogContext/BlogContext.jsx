import { useState, createContext, useContext } from 'react';

export const BlogContext = createContext(null);

export const useBlogContext = () => useContext(BlogContext);