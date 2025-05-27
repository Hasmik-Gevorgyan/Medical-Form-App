import type {Status} from "../constants/enums.ts";

export interface DoctorModel {
    id: string;
    name: string;
    surname: string;
    email: string;
    phone: string;
    birthDate: Date;
    specificationIds: string[];
    hospitalId: string;
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