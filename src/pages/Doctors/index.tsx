import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getDoctorsByPage, setFilter, setSearchQuery} from "@/features/doctorSlice.ts";
import {Col, Pagination, Row, Input} from "antd";
import {renderStatus} from "../../utils/checkStateStatus.tsx";
import Specifications from "../../components/Specifications";
import DoctorCard from "../../components/doctors/DoctorCard";
import type {AppDispatch, RootState} from "@/app/store.ts";
import type {DoctorInfoModel, DoctorStateModel} from "@/models/doctor.model.ts";
import type {SpecificationStateModel} from "@/models/specification.model.ts";
import { stringToColor } from '@/utils/colorUtils';

const Doctors = () => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [showAllSpecs, setShowAllSpecs] = useState<boolean>(false);
    const dispatch: AppDispatch = useDispatch();
    const {doctorsByPage: {total, doctors}, status, error, selectedSpecificationId} =
        useSelector<RootState, DoctorStateModel>((state: RootState) => state.doctors);
    const {specifications} = useSelector<RootState, SpecificationStateModel>(
        (state: RootState) => state.specifications
    );

    const stateStatus = renderStatus(status, error);

    useEffect(() => {
        dispatch(getDoctorsByPage({page: currentPage, specificationId: selectedSpecificationId}));
    }, [dispatch, currentPage, selectedSpecificationId]);

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

    if (stateStatus) {
        return stateStatus;
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
                                <DoctorCard
                                    doctor={doctor}
                                    specifications={specifications}
                                    stringToColor={stringToColor}
                                />
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
                <Specifications
                    specifications={specifications}
                    selectedSpecificationId={selectedSpecificationId}
                    showAllSpecs={showAllSpecs}
                    onSpecificationClick={handleSpecificationClick}
                    onToggleShowAll={toggleShowAllSpecs}
                />
            </Col>
        </Row>
    )
}

export default Doctors;