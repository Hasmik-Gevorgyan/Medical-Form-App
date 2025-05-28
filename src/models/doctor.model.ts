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
    hospitalIds: string[];
}

export interface DoctorInfoModel extends Partial<DoctorModel> {
    about?: string;
    photoUrl?: string;
    unavailableDates?: Date[]
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

export interface DoctorCardProps {
    doctor: DoctorInfoModel;
    specifications: SpecificationModel[];
    stringToColor: (str: string) => string;
    getSpecificationsByIds: (ids: string[], specs: SpecificationModel[]) => string[];
}