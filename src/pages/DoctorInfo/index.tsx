import {useEffect, useMemo, useState} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {getDoctor} from "@/features/doctorSlice.ts";
import {Button, Card, Col, Rate, Row, Space, Tabs, Typography} from "antd";
import TabPane from "antd/es/tabs/TabPane";
import {MessageOutlined, LeftOutlined, RightOutlined, PhoneOutlined} from "@ant-design/icons";
import {Status} from "@/constants/enums.ts";
import {renderStatus} from "../../utils/checkStateStatus.tsx";
import type {ActivityModel, DoctorStateModel, EducationModel} from "@/models/doctor.model.ts";
import type {AppDispatch, RootState} from "@/app/store.ts";
import {getNamesByIds} from "@/utils/getNamesById.ts";
import type {SpecificationStateModel} from "@/models/specification.model.ts";
import ReviewModal from "../../components/doctors/ReviewModal";
import type {ReviewStateModel} from "@/models/review.model.ts";
import {getReviews} from "@/features/reviewSlice.ts";
import type {HospitalStateModel} from "@/models/hospitals.model.ts";
import useThemeMode from "@/hooks/useThemeMode.ts";
import "@/assets/styles/doctors/doctorInfo.scss";

const {Title, Text} = Typography;

const DoctorInfo = () => {
    const {id} = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [isReviewModalVisible, setIsReviewModalVisible] = useState<boolean>(false);
    const dispatch: AppDispatch = useDispatch<AppDispatch>();
    const {doctor, status, error} = useSelector<RootState, DoctorStateModel>(
        (state: RootState) => state.doctors
    );
    const {reviews} = useSelector<RootState, ReviewStateModel>(
        (state: RootState) => state.reviews
    );
    const {specifications} = useSelector<RootState, SpecificationStateModel>(
        (state: RootState) => state.specifications
    );
    const {hospitals} = useSelector<RootState, HospitalStateModel>(
        (state: RootState) => state.hospitals
    );
    const [currentSlide, setCurrentSlide] = useState(0);
    const {theme} = useThemeMode();
    const stateStatus = renderStatus(status, error);
    const groupSize = 3;
    const totalSlides = Math.ceil((reviews?.length ?? 0) / groupSize);

    const visibleReviews = reviews?.slice(currentSlide * groupSize, (currentSlide + 1) * groupSize);


    useEffect(() => {
        if (id) {
            dispatch(getDoctor(id));
            dispatch(getReviews(id));
        }
    }, [id]);

    const averageRating = useMemo(() => {
        if (reviews.length === 0) return 0;
        const total = reviews.reduce((sum, review) => sum + review.rating, 0);
        return total / reviews.length;
    }, [reviews]);

    const doctorSpecifications = useMemo(() => {
        return doctor.specificationIds
            ? getNamesByIds(doctor.specificationIds, specifications)
            : [];
    }, [doctor.specificationIds, specifications]);

    const doctorHospitals = useMemo(() => {
        return doctor.hospitalIds ? getNamesByIds(doctor.hospitalIds, hospitals) : [];
    }, [doctor.hospitalIds, hospitals]);


    const showModal = () => {
        setIsReviewModalVisible(true);
    };

    if (stateStatus) {
        return stateStatus;
    }

    return (
        <div style={{padding: "20px"}}>
            {status === Status.SUCCEEDED && (
                <Row gutter={[32, 32]}
                     style={{width: '100%', padding: '24px', borderRadius: '12px'}}>
                    <Col
                        xs={24}
                        sm={10}
                        md={8}
                        lg={6}
                        style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}
                    >
                        {doctor.photoUrl ? (
                            <Card
                                cover={
                                    <img
                                        alt={`${doctor.name} ${doctor.surname}`}
                                        src={doctor.photoUrl}
                                        style={{
                                            width: '100%',
                                            maxHeight: 300,
                                            objectFit: 'contain',
                                            borderRadius: '12px 12px 0 0',
                                        }}
                                    />
                                }
                                className="card-image"
                            >
                            </Card>
                        ) : (
                            <img
                                src="/doctorAvatar.png"
                                alt="Doctor Avatar"
                                style={{
                                    maxWidth: '350px',
                                    width: '100%',
                                    maxHeight: '250px',
                                    objectFit: 'contain',
                                    backgroundColor: '#eef1ff',
                                    borderRadius: '12px',
                                    padding: '12px',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                                }}
                            />
                        )}
                    </Col>

                    <Col xs={24} sm={14} md={16}>
                        <div
                            style={{
                                padding: '24px',
                                borderRadius: '12px',
                                minHeight: '100%',
                            }}
                        >
                            <Title level={3} style={{marginBottom: 24, fontWeight: 600}}>
                                Dr. {doctor.name} {doctor.surname}
                            </Title>

                            <Space direction="vertical" size="large" style={{width: '100%'}}>
                                <Row>
                                    <Col span={8}>
                                        <Text strong
                                              style={{color: '#888', display: 'flex', alignItems: 'center', gap: 6}}>
                                            <PhoneOutlined/> Phone
                                        </Text>
                                    </Col>
                                    <Col span={16}>
                                        <Text>{doctor.phone || 'N/A'}</Text>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col span={8}>
                                        <Text strong style={{color: '#555'}}>✉️ Email</Text>
                                    </Col>
                                    <Col span={16}>
                                        <Text>{doctor.email || 'N/A'}</Text>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col span={8}>
                                        <Text strong style={{color: '#555'}}>🏥 Hospitals</Text>
                                    </Col>
                                    <Col span={16}>
                                        <Text>{doctorHospitals.length ? doctorHospitals.join(', ') : 'N/A'}</Text>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col span={8}>
                                        <Text strong style={{color: '#555'}}>🩺 Specializations</Text>
                                    </Col>
                                    <Col span={16}>
                                        <Text>{doctorSpecifications.length ? doctorSpecifications.join(', ') : 'N/A'}</Text>
                                    </Col>
                                </Row>

                                {doctor.consultationPrice && (
                                    <Row>
                                        <Col span={8}>
                                            <Text strong style={{color: '#555'}}>💳 Consultation Price</Text>
                                        </Col>
                                        <Col span={16}>
                                            <Text>{doctor.consultationPrice}</Text>
                                        </Col>
                                    </Row>
                                )}

                                {reviews.length > 0 && (
                                    <Row align="middle">
                                        <Col span={8}>
                                            <Text strong style={{color: '#555'}}>⭐ Rating</Text>
                                        </Col>
                                        <Col span={16}>
                                            <Rate allowHalf disabled value={averageRating}/>
                                            <Text style={{marginLeft: 8}}>({reviews.length} reviews)</Text>
                                        </Col>
                                    </Row>
                                )}
                            </Space>
                        </div>
                    </Col>
                </Row>

            )}

            <Tabs defaultActiveKey="1" style={{margin: "20px"}} className="tabs">
                <TabPane tab="Education" key="1">
                    {doctor.education?.length ? (
                        <Card
                            style={{
                                marginBottom: "10px",
                                border: "none",
                                padding: "16px 20px",
                                background: "transparent"
                            }}
                        >
                            {doctor.education?.map((education: EducationModel, index) => (
                                <div
                                    key={index}
                                    style={{
                                        marginBottom: "12px",
                                        textAlign: "left",
                                    }}
                                >
                                    <div
                                        style={{
                                            fontWeight: "bold",
                                            marginBottom: "4px",
                                        }}
                                    >
                                        {education.endYear
                                            ? `${education.startYear} - ${education.endYear}`
                                            : `Since ${education.startYear ? education.startYear : ''}`}
                                    </div>
                                    <div>
                                        {education.institution}
                                        {education.profession && `, ${education.profession}`}
                                    </div>
                                    {doctor.education && index < doctor.education.length - 1 && (
                                        <hr
                                            style={{
                                                border: "none",
                                                borderTop: "1px solid #f0f0f0",
                                                margin: "12px 0",
                                            }}
                                        />
                                    )}
                                </div>
                            ))}
                        </Card>) : ''}
                </TabPane>

                <TabPane tab="Activity" key="2">
                    {doctor.activity?.length ? (
                        <Card
                            style={{
                                marginBottom: "10px",
                                border: "none",
                                padding: "16px 20px"
                            }}
                        >
                            {doctor.activity?.map((activity: ActivityModel, index) => (
                                <>
                                    <div
                                        style={{
                                            fontWeight: "bold",
                                            marginBottom: "4px",
                                            textAlign: "left",
                                        }}
                                    >
                                        {activity.endYear
                                            ? `${activity?.startYear} - ${activity.endYear}`
                                            : `Since ${activity.startYear}`}
                                    </div>
                                    <div style={{textAlign: "left"}}>
                                        {activity.organization}
                                        {activity.profession && `, ${activity.profession}`}
                                    </div>
                                    {doctor.activity && index < doctor.activity.length - 1 && (
                                        <hr
                                            style={{
                                                border: "none",
                                                borderTop: "1px solid #f0f0f0",
                                                margin: "12px 0",
                                            }}
                                        />
                                    )}
                                </>
                            ))}
                        </Card>) : ''}

                </TabPane>
                <TabPane tab="Reviews" key="3" style={{position: 'relative'}}>
                    <Row justify="end" style={{margin: '20px'}}>
                        <Button type="primary" size="large" onClick={showModal} ghost>
                            Leave Review
                        </Button>
                    </Row>

                    {reviews?.length > 0 ? (
                        <div
                            style={{
                                position: "relative",
                                padding: "0 40px",
                                transition: "all 0.5s ease",
                            }}
                        >
                            {currentSlide > 0 && (
                                <Button
                                    shape="circle"
                                    icon={<LeftOutlined/>}
                                    onClick={() => setCurrentSlide((prev) => prev - 1)}
                                    style={{
                                        position: "absolute",
                                        top: "50%",
                                        left: "0",
                                        transform: "translateY(-50%)",
                                        zIndex: 1,
                                        backgroundColor: "#fff",
                                        border: "none",
                                    }}
                                />
                            )}
                            <div
                                style={{
                                    transition: "transform 0.8s ease-in-out",
                                    transform: `translateX(0)`,
                                }}
                            >
                                <Row gutter={[24, 24]} justify="center" align="stretch" style={{flexWrap: 'wrap'}}>
                                    {visibleReviews.map((review, i) => (
                                        <Col
                                            key={i}
                                            xs={24}
                                            sm={12}
                                            md={8}
                                            lg={6}
                                            style={{
                                                display: "flex",
                                                minHeight: "180px",
                                            }}
                                        >
                                            <Card
                                                style={{
                                                    flex: 1,
                                                    padding: "30px 25px",
                                                    borderRadius: "10px",
                                                    backgroundColor: theme==="dark" ? "#1F2A3D" : "rgba(226,237,246,0.5)",
                                                    fontFamily: "Segoe UI, sans-serif",
                                                    transition: "all 0.4s ease",
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    justifyContent: "space-between",
                                                    position: "relative",
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        position: "absolute",
                                                        top: "-30px",
                                                        left: "20px",
                                                        fontSize: "50px",
                                                        color: "#6c8382",
                                                        fontFamily: "'Playfair Display', serif",
                                                        fontWeight: "700",
                                                    }}
                                                >
                                                    &ldquo;
                                                </div>

                                                <div
                                                    style={{
                                                        fontSize: "16px",
                                                        fontWeight: "bold",
                                                        textTransform: "capitalize",
                                                    }}
                                                >
                                                    {review.name} {review.surname}
                                                </div>

                                                <div style={{position: "absolute", top: "10px", right: "20px"}}>
                                                    <Rate
                                                        disabled
                                                        defaultValue={review.rating}
                                                        style={{fontSize: "16px", color: "#FFAF00"}}
                                                    />
                                                </div>

                                                <div
                                                    style={{
                                                        marginTop: "20px",
                                                        fontSize: "15px",
                                                        lineHeight: "1.6",
                                                        flexGrow: 1,
                                                    }}
                                                >
                                                    {review.comment}
                                                </div>
                                            </Card>
                                        </Col>
                                    ))}
                                </Row>

                            </div>

                            {currentSlide < totalSlides - 1 && (
                                <Button
                                    shape="circle"
                                    icon={<RightOutlined/>}
                                    onClick={() => setCurrentSlide((prev) => prev + 1)}
                                    style={{
                                        position: "absolute",
                                        top: "50%",
                                        right: "0",
                                        transform: "translateY(-50%)",
                                        zIndex: 1,
                                        backgroundColor: "#fff",
                                        border: "none",
                                    }}
                                />
                            )}
                        </div>

                    ) : (
                        <div style={{textAlign: "center", margin: "20px 0", color: "#999", fontStyle: "italic"}}>
                            No reviews yet!
                        </div>
                    )}

                    <ReviewModal
                        isModalVisible={isReviewModalVisible}
                        setIsModalVisible={setIsReviewModalVisible}
                        doctorId={id ?? ''}
                    />
                </TabPane>

            </Tabs>

            <div style={{position: "relative"}}>
                <Button
                    type="primary"
                    icon={<MessageOutlined/>}
                    size="large"
                    style={{
                        padding: "22px 30px",
                        position: "fixed",
                        bottom: "24px",
                        right: "40px",
                        zIndex: 1000,
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                    }}
                    onClick={() => {
                        navigate(`/request/doctor?doctorId=${doctor.id}`)
                    }}
                >
                   Question to doctor
                </Button>
            </div>
        </div>
    )
}

export default DoctorInfo;
