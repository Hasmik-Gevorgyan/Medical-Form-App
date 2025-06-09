// src/pages/Articles.tsx
import {Pagination, Typography, Row, Col, Spin, Space, Divider} from 'antd';
import usePaginatedArticles from '@/hooks/usePaginatedArticles';
import SearchArticles from '@/components/SearchArticles';
import SortArticles from '@/components/SortArticles';
import ArticleCard from '@/components/ArticleCard';
const { Title, Paragraph } = Typography;

const Articles = () => {

    const {
        articles,
        loading,
        currentPage,
        total,
        setCurrentPage,
        setSortOrder,
        setSearchTerm,
    } = usePaginatedArticles();

    return (
        <div style={{ minHeight: '100vh', padding: '2rem' }}>
            <Title level={2}>Articles</Title>

            <Space style={{ marginBottom: 24 }} direction="horizontal" size="middle">
                <SearchArticles onSearch={setSearchTerm} />
                <SortArticles onSort={setSortOrder} />
            </Space>

            <Divider />

            {loading && articles.length === 0 ? (
                <Spin size="large" style={{ display: 'block', marginTop: 100 }} />
            ) : (
                <>
                    <Row gutter={[16, 16]}>
                        {articles.length > 0 ? (
                            articles.map(article => (
                                <Col xs={24} sm={12} key={article.id}>
                                    <ArticleCard article={article} />
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
                            pageSize={4}
                            total={total}
                            showSizeChanger={false}
                            onChange={setCurrentPage}
                        />
                    </div>
                </>
            )}
        </div>
    );
};

export default Articles;
