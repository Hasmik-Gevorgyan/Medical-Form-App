import {Status} from "../constants/enums.ts";
import {SpecificationModel} from "@/models/specification.model.ts";
import type {DoctorInfoModel} from "@/models/doctor.model.ts";

export interface ReviewModel {
    id: string,
    doctorId: string,
    name: string,
    surname: string,
    comment: string,
    rating: number,
    createdAt: Date
}

export interface Review {
    name: string,
    surname: string,
    comment: string,
    rating: number
}

export interface ReviewStateModel {
    reviews: ReviewModel[],
    status: Status,
    error: string | null,
    fieldErrors: FieldErrors
}

export interface FieldErrors {
    name?: string;
    surname?: string;
    comment?: string;
    rating?: string;
}

export interface ReviewModalProps {
    doctorId: string;
    isModalVisible: boolean;
    setIsModalVisible: (value: boolean) => boolean;
}