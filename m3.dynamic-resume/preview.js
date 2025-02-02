class ResumePreview {
    constructor() {
        this.editMode = false;
        this.resumeData = null;
        this.container = document.getElementById('resumeOutput');
        this.editModeBtn = document.getElementById('editModeBtn');
        this.saveChangesBtn = document.getElementById('saveChangesBtn');
        this.initializeEventListeners();
        this.loadResume();
    }

    initializeEventListeners() {
        this.editModeBtn.addEventListener('click', () => this.toggleEditMode());
        this.saveChangesBtn.addEventListener('click', () => this.saveChanges());
    }

    loadResume() {
        const savedData = localStorage.getItem('resumeData');
        if (savedData) {
            const { html } = JSON.parse(savedData);
            this.container.innerHTML = html;
            this.makeContentEditable();
        }
    }

    toggleEditMode() {
        this.editMode = !this.editMode;
        this.editModeBtn.innerHTML = this.editMode ? 
            '<i class="fas fa-times"></i> Exit Edit Mode' : 
            '<i class="fas fa-edit"></i> Toggle Edit Mode';
        this.saveChangesBtn.style.display = this.editMode ? 'inline-block' : 'none';
        this.toggleEditableContent();
    }

    toggleEditableContent() {
        const editableElements = this.container.querySelectorAll('.editable');
        editableElements.forEach(element => {
            element.contentEditable = this.editMode;
            element.classList.toggle('editing', this.editMode);
        });
    }

    makeContentEditable() {
        // Make specific sections editable
        const editableSelectors = [
            'h1', 'h2:not(.section-title)', 'h3', 'p', 
            '.contact-info div', '.experience-item ul li',
            '.education-item div', '.project-item p',
            '.skill-items span'
        ];

        editableSelectors.forEach(selector => {
            const elements = this.container.querySelectorAll(selector);
            elements.forEach(element => {
                element.classList.add('editable');
                
                // Add hover effect for editable elements
                if (element.tagName.toLowerCase() === 'span') {
                    this.makeSkillEditable(element);
                } else {
                    this.makeElementEditable(element);
                }
            });
        });

        // Add buttons for adding new items
        this.addNewItemButtons();
    }

    makeElementEditable(element) {
        element.addEventListener('focus', () => {
            if (this.editMode) {
                element.dataset.before = element.innerHTML;
            }
        });

        element.addEventListener('blur', () => {
            if (this.editMode && element.dataset.before !== element.innerHTML) {
                this.markAsEdited(element);
            }
        });
    }

    makeSkillEditable(element) {
        element.addEventListener('dblclick', () => {
            if (this.editMode) {
                if (confirm('Do you want to remove this skill?')) {
                    element.remove();
                }
            }
        });
    }

    addNewItemButtons() {
        // Add new experience
        const experienceSection = this.container.querySelector('.experience');
        if (experienceSection) {
            const addExpBtn = this.createAddButton('Add Experience');
            addExpBtn.addEventListener('click', () => this.addNewExperience());
            experienceSection.appendChild(addExpBtn);
        }

        // Add new education
        const educationSection = this.container.querySelector('.education');
        if (educationSection) {
            const addEduBtn = this.createAddButton('Add Education');
            addEduBtn.addEventListener('click', () => this.addNewEducation());
            educationSection.appendChild(addEduBtn);
        }

        // Add new project
        const projectsSection = this.container.querySelector('.projects');
        if (projectsSection) {
            const addProjBtn = this.createAddButton('Add Project');
            addProjBtn.addEventListener('click', () => this.addNewProject());
            projectsSection.appendChild(addProjBtn);
        }

        // Add new skill
        const skillsContainer = this.container.querySelector('.skills-container');
        if (skillsContainer) {
            const categories = skillsContainer.querySelectorAll('.skill-category');
            categories.forEach(category => {
                const skillItems = category.querySelector('.skill-items');
                const addSkillBtn = this.createAddButton('Add Skill');
                addSkillBtn.addEventListener('click', () => this.addNewSkill(skillItems));
                category.appendChild(addSkillBtn);
            });
        }
    }

    createAddButton(text) {
        const button = document.createElement('button');
        button.className = 'add-item-btn';
        button.innerHTML = `<i class="fas fa-plus"></i> ${text}`;
        button.style.display = 'none';
        return button;
    }

    addNewExperience() {
        const experienceContainer = this.container.querySelector('.experience');
        const newExperience = document.createElement('div');
        newExperience.className = 'experience-item';
        newExperience.innerHTML = `
            <h3 class="editable" contenteditable="true">New Position</h3>
            <div class="company editable" contenteditable="true">Company Name</div>
            <div class="date editable" contenteditable="true">Duration</div>
            <ul>
                <li class="editable" contenteditable="true">Responsibility description</li>
            </ul>
        `;
        experienceContainer.insertBefore(newExperience, experienceContainer.lastElementChild);
    }

    addNewEducation() {
        const educationContainer = this.container.querySelector('.education');
        const newEducation = document.createElement('div');
        newEducation.className = 'education-item';
        newEducation.innerHTML = `
            <h3 class="editable" contenteditable="true">Degree Name</h3>
            <div class="school editable" contenteditable="true">Institution Name</div>
            <div class="date editable" contenteditable="true">Year</div>
        `;
        educationContainer.insertBefore(newEducation, educationContainer.lastElementChild);
    }

    addNewProject() {
        const projectsContainer = this.container.querySelector('.projects');
        const newProject = document.createElement('div');
        newProject.className = 'project-item';
        newProject.innerHTML = `
            <h3 class="editable" contenteditable="true">Project Title</h3>
            <p class="editable" contenteditable="true">Project description</p>
        `;
        projectsContainer.insertBefore(newProject, projectsContainer.lastElementChild);
    }

    addNewSkill(skillItems) {
        const newSkill = document.createElement('span');
        newSkill.className = 'editable';
        newSkill.contentEditable = true;
        newSkill.textContent = 'New Skill';
        this.makeSkillEditable(newSkill);
        skillItems.appendChild(newSkill);
    }

    markAsEdited(element) {
        element.classList.add('edited');
        this.saveChangesBtn.classList.add('has-changes');
    }

    saveChanges() {
        // Get the current state of the resume
        const resumeHTML = this.container.innerHTML;
        
        // Save to localStorage
        localStorage.setItem('resumeData', JSON.stringify({ html: resumeHTML }));
        
        // Reset edited states
        const editedElements = this.container.querySelectorAll('.edited');
        editedElements.forEach(element => element.classList.remove('edited'));
        this.saveChangesBtn.classList.remove('has-changes');
        
        // Show success message
        const notification = document.createElement('div');
        notification.className = 'save-notification';
        notification.innerHTML = '<i class="fas fa-check"></i> Changes saved successfully!';
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Initialize when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ResumePreview();
});
