import { browserLocalPersistence, createUserWithEmailAndPassword, setPersistence, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { auth, db } from "@/firebase/config";
import dayjs from "dayjs";
import { FirebaseError } from "firebase/app";
import {authValidator} from "@/vallidators/validation.ts";
import { areAllFieldsRequired } from "@/utils/validateRequiredFields.ts";
import type { RegisterUserParams } from "@/models/auth.model.ts";

export const registerUser = async (registerData: RegisterUserParams) => {
    if (!areAllFieldsRequired(registerData)) {
        throw new Error("All fields are required.");
    }

    const {
        email,
        password,
        phone,
        birthdate
    } = registerData

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new Error("Invalid email format.");
    }
    
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    if (!phoneRegex.test(phone)) {
        throw new Error("The phone number must be between 10 and 15 digits long.");
    }

    if (password.length < 6) {
        throw new Error("Password must be at least 6 characters long.");
    }

    try {
        const { user } = await createUserWithEmailAndPassword(auth, email, password);

        await setDoc(doc(db, "doctors", user.uid), {
            ...registerData,
            email: user.email,
            birthdate: dayjs(birthdate).toDate(),
            createdAt: new Date(),
        });

        return user;
    } catch (error) {
        if(error instanceof FirebaseError) {
            throw new Error(authValidator[error.code] ?? authValidator.default)
        } else {
            throw new Error("An unexpected error occurred during registration.");
        }
    }
};

interface LoginUserParams {
    email: string;
    password: string;
    rememberMe?: boolean;
}

export const loginUser = async ({email, password, rememberMe}: LoginUserParams) => { 
    if (!email || !password) {
        throw new Error("Email and password are required.");
    }
    
    if(rememberMe) {
        await setPersistence(auth, browserLocalPersistence);
    }

    return (await signInWithEmailAndPassword(auth, email, password)).user;
};
  
export const logoutUser = async () => {
    await signOut(auth);
};