import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchArticles } from '../features/articleSlice';
import SortArticles from "../components/SortArticles.tsx";
import SearchArticles from "../components/SearchArticles.tsx";

const Articles = () => {
    const dispatch = useAppDispatch();
    const { articles, loading } = useAppSelector(state => state.articles);

    const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        dispatch(fetchArticles());
    }, [dispatch]);

    const sortedArticles = [...articles].sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    const displayedArticles = sortedArticles.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <p>Loading...</p>;

    return (
        <div style={{ color: "black" }}>
            <h1>Articles</h1>

            <SortArticles onSort={setSortOrder} />
            <SearchArticles onSearch={(value) => setSearchTerm(value)} />
            {displayedArticles.map(article => (
                <div key={article.id}>
                    <h2>{article.title}</h2>
                    <p>{article.content}</p>
                </div>
            ))}

            {displayedArticles.length === 0 && (
                <p>No articles match your search.</p>
            )}
        </div>
    );
};

export default Articles;

