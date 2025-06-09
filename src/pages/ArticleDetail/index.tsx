import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks.ts';
import { Typography, Button, Spin, message } from 'antd';
import { ArrowLeftOutlined, DownloadOutlined } from '@ant-design/icons';
import { useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import dayjs from 'dayjs';
//import { fetchArticles } from "@/features/articleSlice.ts";
import { fetchArticleById } from '@/features/articleSlice.ts'; // Add this


const { Title, Paragraph, Text } = Typography;

const ArticleDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const articleRef = useRef<HTMLDivElement>(null);

    const { articles, loading } = useAppSelector(state => state.articles);

    const articleFromList = articles.find(article => article.id === id);
    const currentArticle = useAppSelector(state => state.articles.currentArticle);
    const article = articleFromList || currentArticle;


    useEffect(() => {
        if (id && !articleFromList) {
            dispatch(fetchArticleById(id));
        }
    }, [id, articleFromList, dispatch]);


    if (!article && loading) {
        return (
            <div style={{ textAlign: 'center', marginTop: '100px' }}>
                <Spin size="large" tip="Loading article..." />
            </div>
        );
    }

    if (!article) return <p>Article not found.</p>;

    const handleDownloadPDF = async () => {
        if (!articleRef.current) return;

        try {
            const images = articleRef.current.getElementsByTagName('img');
            await Promise.all(
                Array.from(images).map(img => {
                    if (!img.complete) {
                        return new Promise<void>((resolve, reject) => {
                            img.onload = () => resolve();
                            img.onerror = () => reject();
                        });
                    }
                    return Promise.resolve();
                })
            );

            const canvas = await html2canvas(articleRef.current, {
                useCORS: true,
                allowTaint: false,
                scale: 2,
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`${article?.title || 'article'}.pdf`);
        } catch (err) {
            message.error("Failed to download PDF.");
            console.error(err);
        }
    };

    return (
        <div style={{ padding: '2rem', backgroundColor: '#fff' }}>
            {/* not in PDF */}
            <Button
                type="link"
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate(-1)}
                style={{ marginBottom: '1rem' }}
            >
                Back to Articles
            </Button>

            {/* in PDF */}
            <div ref={articleRef}>
                <Title>{article.title}</Title>

                {article.imageUrl && (
                    <img
                        src={article.imageUrl}
                        alt="Article"
                        style={{
                            maxWidth: '100%',
                            height: 'auto',
                            marginBottom: '1rem',
                            borderRadius: 8,
                        }}
                    />
                )}

                <Paragraph>{article.content}</Paragraph>

                <div style={{ marginTop: 24 }}>
                    <Text type="secondary">
                        By <strong>{article.authorName}</strong> •{' '}
                        {dayjs(article.createdAt).format('MMMM D, YYYY')}
                    </Text>
                </div>
            </div>

            {/* not in PDF */}
            <Button
                type="primary"
                icon={<DownloadOutlined />}
                onClick={handleDownloadPDF}
                style={{ marginTop: '1rem' }}
            >
                Download as PDF
            </Button>
        </div>
    );
};

export default ArticleDetail;
