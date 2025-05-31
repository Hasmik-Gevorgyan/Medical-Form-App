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
import type {FieldErrors, ReviewModel} from "../models/review.model.ts";

export const ReviewService = () => {
    const DOCTOR_ID = "doctorId";

    const addDoctorReview = async (review: Omit<ReviewModel, 'id' | 'createdAt'>): Promise<ReviewModel> => {
        const validationErrors = validateReviewFields(review);
        if (validationErrors) {
            throw {
                fieldErrors: validationErrors
            }
        }

        try {
            const reviewRef = await addDoc(
                collection(db, COLLECTIONS.REVIEWS),
                {
                    ...review,
                    createdAt: new Date().toISOString()
                }
            )

            const reviewSnap = await getDoc(reviewRef);

            if (!reviewSnap.exists()) {
                throw new Error('Failed to retrieve the added review.');
            }

            return {
                id: reviewSnap.id,
                ...reviewSnap.data(),
            } as ReviewModel;
        } catch (error) {
            throw new Error(`Failed to add review`);
        }
    }

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
                ...(doc.data() as Omit<ReviewModel, 'id' | 'createdAt'>),
                createdAt: doc.data().createdAt?.toDate?.() || new Date(),
            }))
        } catch (error) {
            console.error('Error fetching reviews:', error);
            return [];
        }
    }

    return {
        addDoctorReview,
        getDoctorReviews
    }
}

export default ReviewService;


function validateReviewFields(data: Omit<ReviewModel, 'id' | 'createdAt'>): FieldErrors | null {
    const errors: FieldErrors = {};

    if (!data.name || data.name.trim().length < 2) {
        errors.name = 'Name must be at least 2 characters';
    }
    if (!data.surname || data.surname.trim().length < 2) {
        errors.surname = 'Surname must be at least 2 characters';
    }
    if (!data.comment || data.comment.trim().length < 10) {
        errors.comment = 'Comment must be at least 10 characters';
    }
    if (data.rating < 1 || data.rating > 5) {
        errors.rating = 'Rating must be between 1 and 5';
    }

    return Object.keys(errors).length > 0 ? errors : null;
}