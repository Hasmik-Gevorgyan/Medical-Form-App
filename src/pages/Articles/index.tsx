import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks.ts';
import { fetchArticles } from '@/features/articleSlice.ts';
import SortArticles from "@/components/SortArticles";
import SearchArticles from "@/components/SearchArticles";
import { Row, Col, Card, Typography, Spin, Space, Divider, Pagination } from 'antd';

const { Title, Paragraph } = Typography;

const Articles = () => {
    const dispatch = useAppDispatch();
    const { articles, loading } = useAppSelector(state => state.articles);

    const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 4;

    useEffect(() => {
        dispatch(fetchArticles());
    }, [dispatch]);

    const sortedArticles = [...articles].sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    const filteredArticles = sortedArticles.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const startIndex = (currentPage - 1) * pageSize;
    const paginatedArticles = filteredArticles.slice(startIndex, startIndex + pageSize);

    if (loading) return <Spin size="large" style={{ display: 'block', marginTop: 100 }} />;

    return (
        <div style={{ minHeight: '100vh', padding: '2rem' }}>
            <Title level={2}>Articles</Title>

            <Space style={{ marginBottom: 24 }} direction="horizontal" size="middle">
                <SearchArticles onSearch={setSearchTerm} />
                <SortArticles onSort={setSortOrder} />
            </Space>

            <Divider />

            <Row gutter={[16, 16]}>
                {paginatedArticles.length > 0 ? (
                    paginatedArticles.map(article => (
                        <Col xs={24} sm={12} key={article.id}>
                            <Link to={`/articles/${article.id}`}>
                                <Card title={article.title} hoverable>
                                    {article.imageUrl && (
                                        <img
                                            src={article.imageUrl}
                                            alt={article.title}
                                            style={{
                                                width: '100%',
                                                height: '150px',
                                                objectFit: 'cover',
                                                marginBottom: '10px',
                                                borderRadius: '4px'
                                            }}
                                        />
                                    )}
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

            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                <Pagination
                    current={currentPage}
                    pageSize={pageSize}
                    total={filteredArticles.length}
                    onChange={page => setCurrentPage(page)}
                    showSizeChanger={false}
                />
            </div>
        </div>
    );
};

export default Articles;
