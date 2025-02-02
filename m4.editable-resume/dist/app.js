"use strict";
class ResumeBuilder {
    constructor() {
        this.form = document.getElementById('resumeForm');
        this.educationContainer = document.getElementById('educationFields');
        this.experienceContainer = document.getElementById('experienceFields');
        this.resumeOutput = document.getElementById('resumeOutput');
        this.initializeEventListeners();
    }
    initializeEventListeners() {
        var _a, _b;
        (_a = document.getElementById('addEducation')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => this.addEducationField());
        (_b = document.getElementById('addExperience')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', () => this.addExperienceField());
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }
    addEducationField() {
        var _a;
        const educationEntry = document.createElement('div');
        educationEntry.className = 'education-entry';
        educationEntry.innerHTML = `
            <input type="text" class="degree" placeholder="Degree" required>
            <input type="text" class="institution" placeholder="Institution" required>
            <input type="text" class="year" placeholder="Year" required>
            <button type="button" class="remove-btn">Remove</button>
        `;
        (_a = educationEntry.querySelector('.remove-btn')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
            educationEntry.remove();
        });
        this.educationContainer.appendChild(educationEntry);
    }
    addExperienceField() {
        var _a;
        const experienceEntry = document.createElement('div');
        experienceEntry.className = 'experience-entry';
        experienceEntry.innerHTML = `
            <input type="text" class="position" placeholder="Position" required>
            <input type="text" class="company" placeholder="Company" required>
            <input type="text" class="duration" placeholder="Duration" required>
            <textarea class="responsibilities" placeholder="Responsibilities"></textarea>
            <button type="button" class="remove-btn">Remove</button>
        `;
        (_a = experienceEntry.querySelector('.remove-btn')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
            experienceEntry.remove();
        });
        this.experienceContainer.appendChild(experienceEntry);
    }
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
        }));
        return {
            fullName: document.getElementById('fullName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            education: educationEntries,
            experience: experienceEntries,
            skills: document.getElementById('skills').value.split(',').map(skill => skill.trim())
        };
    }
    generateResumeHTML(data) {
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
    handleSubmit(e) {
        e.preventDefault();
        const formData = this.collectFormData();
        const resumeHTML = this.generateResumeHTML(formData);
        this.resumeOutput.innerHTML = resumeHTML;
    }
}
// Initialize the resume builder when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ResumeBuilder();
});
