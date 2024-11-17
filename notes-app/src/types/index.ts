export interface User {
    email: string;
    firstName: string;
    lastName: string;
    phone: string,
    photo?: string;
    uid: number;
}

export interface Note {
    id: string;
    title: string;
    text: string;
    creator: string;
}
