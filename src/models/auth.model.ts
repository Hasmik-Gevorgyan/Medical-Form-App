export interface RegisterUserParams {
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
