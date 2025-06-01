import {
    addDoc,
    collection,
    getDoc,
    getDocs,
    orderBy,
    query,
    where
} from "firebase/firestore";
import {db} from "../firebase/config.ts";
import {COLLECTIONS} from "../constants/collections.ts";
import type {ReviewModel} from "../models/review.model.ts";
import {validateReviewFields} from "@/vallidators/validation.ts";
import {convertFirestoreTimestampToDate} from "@/utils/dateFormatting.ts";

export const ReviewService = () => {
    const DOCTOR_ID = "doctorId";

    const addDoctorReview = async (review: Omit<ReviewModel, 'id' | 'createdAt'>): Promise<ReviewModel> => {
        const validationErrors = validateReviewFields(review);
        if (validationErrors) {
            throw {
                fieldErrors: validationErrors
            };
        }

        try {
            const reviewRef = await addDoc(
                collection(db, COLLECTIONS.REVIEWS),
                {
                    ...review,
                    createdAt: new Date()
                }
            );

            const reviewSnap = await getDoc(reviewRef);

            if (!reviewSnap.exists()) {
                throw new Error('Failed to retrieve the added review');
            }

            return {
                id: reviewSnap.id,
                ...reviewSnap.data()
            } as ReviewModel;
        } catch (error) {
            throw new Error('Failed to add review');
        }
    };

    const getDoctorReviews = async (doctorId: string): Promise<ReviewModel[]> => {
        try {
            const reviews = query(
                collection(db, COLLECTIONS.REVIEWS),
                where(DOCTOR_ID, '==', doctorId),
                orderBy('createdAt', 'desc')
            );
            const snapshot = await getDocs(reviews);

            return snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
                createdAt: convertFirestoreTimestampToDate(doc.data().createdAt, true)
            } as ReviewModel));
        } catch (error) {
            throw new Error('Failed to get review');
        }
    }

    return {
        addDoctorReview,
        getDoctorReviews
    }
}

export default ReviewService;