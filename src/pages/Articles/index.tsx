import { Pagination, Typography, Row, Col, Spin, Divider, Empty } from 'antd';
import usePaginatedArticles from '@/hooks/usePaginatedArticles';
import SearchArticles from '@/components/SearchArticles';
import SortArticles from '@/components/SortArticles';
import ArticleCard from '@/components/ArticleCard';
import { motion } from 'framer-motion';

const { Title, Paragraph } = Typography;

const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.1 },
    }),
};

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
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div
                    style={{
                        backgroundColor: 'var(--color-bg-container)',
                        color: 'var(--color-text)',
                        padding: '2rem',
                        borderRadius: '16px',
                        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                        maxWidth: '800px',
                        margin: '0 auto 2rem',
                        transition: 'background-color 0.3s, color 0.3s',
                    }}
                >
                    <Title level={2} style={{ textAlign: 'center', color: 'var(--color-text)' }}>
                        Discover Ideas Worth Reading
                    </Title>
                    <Paragraph
                        style={{
                            textAlign: 'center',
                            maxWidth: 700,
                            margin: '0 auto',
                            fontSize: '16px',
                            color: 'var(--color-text)',
                        }}
                    >
                        Our collection of articles is more than just words — it’s a space for fresh perspectives,
                        deep dives, and meaningful insights across topics that matter. Whether you're researching,
                        exploring new trends, or seeking inspiration, there's something here for you. Explore articles
                        written by the doctors from our webpage.
                    </Paragraph>
                </div>
            </motion.div>


            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
            >
                <div
                    style={{
                        display: 'flex',
                        gap: '1rem',
                        marginBottom: 24,
                        justifyContent: 'center',
                        flexWrap: 'wrap',
                    }}
                >
                    <div style={{ flexGrow: 1, minWidth: 250, maxWidth: 700 }}>
                        <SearchArticles onSearch={setSearchTerm} />
                    </div>
                    <div style={{ flexShrink: 0 }}>
                        <SortArticles onSort={setSortOrder} />
                    </div>
                </div>
            </motion.div>


            <Divider />

            {loading && articles.length === 0 ? (
                <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />
            ) : (
                <>
                    <Row gutter={[24, 24]}>
                        {articles.length > 0 ? (
                            articles.map((article, index) => (
                                <Col xs={24} sm={12} key={article.id}>
                                    <motion.div
                                        custom={index}
                                        initial="hidden"
                                        animate="visible"
                                        variants={fadeIn}
                                    >
                                        <ArticleCard article={article} />
                                    </motion.div>
                                </Col>
                            ))
                        ) : (
                            <Col span={24} style={{ textAlign: 'center', marginTop: 50 }}>
                                <Empty
                                    description={
                                        <Paragraph style={{ fontSize: 16 }}>
                                            No articles match your search. Try different keywords.
                                        </Paragraph>
                                    }
                                />
                            </Col>
                        )}
                    </Row>

                    {articles.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            style={{ textAlign: 'center', marginTop: '3rem' }}
                        >
                            <Pagination
                                current={currentPage}
                                pageSize={4}
                                total={total}
                                showSizeChanger={false}
                                onChange={setCurrentPage}
                            />
                        </motion.div>
                    )}
                </>
            )}
        </div>
    );
};

export default Articles;
