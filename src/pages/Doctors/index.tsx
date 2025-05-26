import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Link} from "react-router";
import {getDoctorsByPage} from "../../features/doctorSlice.ts";
import type {DoctorInfoModel, DoctorStateModel} from "../../models/doctor.model.ts";
import type {AppDispatch, RootState} from "../../app/store.ts";
import {ROUTE_PATHS} from "../../routes/paths.ts";
import {Status} from "../../constants/enums.ts";
import {Card, Col, Pagination, Row, Spin} from "antd";

const Doctors = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const dispatch: AppDispatch = useDispatch();
    const {doctorsByPage: {total, doctors}, status, error} = useSelector<RootState, DoctorStateModel>(
        (state: RootState) => state.doctors);

    useEffect(() => {
        dispatch(getDoctorsByPage(currentPage));
    }, [dispatch, currentPage])

    const handlePageChange = (page: number) => {
        dispatch(getDoctorsByPage(page));
        setCurrentPage(page);
    }

    if (status === Status.LOADING) {
        return <Spin size="large" style={{display: "block", margin: "auto", marginTop: "50px"}}/>;
    }

    if (status === Status.FAILED) {
        return <p style={{color: "red", textAlign: "center"}}>{error}</p>;
    }

    return (
        <div style={{padding: "20px"}}>
            <h2 style={{textAlign: "center", marginBottom: "20px"}}>Doctors</h2>

            {status === Status.SUCCEEDED && (
                <Row gutter={[16, 16]}>
                    {doctors.map((doctor: DoctorInfoModel) => (
                        <Col xs={24} sm={12} md={8} lg={6} key={doctor.id}>
                            <Link to={`/${ROUTE_PATHS.DOCTORS}/${doctor.id}`}>
                                <Card
                                    hoverable
                                    style={{width: "250px", borderRadius: "8px", overflow: "hidden"}}
                                    cover={<img alt="doctor" src={doctor.photoUrl}
                                                style={{height: "250px", objectFit: "cover"}}/>}
                                >
                                    <p><strong>{doctor.name}</strong></p>
                                    <p>Specialty</p>
                                </Card>
                            </Link>
                        </Col>
                    ))}
                </Row>
            )}

            <div style={{textAlign: "center", marginTop: "20px"}}>
                <Pagination current={currentPage} total={total} onChange={handlePageChange} pageSize={5} align="end"/>
            </div>
        </div>
    )
}

export default Doctors;
