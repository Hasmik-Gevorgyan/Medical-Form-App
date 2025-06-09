// src/hooks/usePaginatedArticles.ts
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { fetchArticles, setCurrentPage } from '@/features/articleSlice';

const PAGE_LIMIT = 4;

const usePaginatedArticles = ({ userId }: { userId?: string } = {}) => {
    const dispatch = useAppDispatch();
    const { articles, loading, currentPage, total } = useAppSelector(state => state.articles);

    const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

    // Debounce search input
    useEffect(() => {
        const timeout = setTimeout(() => setDebouncedSearchTerm(searchTerm), 300);
        return () => clearTimeout(timeout);
    }, [searchTerm]);

    // Reset page to 1 when search or sort changes
    useEffect(() => {
        dispatch(setCurrentPage(1));
    }, [sortOrder, debouncedSearchTerm]);

    // Fetch articles
    useEffect(() => {
        dispatch(fetchArticles({ page: currentPage, limit: PAGE_LIMIT, userId }));
    }, [currentPage, dispatch, userId]);

    // Sort + Filter locally
    const sorted = [...articles].sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    const filtered = sorted.filter(article =>
        article.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        article.content.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );

    return {
        articles: filtered,
        loading,
        currentPage,
        total,
        setCurrentPage: (page: number) => dispatch(setCurrentPage(page)),
        sortOrder,
        setSortOrder,
        searchTerm,
        setSearchTerm,
    };
};

export default usePaginatedArticles;
