import type {Status} from "../constants/enums.ts";
import type {SpecificationModel} from "./specification.model.ts";
import type {ReviewModel} from "./review.model.ts";

export interface DoctorModel {
    id: string;
    name: string;
    surname: string;
    email: string;
    phone: string;
    birthdate?: Date;
    gender: string;
    specificationIds: string[];
    hospitalIds: string[];
}

export interface DoctorInfoModel extends Partial<DoctorModel> {
    about?: string;
    photoUrl?: string;
    unavailableDates?: Date[],
    education?: EducationModel[];
    activity?: ActivityModel[];
    reviews?: ReviewModel[]
}

export interface DoctorStateModel {
    doctors: DoctorInfoModel[],
    doctorsByPage: PaginatedDoctorsResponse,
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
    institution: string;
    startYear: string;
    endYear: string;
    profession: string;
}

export interface ActivityModel {
    organization: string;
    startYear: string;
    endYear: string;
    profession: string;
}

export interface DoctorCardProps {
    doctor: DoctorInfoModel;
    specifications: SpecificationModel[];
    stringToColor: (str: string) => string;
}