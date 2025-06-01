import { Timestamp } from "firebase/firestore";

export const dateFormatting = (date: Date) => {
   return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    }).format(new Date(date));
}

export const convertFirestoreTimestampToDate = (
    timestamp: any,
    toISOString = false
): string | Date | null => {
    if (timestamp instanceof Timestamp) {
        return toISOString ? timestamp.toDate().toISOString() : timestamp.toDate();
    }
    return null;
};
