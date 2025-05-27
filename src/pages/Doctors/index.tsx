import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Link} from "react-router";
import {getDoctorsByPage, setFilter, setSearchQuery} from "../../features/doctorSlice.ts";
import {ROUTE_PATHS} from "../../routes/paths.ts";
import {Status} from "../../constants/enums.ts";
import type {AppDispatch, RootState} from "../../app/store.ts";
import type {DoctorInfoModel, DoctorStateModel} from "../../models/doctor.model.ts";
import type {SpecificationModel, SpecificationStateModel} from "../../models/specification.model.ts";
import {getSpecifications} from "../../features/specificationSlice.ts";
import {Card, Col, Pagination, Row, Spin, List, Button, Input, Avatar} from "antd";

const Doctors = () => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [showAllSpecs, setShowAllSpecs] = useState<boolean>(false);
    const dispatch: AppDispatch = useDispatch();
    const {doctorsByPage: {total, doctors}, status, error, selectedSpecificationId} =
        useSelector<RootState, DoctorStateModel>((state: RootState) => state.doctors);
    const {specifications} = useSelector<RootState, SpecificationStateModel>(
        (state: RootState) => state.specifications
    );

    useEffect(() => {
        dispatch(getDoctorsByPage({page: currentPage, specificationId: selectedSpecificationId}));
    }, [dispatch, currentPage, selectedSpecificationId]);

    useEffect(() => {
        dispatch(getSpecifications());
    }, []);

    const handleSearch = (query: string) => {
        dispatch(setSearchQuery(query));
        dispatch(getDoctorsByPage({page: 1, specificationId: selectedSpecificationId, searchQuery: query}));
    };


    const handleSpecificationClick = (specId: string | null) => {
        if (specId === null) {
            dispatch(setFilter(''));
            dispatch(getDoctorsByPage({page: currentPage, specificationId: ''}));
        } else {
            dispatch(setFilter(specId));
            dispatch(getDoctorsByPage({page: currentPage, specificationId: specId}));
        }
    }

    const toggleShowAllSpecs = () => {
        setShowAllSpecs(!showAllSpecs);
    }

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    }

    const visibleSpecifications = showAllSpecs
        ? [{id: null, name: "All"}, ...specifications]
        : [{id: null, name: "All"}, ...specifications.slice(0, 10)];

    const stringToColor = (str: string) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }

        let color = '#';
        for (let i = 0; i < 3; i++) {
            const value = (hash >> (i * 8)) & 0xff;
            color += ('00' + value.toString(16)).slice(-2);
        }

        return color;
    }

    const getSpecificationsByIds = (ids: string[], specs: SpecificationModel[]) => (
        ids?.map(id => specs.find((s: SpecificationModel) => s.id === id)?.name)
            .filter(name => name != null)
    )


    if (status === Status.LOADING) {
        return <Spin size="large"
                     style={{height: "100vh", display: "flex", justifyContent: "center", alignItems: "center"}}/>;
    }

    if (status === Status.FAILED) {
        return <p style={{color: "red", textAlign: "center"}}>{error}</p>;
    }

    return (
        <Row gutter={[24, 24]} style={{width: '100%', margin: 0}}>
            <Col xs={24} md={18}>
                <div style={{padding: "20px"}}>
                    <Input.Search
                        placeholder="Search doctors by name"
                        onSearch={handleSearch}
                        style={{marginBottom: "30px"}}
                        allowClear
                    />

                    <Row gutter={[24, 24]}>
                        {doctors.map((doctor: DoctorInfoModel) => (
                            <Col key={doctor.id} xs={24} sm={16} md={12} lg={8}>
                                <Link to={`/${ROUTE_PATHS.DOCTORS}/${doctor.id}`}>

                                    <Card
                                        hoverable
                                        style={{
                                            height: "350px",
                                            borderRadius: "12px",
                                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                                            overflow: "hidden",
                                        }}
                                        cover={
                                            doctor && doctor.photoUrl ? (
                                                <img
                                                    alt="doctor"
                                                    src={doctor.photoUrl}
                                                    style={{
                                                        height: "220px",
                                                        width: "100%",
                                                        objectFit: "cover",
                                                        borderTopLeftRadius: "12px",
                                                        borderTopRightRadius: "12px",
                                                    }}
                                                />
                                            ) : (
                                                <div
                                                    style={{
                                                        height: "220px",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        backgroundColor: "#f0f2f5",
                                                        borderTopLeftRadius: "12px",
                                                        borderTopRightRadius: "12px",
                                                    }}
                                                >
                                                    <Avatar
                                                        size={80}
                                                        style={{
                                                            backgroundColor: doctor.name ? stringToColor(doctor.name) : "#cccccc",
                                                            fontSize: "28px",
                                                            color: "#fff",
                                                        }}
                                                    >
                                                        {doctor.name?.charAt(0).toUpperCase()}
                                                        {doctor.surname?.charAt(0).toUpperCase()}
                                                    </Avatar>
                                                </div>
                                            )
                                        }
                                    >
                                        <div style={{textAlign: "center"}}>
                                            <p style={{marginBottom: "6px", fontWeight: 600, fontSize: "16px"}}>
                                                {doctor.name} {doctor.surname}
                                            </p>
                                            <p style={{color: "#888", fontSize: "14px"}}>Specialties:
                                                {doctor.specificationIds && getSpecificationsByIds(doctor.specificationIds, specifications).join(", ")} </p>
                                        </div>
                                    </Card>
                                </Link>
                            </Col>
                        ))}
                    </Row>

                    <div style={{textAlign: "center", marginTop: "30px"}}>
                        {doctors.length ? <Pagination
                            current={currentPage}
                            total={total}
                            onChange={handlePageChange}
                            pageSize={5}
                            align="end"
                        /> : null}
                    </div>
                </div>
            </Col>

            <Col xs={24} md={6}>
                <div
                    style={{
                        padding: "20px",
                        border: "1px solid #ddd",
                        borderRadius: "12px",
                        backgroundColor: "#fff",
                        position: "sticky",
                        top: "20px",
                    }}
                >
                    <h3 style={{textAlign: "center", marginBottom: "16px"}}>Specifications</h3>

                    <List
                        size="small"
                        bordered
                        dataSource={visibleSpecifications}
                        renderItem={(spec) => (
                            <List.Item
                                onClick={() => handleSpecificationClick(spec.id)}
                                style={{
                                    cursor: "pointer",
                                    backgroundColor: spec.id === selectedSpecificationId ? "#e6f7ff" : "#fff",
                                    transition: "background-color 0.3s",
                                }}
                            >
                                {spec.name}
                            </List.Item>
                        )}
                    />

                    {specifications.length > 10 && (
                        <div style={{textAlign: "center", marginTop: "10px"}}>
                            <Button type="link" onClick={toggleShowAllSpecs}>
                                {showAllSpecs ? "Show Less" : "Show All"}
                            </Button>
                        </div>
                    )}
                </div>
            </Col>
        </Row>

    )
}

export default Doctors;