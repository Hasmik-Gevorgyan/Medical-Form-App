// src/services/authService.ts
import { browserLocalPersistence, createUserWithEmailAndPassword, setPersistence, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { auth, db } from "@/firebase/config";
import dayjs from "dayjs";

interface RegisterUserParams {
    email: string;
    password: string;
    name: string;
    surname: string;
    phone: string;
    gender: string;
    hospitalIds: string[];
    specificationIds: string[];
    birthdate: string | Date;
}

export const registerUser = async ({
    email,
    password,
    name,
    surname,
    phone,
    gender,
    hospitalIds,
    specificationIds,
    birthdate
}: RegisterUserParams) => {

    if (!email || !password || !name || !surname || !phone || !gender || !hospitalIds || !specificationIds || !birthdate) {
        throw new Error("All fields are required.");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new Error("Invalid email format.");
    }
    
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    if (!phoneRegex.test(phone)) {
        throw new Error("Phone number must be between 8 digits.");
    }

    if (password.length < 6) {
        throw new Error("Password must be at least 6 characters long.");
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await setDoc(doc(db, "doctors", user.uid), {
            // uid: user.uid,
            email: user.email,
            gender,
            hospitalIds,
            name,
            phone,
            specificationIds,
            surname,
            birthdate: dayjs(birthdate).toDate(),
            createdAt: new Date(),
        });
    return user;

    } catch (error: any) {
        if (error.code === "auth/email-already-in-use") {
            throw new Error("The email address is already in use.");
        } else if (error.code === "auth/invalid-email") {
            throw new Error("Invalid email address.");
        } else if (error.code === "auth/weak-password") {
            throw new Error("Password is too weak.");
        } else {
            throw new Error("Registration failed. Please try again.");
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
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
};
  
export const logoutUser = async () => {
    await signOut(auth);
};
