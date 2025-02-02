interface Education {
    degree: string;
    institution: string;
    year: string;
}

interface Experience {
    position: string;
    company: string;
    duration: string;
    responsibilities: string[];
}

interface Skills {
    programming: string[];
    frontend: string[];
    backend: string[];
}

interface Project {
    title: string;
    description: string;
}

interface ResumeData {
    fullName: string;
    title: string;
    email: string;
    phone: string;
    address: string;
    linkedin: string;
    github: string;
    summary: string;
    education: Education[];
    experience: Experience[];
    skills: Skills;
    projects: Project[];
    profileImage?: string;
}

class ResumeBuilder {
    private form: HTMLFormElement;
    private educationContainer: HTMLDivElement;
    private experienceContainer: HTMLDivElement;
    private profileImage: string = '';

    constructor() {
        this.form = document.getElementById('resumeForm') as HTMLFormElement;
        this.educationContainer = document.getElementById('educationFields') as HTMLDivElement;
        this.experienceContainer = document.getElementById('experienceFields') as HTMLDivElement;
        this.initializeEventListeners();
    }

    private initializeEventListeners(): void {
        const addEducationBtn = document.getElementById('addEducation');
        const addExperienceBtn = document.getElementById('addExperience');

        if (addEducationBtn) {
            addEducationBtn.addEventListener('click', () => this.addEducationField());
        }

        if (addExperienceBtn) {
            addExperienceBtn.addEventListener('click', () => this.addExperienceField());
        }

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
        
        const removeBtn = educationEntry.querySelector('.remove-btn');
        if (removeBtn) {
            removeBtn.addEventListener('click', () => educationEntry.remove());
        }
        
        this.educationContainer.appendChild(educationEntry);
    }

    private addExperienceField(): void {
        const experienceEntry = document.createElement('div');
        experienceEntry.className = 'experience-entry';
        experienceEntry.innerHTML = `
            <input type="text" class="position" placeholder="Position" required>
            <input type="text" class="company" placeholder="Company" required>
            <input type="text" class="duration" placeholder="Duration (e.g., 2020 - Present)" required>
            <textarea class="responsibilities" placeholder="Responsibilities (one per line)" required></textarea>
            <button type="button" class="remove-btn">Remove</button>
        `;
        
        const removeBtn = experienceEntry.querySelector('.remove-btn');
        if (removeBtn) {
            removeBtn.addEventListener('click', () => experienceEntry.remove());
        }
        
        this.experienceContainer.appendChild(experienceEntry);
    }

    public setProfileImage(imageData: string): void {
        this.profileImage = imageData;
    }

    private getValue(id: string): string {
        return (document.getElementById(id) as HTMLInputElement | HTMLTextAreaElement)?.value || '';
    }

    private collectFormData(): ResumeData {
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
                .split('\n')
                .filter(item => item.trim() !== '')
        }));

        return {
            fullName: this.getValue('fullName'),
            title: this.getValue('title'),
            email: this.getValue('email'),
            phone: this.getValue('phone'),
            address: this.getValue('address'),
            linkedin: this.getValue('linkedin'),
            github: this.getValue('github'),
            summary: this.getValue('summary'),
            education: educationEntries,
            experience: experienceEntries,
            skills: {
                programming: this.getValue('programming').split(',').map(skill => skill.trim()).filter(Boolean),
                frontend: this.getValue('frontend').split(',').map(skill => skill.trim()).filter(Boolean),
                backend: this.getValue('backend').split(',').map(skill => skill.trim()).filter(Boolean)
            },
            projects: this.getValue('projects')
                .split('\n\n')
                .map(project => {
                    const lines = project.trim().split('\n');
                    if (lines.length < 2) return null;
                    return {
                        title: lines[0].trim(),
                        description: lines.slice(1).join('\n').trim()
                    };
                })
                .filter((project): project is Project => project !== null),
            profileImage: this.profileImage
        };
    }

    private generateResumeHTML(data: ResumeData): string {
        return `
            <!-- Header Section -->
            <header>
                <div class="profile-container">
                    ${data.profileImage ? 
                        `<div class="profile-pic">
                            <img src="${data.profileImage}" alt="Profile Picture">
                        </div>` :
                        `<div class="profile-pic">
                            <i class="fas fa-user-circle"></i>
                        </div>`
                    }
                    <div class="profile-text">
                        <h1>${data.fullName}</h1>
                        <h2>${data.title}</h2>
                    </div>
                </div>
            </header>

            <!-- Contact Information -->
            <section class="contact-info">
                <div><i class="fas fa-envelope"></i> ${data.email}</div>
                <div><i class="fas fa-phone"></i> ${data.phone}</div>
                <div><i class="fas fa-location-dot"></i> ${data.address}</div>
                ${data.linkedin ? `<div><i class="fab fa-linkedin"></i> ${data.linkedin}</div>` : ''}
                ${data.github ? `<div><i class="fab fa-github"></i> ${data.github}</div>` : ''}
            </section>

            <!-- Main Content -->
            <main>
                <!-- Summary -->
                <section class="summary">
                    <h2><i class="fas fa-user"></i> Professional Summary</h2>
                    <p>${data.summary}</p>
                </section>

                <!-- Experience -->
                <section class="experience">
                    <h2><i class="fas fa-briefcase"></i> Work Experience</h2>
                    ${data.experience.map(exp => `
                        <div class="experience-item">
                            <h3>${exp.position}</h3>
                            <div class="company">${exp.company}</div>
                            <div class="date">${exp.duration}</div>
                            <ul>
                                ${exp.responsibilities.map(resp => `<li>${resp}</li>`).join('')}
                            </ul>
                        </div>
                    `).join('')}
                </section>

                <!-- Skills -->
                <section class="skills">
                    <h2><i class="fas fa-code"></i> Technical Skills</h2>
                    <div class="skills-container">
                        ${this.generateSkillsSection('Programming', data.skills.programming)}
                        ${this.generateSkillsSection('Frontend', data.skills.frontend)}
                        ${this.generateSkillsSection('Backend', data.skills.backend)}
                    </div>
                </section>

                <!-- Education -->
                <section class="education">
                    <h2><i class="fas fa-graduation-cap"></i> Education</h2>
                    ${data.education.map(edu => `
                        <div class="education-item">
                            <h3>${edu.degree}</h3>
                            <div class="school">${edu.institution}</div>
                            <div class="date">${edu.year}</div>
                        </div>
                    `).join('')}
                </section>

                <!-- Projects -->
                <section class="projects">
                    <h2><i class="fas fa-project-diagram"></i> Key Projects</h2>
                    ${data.projects.map(project => `
                        <div class="project-item">
                            <h3>${project.title}</h3>
                            <p>${project.description}</p>
                        </div>
                    `).join('')}
                </section>
            </main>
        `;
    }

    private generateSkillsSection(title: string, skills: string[]): string {
        if (!skills || skills.length === 0) return '';
        return `
            <div class="skill-category">
                <h3>${title}</h3>
                <div class="skill-list">
                    ${skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                </div>
            </div>
        `;
    }

    private handleSubmit(e: Event): void {
        e.preventDefault();
        const formData = this.collectFormData();
        const resumeHTML = this.generateResumeHTML(formData);
        
        // Store the data and open preview
        localStorage.setItem('resumeData', JSON.stringify({
            data: formData,
            html: resumeHTML
        }));
        
        window.open('preview.html', '_blank');
    }
}

// Function to handle image upload
function handleImageUpload(input: HTMLInputElement): void {
    const preview = document.getElementById('preview') as HTMLImageElement;
    const resumeBuilder = (window as any).resumeBuilder;

    if (input.files && input.files[0]) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const imageData = e.target?.result as string;
            if (preview) {
                preview.src = imageData;
                preview.style.display = 'block';
            }
            if (resumeBuilder) {
                resumeBuilder.setProfileImage(imageData);
            }
        };
        
        reader.readAsDataURL(input.files[0]);
    }
}

// Initialize the resume builder when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    (window as any).resumeBuilder = new ResumeBuilder();
});
