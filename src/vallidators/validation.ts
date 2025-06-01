import type {FieldErrors, ReviewModel} from "@/models/review.model.ts";

export function validateReviewFields(data: Omit<ReviewModel, 'id' | 'createdAt'>): FieldErrors | null {
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