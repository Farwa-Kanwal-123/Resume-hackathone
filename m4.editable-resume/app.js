// Resume Builder Class
class ResumeBuilder {
    constructor() {
        this.form = document.getElementById('resumeForm');
        this.educationContainer = document.getElementById('educationFields');
        this.experienceContainer = document.getElementById('experienceFields');
        this.initializeEventListeners();
    }

    // Initialize event listeners for form elements
    initializeEventListeners() {
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

    // Add new education field
    addEducationField() {
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

    // Add new experience field
    addExperienceField() {
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

    // Collect all form data
    collectFormData() {
        const educationEntries = Array.from(document.querySelectorAll('.education-entry')).map(entry => ({
            degree: entry.querySelector('.degree').value,
            institution: entry.querySelector('.institution').value,
            year: entry.querySelector('.year').value
        }));

        const experienceEntries = Array.from(document.querySelectorAll('.experience-entry')).map(entry => ({
            position: entry.querySelector('.position').value,
            company: entry.querySelector('.company').value,
            duration: entry.querySelector('.duration').value,
            responsibilities: entry.querySelector('.responsibilities').value
                .split('\n')
                .filter(item => item.trim() !== '')
        }));

        const getValue = (id) => document.getElementById(id)?.value || '';

        return {
            fullName: getValue('fullName'),
            title: getValue('title'),
            email: getValue('email'),
            phone: getValue('phone'),
            address: getValue('address'),
            linkedin: getValue('linkedin'),
            github: getValue('github'),
            summary: getValue('summary'),
            education: educationEntries,
            experience: experienceEntries,
            skills: {
                programming: getValue('programming').split(',').map(skill => skill.trim()).filter(Boolean),
                frontend: getValue('frontend').split(',').map(skill => skill.trim()).filter(Boolean),
                backend: getValue('backend').split(',').map(skill => skill.trim()).filter(Boolean)
            },
            projects: getValue('projects')
                .split('\n\n')
                .map(project => {
                    const lines = project.trim().split('\n');
                    return {
                        title: lines[0] || '',
                        description: lines.slice(1).join('\n').trim()
                    };
                })
                .filter(project => project.title && project.description)
        };
    }

    // Generate HTML for resume preview
    generateResumeHTML(data) {
        return `
            <!-- Header Section -->
            <header>
                <div class="profile-container">
                    <div class="profile-pic">
                        <i class="fas fa-user-circle"></i>
                    </div>
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

    // Helper function to generate skills section
    generateSkillsSection(title, skills) {
        if (!skills || skills.length === 0) return '';
        return `
            <div class="skill-category">
                <h3>${title}</h3>
                <div class="skill-items">
                    ${skills.map(skill => `<span>${skill}</span>`).join('')}
                </div>
            </div>
        `;
    }

    // Handle form submission
    handleSubmit(e) {
        e.preventDefault();
        try {
            const formData = this.collectFormData();
            const resumeHTML = this.generateResumeHTML(formData);
            
            // Save to localStorage
            localStorage.setItem('resumeData', JSON.stringify({ html: resumeHTML }));
            
            // Open preview in new window
            window.open('preview.html', '_blank');
        } catch (error) {
            console.error('Error generating resume:', error);
            alert('There was an error generating your resume. Please check your input and try again.');
        }
    }
}

// Initialize the resume builder when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ResumeBuilder();
});
