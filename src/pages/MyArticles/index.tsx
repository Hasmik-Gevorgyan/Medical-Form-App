import { Typography, Row, Col, Spin, Divider, Pagination, Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import type { AppDispatch, RootState } from '@/app/store';
import { useEffect } from 'react';
import useAuth from '@/hooks/useAuth';
import { fetchArticles, setCurrentPage, deleteArticle } from '@/features/articleSlice';
import ArticleCard from '@/components/ArticleCard';
import { useNavigate } from 'react-router-dom';
import {ROUTE_PATHS} from "@/routes/paths.ts";

const { Title, Paragraph } = Typography;

const MyArticles = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const { userId, isLoggedIn } = useAuth();

    const {
        myArticles,
        loading,
        total,
        currentPage,
    } = useSelector((state: RootState) => state.articles);

    useEffect(() => {
        if (userId) {
            dispatch(fetchArticles({ limit: 4, page: currentPage, userId }));
        }
    }, [dispatch, currentPage, userId]);

    if (!isLoggedIn) {
        return <Paragraph>You must be logged in to view your articles.</Paragraph>;
    }

    return (
        <div style={{ minHeight: '100vh', padding: '2rem' }}>
            <Title level={2}>My Articles</Title>
            <Button
                type="primary"
                style={{ marginBottom: '1.5rem' }}
                onClick={() => navigate('/add-article')}
            >
                Add New Article
            </Button>
            <Divider />
            <Divider />

            {loading && myArticles.length === 0 ? (
                <Spin size="large" style={{ display: 'block', marginTop: 100 }} />
            ) : (
                <>
                    {/*<Row gutter={[16, 16]}>*/}
                    {/*    {myArticles.length > 0 ? (*/}
                    {/*        myArticles.map(article => (*/}
                    {/*            <Col xs={24} sm={12} key={article.id}>*/}
                    {/*                <ArticleCard*/}
                    {/*                    article={article}*/}
                    {/*                    //editable*/}
                    {/*                    //onEdit={() => navigate(ROUTE_PATHS.EDIT_ARTICLE.replace(':id', article.id!))}*/}
                    {/*                    //onDelete={() => dispatch(deleteArticle(article.id!))}*/}

                    {/*                />*/}
                    {/*            </Col>*/}
                    {/*        ))*/}
                    {/*    ) : (*/}
                    {/*        <Col span={24}>*/}
                    {/*            <Paragraph>You haven't posted any articles yet.</Paragraph>*/}
                    {/*        </Col>*/}
                    {/*    )}*/}
                    {/*</Row>*/}
                    <Row gutter={[16, 16]}>
                        {myArticles.length > 0 ? (
                            myArticles.map(article => (
                                <Col xs={24} sm={12} key={article.id}>
                                    <ArticleCard
                                        article={article}
                                        editable
                                        onEdit={() =>
                                            navigate(ROUTE_PATHS.EDIT_ARTICLE.replace(':id', article.id!))
                                        }
                                        onDelete={() => dispatch(deleteArticle(article.id!))}
                                    />
                                </Col>
                            ))
                        ) : (
                            <Col span={24}>
                                <Paragraph>You haven't posted any articles yet.</Paragraph>
                            </Col>
                        )}
                    </Row>


                    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                        <Pagination
                            current={currentPage}
                            pageSize={4}
                            total={total}
                            showSizeChanger={false}
                            onChange={(page) => dispatch(setCurrentPage(page))}
                        />
                    </div>
                </>
            )}
        </div>
    );
};

export default MyArticles;
