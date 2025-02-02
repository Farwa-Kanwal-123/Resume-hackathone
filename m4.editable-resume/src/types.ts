export interface Education {
    degree: string;
    institution: string;
    year: string;
}

export interface Experience {
    position: string;
    company: string;
    duration: string;
    responsibilities: string;
}

export interface FormResumeData {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    education: Education[];
    experience: Experience[];
    skills: string[];
}

export interface StoredResumeData {
    html: string;
    lastEdited?: string;
}
