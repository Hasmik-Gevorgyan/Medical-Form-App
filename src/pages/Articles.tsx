import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchArticles } from '../features/articleSlice';
import SortArticles from "../components/SortArticles";
import SearchArticles from "../components/SearchArticles";
import { Row, Col, Card, Typography, Spin, Space, Divider } from 'antd';

const { Title, Paragraph } = Typography;

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

    if (loading) return <Spin size="large" style={{ display: 'block', marginTop: 100 }} />;

    return (
        <div style={{ backgroundColor: '#f0f2f5', minHeight: '100vh', padding: '2rem' }}>
            <Title level={2}>Articles</Title>

            <Space style={{ marginBottom: 24 }} direction="horizontal" size="middle">
                <SearchArticles onSearch={setSearchTerm} />
                <SortArticles onSort={setSortOrder} />
            </Space>

            <Divider />

            <Row gutter={[16, 16]}>
                {displayedArticles.length > 0 ? (
                    displayedArticles.map(article => (
                        <Col xs={24} sm={12} key={article.id}>
                            <Link to={`/article/${article.id}`}>
                                <Card title={article.title} hoverable>
                                    <Paragraph ellipsis={{ rows: 3 }}>{article.content}</Paragraph>
                                </Card>
                            </Link>
                        </Col>
                    ))
                ) : (
                    <Col span={24}>
                        <Paragraph>No articles match your search.</Paragraph>
                    </Col>
                )}
            </Row>
        </div>
    );
};

export default Articles;

