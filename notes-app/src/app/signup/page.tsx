"use client";

import ErrorMessage from "@/components/ErrorMessage";
import { auth, db } from "@/config/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface SignupForm {
    email: string;
    password: string;
    fname: string;
    lname: string;
    phone: string;
}


const INITIAL_FORM_STATE: SignupForm = {
    email: '',
    password: '',
    fname: '',
    lname: '',
    phone: '',
};

export default function SignupPage() {
    const router = useRouter();
    const [formData, setFormData] = useState<SignupForm>(INITIAL_FORM_STATE);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value.trim()
        }));
        // Clear error when user starts typing
        if (error) setError('');
    };

    const validateForm = (): boolean => {
        if (!formData.password || formData.password.length < 8) {
            setError('Password must be at least 8 characters long');
            return false;
        }
        
        if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            setError('Please enter a valid email address');
            return false;
        }

        if (!formData.fname || !formData.lname) {
            setError('First and last name are required');
            return false;
        }

        if (formData.phone && !formData.phone.match(/^\+?[\d\s-]{10,}$/)) {
            setError('Please enter a valid phone number');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;
        
        try {
            await createUserWithEmailAndPassword(auth, formData.email, formData.password);
            const user = auth.currentUser;
            if (user) {
                await setDoc(doc(db, "Users", user.uid), {
                    email: user.email,
                    firstName: formData.fname,
                    lastName: formData.lname,
                    phone: formData.phone,
                    photo:""
                });
            }
           router.push("/notes");
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('An unknown error ocurred');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section id="login" className="h-[100vh] bg-[#FFF8F2] pt-10">
            <h1 className="text-4xl text-black font-bold text-center">Get started</h1>
            <p className="text-sm text-gray-800 text-center pt-1">by creating a free account.</p>
            <p className="text-sm text-gray-800 text-center pt-1">
                <Link href="/" className="text-lg text-primary text-center mt-5">
                    Back to home
                </Link>
            </p>
            <div className="flex flex-col px-6 xl:max-w-2xl mx-auto">
                <form onSubmit={handleSubmit}>
                    <div className="relative flex flex-col mb-3">
                        <label>First name*</label>
                        <input
                            type="text"
                            name="fname"
                            value={formData.fname}
                            onChange={handleChange}
                            className=" bg-gray-200 rounded-lg placeholder:px-3 py-2"
                            placeholder="First name"
                            required
                            disabled={isLoading}
                        />
                    </div>
                    <div className="relative flex flex-col mb-3">
                        <label>Last name*</label>
                        <input
                            type="text"
                            name="lname"
                            value={formData.lname}
                            onChange={handleChange}
                            className=" bg-gray-200 rounded-lg placeholder:px-3 py-2"
                            placeholder="Last name"
                            required
                            disabled={isLoading}
                        />
                    </div>
                    <div className="relative flex flex-col mb-3">
                        <label>Phone number</label>
                        <input
                            type="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className=" bg-gray-200 rounded-lg placeholder:px-3 py-2"
                            placeholder="Phone number"
                            disabled={isLoading}
                        />
                    </div>
                    <div className="relative flex flex-col mb-3">
                        <label>Email address*</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className=" bg-gray-200 rounded-lg placeholder:px-3 py-2"
                            placeholder="Your email"
                            required
                            disabled={isLoading}
                        />
                    </div>
                    <div className="relative flex flex-col mb-3">
                        <label>Password*</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className=" bg-gray-200 rounded-lg placeholder:px-3 py-2"
                            placeholder="Password"
                            required
                            disabled={isLoading}
                        />
                    </div>
                    <div className="flex flex-row items-center gap-3">
                        <input
                            type="checkbox"
                            id="check"
                            required
                            onChange={handleChange}
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary
                            cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                        />
                        <label htmlFor="check" className="text-xs text-gray-600 cursor-pointer">By checking the box you agree to our terms and conditions</label>
                    </div>
                    {error && (
                        <div className="mt-12 md:mx-20">
                            <ErrorMessage message={error} />
                        </div>
                    )}
                    <button type="submit" className="w-full px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-white text-lg font-semibold mt-10" disabled={isLoading}>
                        {isLoading ? "Creating account..." : "Sign Up"}
                    </button>
                    <p className="text-center mt-5">
                        Already have an account? <a href="/login" className="text-primary">Login Here</a>
                    </p>
                </form>
            </div>
        </section>
    );
}
