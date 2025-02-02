import { FormResumeData, StoredResumeData } from './types';

interface Education {
    degree: string;
    institution: string;
    year: string;
}

interface Experience {
    position: string;
    company: string;
    duration: string;
    responsibilities: string;
}

interface ResumeData {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    education: Education[];
    experience: Experience[];
    skills: string[];
}

class ResumeBuilder {
    private form: HTMLFormElement;
    private educationContainer: HTMLDivElement;
    private experienceContainer: HTMLDivElement;
    private resumeOutput: HTMLDivElement;

    constructor() {
        this.form = document.getElementById('resumeForm') as HTMLFormElement;
        this.educationContainer = document.getElementById('educationFields') as HTMLDivElement;
        this.experienceContainer = document.getElementById('experienceFields') as HTMLDivElement;
        this.resumeOutput = document.getElementById('resumeOutput') as HTMLDivElement;
        
        this.initializeEventListeners();
    }

    private initializeEventListeners(): void {
        document.getElementById('addEducation')?.addEventListener('click', () => this.addEducationField());
        document.getElementById('addExperience')?.addEventListener('click', () => this.addExperienceField());
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    private addEducationField(): void {
        const educationEntry = document.createElement('div');
        educationEntry.className = 'education-entry';
        educationEntry.innerHTML = `
            <input type="text" class="degree" placeholder="Degree" required>
            <input type="text" class="institution" placeholder="Institution" required>
            <input type="text" class="year" placeholder="Year" required>
            <button type="button" class="remove-btn">Remove</button>
        `;
        
        educationEntry.querySelector('.remove-btn')?.addEventListener('click', () => {
            educationEntry.remove();
        });
        
        this.educationContainer.appendChild(educationEntry);
    }

    private addExperienceField(): void {
        const experienceEntry = document.createElement('div');
        experienceEntry.className = 'experience-entry';
        experienceEntry.innerHTML = `
            <input type="text" class="position" placeholder="Position" required>
            <input type="text" class="company" placeholder="Company" required>
            <input type="text" class="duration" placeholder="Duration" required>
            <textarea class="responsibilities" placeholder="Responsibilities"></textarea>
            <button type="button" class="remove-btn">Remove</button>
        `;
        
        experienceEntry.querySelector('.remove-btn')?.addEventListener('click', () => {
            experienceEntry.remove();
        });
        
        this.experienceContainer.appendChild(experienceEntry);
    }

    private collectFormData(): FormResumeData {
        const educationEntries = Array.from(document.querySelectorAll('.education-entry')).map(entry => ({
            degree: (entry.querySelector('.degree') as HTMLInputElement).value,
            institution: (entry.querySelector('.institution') as HTMLInputElement).value,
            year: (entry.querySelector('.year') as HTMLInputElement).value
        }));

        const experienceEntries = Array.from(document.querySelectorAll('.experience-entry')).map(entry => ({
            position: (entry.querySelector('.position') as HTMLInputElement).value,
            company: (entry.querySelector('.company') as HTMLInputElement).value,
            duration: (entry.querySelector('.duration') as HTMLInputElement).value,
            responsibilities: (entry.querySelector('.responsibilities') as HTMLTextAreaElement).value
        }));

        return {
            fullName: (document.getElementById('fullName') as HTMLInputElement).value,
            email: (document.getElementById('email') as HTMLInputElement).value,
            phone: (document.getElementById('phone') as HTMLInputElement).value,
            address: (document.getElementById('address') as HTMLTextAreaElement).value,
            education: educationEntries,
            experience: experienceEntries,
            skills: (document.getElementById('skills') as HTMLTextAreaElement).value.split(',').map(skill => skill.trim())
        };
    }

    private generateResumeHTML(data: FormResumeData): string {
        return `
            <div class="resume-content">
                <h1>${data.fullName}</h1>
                <div class="contact-info">
                    <span>${data.email}</span>
                    <span>${data.phone}</span>
                    <span>${data.address}</span>
                </div>

                <div class="resume-section">
                    <h2>Education</h2>
                    ${data.education.map(edu => `
                        <div class="education-item">
                            <h3>${edu.degree}</h3>
                            <p>${edu.institution} - ${edu.year}</p>
                        </div>
                    `).join('')}
                </div>

                <div class="resume-section">
                    <h2>Work Experience</h2>
                    ${data.experience.map(exp => `
                        <div class="experience-item">
                            <h3>${exp.position}</h3>
                            <p>${exp.company} | ${exp.duration}</p>
                            <p>${exp.responsibilities}</p>
                        </div>
                    `).join('')}
                </div>

                <div class="resume-section">
                    <h2>Skills</h2>
                    <div class="skills-list">
                        ${data.skills.map(skill => `
                            <span class="skill-item">${skill}</span>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    private handleSubmit(e: Event): void {
        e.preventDefault();
        const formData = this.collectFormData();
        const html = this.generateResumeHTML(formData);
        
        // Save both the form data and HTML
        const storedData: StoredResumeData = {
            html: html,
            lastEdited: new Date().toISOString()
        };
        
        localStorage.setItem('resumeData', JSON.stringify(storedData));
        window.location.href = 'preview.html';
    }
}

// Initialize the resume builder when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ResumeBuilder();
});
