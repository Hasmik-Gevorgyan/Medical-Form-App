import {useDispatch, useSelector} from 'react-redux';
import {Link} from 'react-router-dom';
import {useEffect} from 'react';
import {Col, Row, Button, Typography, Card, message} from 'antd';
import type {SpecificationStateModel} from '@/models/specification.model';
import type {DoctorInfoModel} from '@/models/doctor.model';
import {getDoctorsByPage} from '@/features/doctorSlice';
import type {AppDispatch, RootState} from '@/app/store';
import {fetchArticles} from '@/features/articleSlice';
import {stringToColor} from '@/utils/colorUtils';
import {RightOutlined} from '@ant-design/icons';
import DoctorCard from '@/components/doctors/DoctorCard';
import Banner from '@/components/Banner';
import "@/assets/styles/home.scss";

const {Title, Paragraph} = Typography;

const Home = () => {
    const dispatch: AppDispatch = useDispatch();
    const {specifications} = useSelector<RootState, SpecificationStateModel>((state: RootState) => state.specifications);
    const {articles} = useSelector((state: RootState) => state.articles);
    const {doctors} = useSelector((state: RootState) => state.doctors.doctorsByPage);
    const {doctor} = useSelector((state: RootState) => state.doctors);

    useEffect(() => {
        if (!doctors.length) {
            dispatch(getDoctorsByPage({page: 1, specificationId: ''}));
        }
        if (!articles.length) {
            dispatch(fetchArticles({limit: 10, page: 1}));
        }
    }, []);

    useEffect(() => {
        if (doctor && !doctor.certified) {
            message.info(
                `Your profile is not yet certified. Please upload your medical certificate from your
                        profile and become visible to patients`,
                5
            )
        }
    }, [doctor]);

    return (
        <div className='home-container'>
            <Banner/>
            <div className='content-container'>
                <div className='title'>
                    <Title level={3}>Featured Doctors</Title>
                    <Link to="/doctors">
                        <Button type="link" icon={<RightOutlined/>} iconPosition='end'>
                            See More
                        </Button>
                    </Link>
                </div>

                <Row gutter={[16, 16]} justify="start">
                    {doctors.map((doctor: DoctorInfoModel) => (
                        <Col
                            key={doctor.id}
                            xs={24} sm={12} md={12} lg={8} xl={6} xxl={6}
                        >
                            <DoctorCard
                                doctor={doctor}
                                specifications={specifications}
                                stringToColor={stringToColor}
                            />
                        </Col>
                    ))}
                </Row>

            </div>
            <div className='content-container'>
                <div className='title'>
                    <Title level={3}>Articles</Title>
                    <Link to="/articles">
                        <Button type="link" icon={<RightOutlined/>} iconPosition='end'>
                            See More
                        </Button>
                    </Link>
                </div>

                <Row gutter={[16, 16]} justify="start">
                    {articles.slice(0, 6).map((article) => (
                        <Col xs={24} sm={12} md={12} lg={8} xl={6} xxl={6} key={article.id}>
                            <Link to={`/articles/${article.id}`}>
                                <Card title={article.title} hoverable>
                                    {article.imageUrl && (
                                        <img
                                            className='article-image'
                                            src={article.imageUrl}
                                            alt={article.title}
                                        />
                                    )}
                                    <Paragraph ellipsis={{rows: 3}}>{article.content}</Paragraph>
                                </Card>
                            </Link>
                        </Col>
                    ))}
                </Row>
            </div>
        </div>
    );
}

export default Home;