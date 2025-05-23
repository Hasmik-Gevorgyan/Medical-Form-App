// src/pages/Articles.tsx
import  { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchArticles } from '../features/articleSlice';

const Articles = () => {
    const dispatch = useAppDispatch();
    const { articles, loading } = useAppSelector(state => state.articles);

    useEffect(() => {
        dispatch(fetchArticles());
    }, [dispatch]);

    if (loading) return <p>Loading...</p>;

    return (
        <div>
            <h1>Articles</h1>
            {articles.map(article => (
                <div key={article.id}>
                    <h2>{article.title}</h2>
                    <p>{article.content}</p>
                </div>
            ))}
        </div>
    );
};

export default Articles;
