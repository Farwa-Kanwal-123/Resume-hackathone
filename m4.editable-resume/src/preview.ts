import { StoredResumeData } from './types';

interface ResumeData {
    html: string;
    lastEdited?: string;
}

class ResumePreview {
    private editMode: boolean;
    private resumeData: StoredResumeData | null;
    private container: HTMLElement;
    private editModeBtn: HTMLElement;
    private saveChangesBtn: HTMLElement;

    constructor() {
        this.editMode = false;
        this.resumeData = null;
        this.container = document.getElementById('resumeOutput') as HTMLElement;
        this.editModeBtn = document.getElementById('editModeBtn') as HTMLElement;
        this.saveChangesBtn = document.getElementById('saveChangesBtn') as HTMLElement;
        this.initializeEventListeners();
        this.loadResume();
    }

    private initializeEventListeners(): void {
        this.editModeBtn.addEventListener('click', () => this.toggleEditMode());
        this.saveChangesBtn.addEventListener('click', () => this.saveChanges());
    }

    private loadResume(): void {
        const savedData = localStorage.getItem('resumeData');
        if (savedData) {
            const data = JSON.parse(savedData);
            if (typeof data === 'object' && data !== null && 'html' in data) {
                this.container.innerHTML = data.html;
                this.makeContentEditable();
            }
        }
    }

    private toggleEditMode(): void {
        this.editMode = !this.editMode;
        this.editModeBtn.innerHTML = this.editMode ? 
            '<i class="fas fa-times"></i> Exit Edit Mode' : 
            '<i class="fas fa-edit"></i> Toggle Edit Mode';
        this.saveChangesBtn.style.display = this.editMode ? 'inline-block' : 'none';
        this.toggleEditableContent();
    }

    private toggleEditableContent(): void {
        const editableElements = this.container.querySelectorAll('.editable');
        editableElements.forEach(element => {
            (element as HTMLElement).contentEditable = this.editMode.toString();
            element.classList.toggle('editing', this.editMode);
        });
    }

    private makeContentEditable(): void {
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
                if (element.tagName.toLowerCase() === 'span') {
                    this.makeSkillEditable(element as HTMLElement);
                } else {
                    this.makeElementEditable(element as HTMLElement);
                }
            });
        });

        this.addNewItemButtons();
    }

    private makeElementEditable(element: HTMLElement): void {
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

    private makeSkillEditable(element: HTMLElement): void {
        element.addEventListener('dblclick', () => {
            if (this.editMode) {
                if (confirm('Do you want to remove this skill?')) {
                    element.remove();
                }
            }
        });
    }

    private addNewItemButtons(): void {
        const sections: { [key: string]: string } = {
            'experience': 'Add Experience',
            'education': 'Add Education',
            'projects': 'Add Project',
            'skills': 'Add Skill'
        };

        Object.entries(sections).forEach(([section, buttonText]) => {
            const sectionElement = this.container.querySelector(`.${section}`);
            if (sectionElement) {
                const addBtn = this.createAddButton(buttonText);
                addBtn.addEventListener('click', () => this.addNewItem(section));
                sectionElement.appendChild(addBtn);
            }
        });
    }

    private addNewItem(section: string): void {
        if (!this.editMode) return;

        const templates: { [key: string]: string } = {
            experience: `
                <div class="experience-item editable">
                    <h3 class="editable">New Position</h3>
                    <div class="editable">Company Name</div>
                    <div class="editable">Date Range</div>
                    <ul>
                        <li class="editable">Click to add description</li>
                    </ul>
                </div>
            `,
            education: `
                <div class="education-item editable">
                    <h3 class="editable">Degree Name</h3>
                    <div class="editable">Institution Name</div>
                    <div class="editable">Graduation Year</div>
                </div>
            `,
            projects: `
                <div class="project-item editable">
                    <h3 class="editable">Project Name</h3>
                    <p class="editable">Project Description</p>
                </div>
            `,
            skills: `<span class="skill-item editable">New Skill</span>`
        };

        const sectionElement = this.container.querySelector(`.${section}`);
        if (sectionElement && templates[section]) {
            const wrapper = document.createElement('div');
            wrapper.innerHTML = templates[section];
            const newItem = wrapper.firstElementChild as HTMLElement;
            
            if (section === 'skills') {
                const skillsContainer = sectionElement.querySelector('.skill-items') || sectionElement;
                skillsContainer.appendChild(newItem);
            } else {
                const itemsContainer = sectionElement.querySelector(`.${section}-items`) || sectionElement;
                itemsContainer.appendChild(newItem);
            }

            this.makeContentEditable();
            this.saveChanges();
        }
    }

    private markAsEdited(element: HTMLElement): void {
        element.classList.add('edited');
        this.saveChanges();
    }

    private saveChanges(): void {
        const resumeHtml = this.container.innerHTML;
        localStorage.setItem('resumeData', JSON.stringify({
            html: resumeHtml,
            lastEdited: new Date().toISOString()
        }));

        const saveIndicator = document.createElement('div');
        saveIndicator.className = 'save-indicator';
        saveIndicator.textContent = 'Changes saved!';
        document.body.appendChild(saveIndicator);

        setTimeout(() => {
            saveIndicator.remove();
        }, 2000);
    }

    private createAddButton(text: string): HTMLButtonElement {
        const button = document.createElement('button');
        button.className = 'add-item-btn';
        button.innerHTML = `<i class="fas fa-plus"></i> ${text}`;
        return button;
    }
}

// Initialize when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ResumePreview();
});
