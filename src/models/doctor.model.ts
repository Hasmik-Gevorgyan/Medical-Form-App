import type {Status} from "../constants/enums.ts";
import type {SpecificationModel} from "./specification.model.ts";

export interface DoctorModel {
    id: string;
    name: string;
    surname: string;
    email: string;
    phone: string;
    birthDate: Date;
    gender: string;
    specificationIds: string[];
    hospitalId: string;
}

export interface DoctorInfoModel extends Partial<DoctorModel> {
    about?: string;
    photoUrl?: string;
    unavailableDates?: Date[],
    education?: EducationModel[];
    activity?: ActivityModel[];
}

export interface DoctorStateModel {
    doctors: DoctorInfoModel[],
    doctorsByPage: PaginatedDoctorsResponse
    doctor: DoctorInfoModel,
    selectedSpecificationId: string,
    searchQuery: string;
    status: Status,
    error: string | null
}

export interface PaginatedDoctorsResponse {
    total: number;
    doctors: DoctorInfoModel[];
}

export interface EducationModel {
    place: string;
    startDate: string;
    endDate: string;
    profession: string;
}

export interface ActivityModel {
    place: string;
    startDate: string;
    endDate: string;
    profession: string;
}

export interface DoctorCardProps {
    doctor: DoctorInfoModel;
    specifications: SpecificationModel[];
    stringToColor: (str: string) => string;
}