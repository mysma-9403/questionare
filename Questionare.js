export default class QuestionnaireBuilder {
    constructor(elementId) {
        this.element = document.getElementById(elementId);
        this.sectionCounter = 0;
        this.questionCounter = 0;
        this.title = this.createTitle();
        this.element.appendChild(this.title);
        $(this.element).sortable({
            handle: '.handle',
            items: '.section'
        });
    }

    createTitle() {
        let title = document.createElement('input');
        title.type = 'text';
        title.className = 'form-control mb-3 mt-5';
        title.placeholder = `Tytuł kwestionariusza`;
        return title;
    }

    createSection() {
        this.sectionCounter++;

        let section = document.createElement('div');
        section.className = 'section panel panel-default mb-5 mt-5';

        let divRow = document.createElement('div');
        divRow.className = 'row';

        let divCol1 = document.createElement('div');
        divCol1.className = 'col-4 col-md-1 handle';
        let handle = document.createElement('i');
        handle.className = ' fas fa-arrows-up-down-left-right m-auto text-center pr-5 pt-3';
        divCol1.appendChild(handle);
        divRow.appendChild(divCol1);

        let divCol2 = document.createElement('div');
        divCol2.className = 'col-4 col-md-10';
        let sectionTitle = document.createElement('input');
        sectionTitle.type = 'text';
        sectionTitle.className = 'form-control';
        sectionTitle.placeholder = `Tytuł sekcji ${this.sectionCounter}`;
        divCol2.appendChild(sectionTitle);
        divRow.appendChild(divCol2);

        let divCol3 = document.createElement('div');
        divCol3.className = 'col-4 col-md-1';
        let deleteSectionButton = document.createElement('button');
        deleteSectionButton.className = 'delete-section btn btn-danger ml-3';
        deleteSectionButton.textContent = '';
        deleteSectionButton.onclick = () => {
            if (confirm('Czy na pewno chcesz usunąć tę sekcję?')) {
                section.remove();
            }
        };
        let iconDelete = document.createElement('i');
        iconDelete.className = 'fas fa-trash';
        deleteSectionButton.appendChild(iconDelete);
        divCol3.appendChild(deleteSectionButton);
        divRow.appendChild(divCol3);

        section.appendChild(divRow);

        let questionList = document.createElement('ul');
        questionList.className = 'questions list-unstyled';
        questionList.style.minHeight = '30px';
        section.appendChild(questionList);

        let addQuestionButton = document.createElement('button');
        addQuestionButton.className = 'add-question btn btn-primary';
        addQuestionButton.textContent = 'Dodaj pytanie';
        addQuestionButton.onclick = () => this.createQuestion(questionList);
        section.appendChild(addQuestionButton);

        this.element.appendChild(section);

        $(questionList).sortable({
            handle: '.handle'
        });

        $(".questions").sortable({
            connectWith: ".questions"
        });

    }


    createQuestion(questionList) {
        this.questionCounter++;

        let question = document.createElement('li');
        question.className = 'question panel panel-default mt-3 mb-3';

        let divRow = document.createElement('div');
        divRow.className = 'row d-flex';

        let divCol1 = document.createElement('div');
        divCol1.className = 'col-3 col-md-2 handle';
        let handle = document.createElement('i');
        handle.className = ' fas fa-arrows-up-down-left-right m-auto text-center pt-3';
        divCol1.appendChild(handle);
        divRow.appendChild(divCol1);

        let divCol2 = document.createElement('div');
        divCol2.className = 'col-5 col-md-8';
        let questionTitle = document.createElement('input');
        questionTitle.type = 'text';
        questionTitle.className = 'form-control rounded-left';
        questionTitle.placeholder = `Wpisz treść pytania`;
        divCol2.appendChild(questionTitle);
        divRow.appendChild(divCol2);

        let divCol3 = document.createElement('div');
        divCol3.className = 'col-auto';
        let dropdown = document.createElement('div');
        dropdown.className = 'dropdown';

        let dropdownButton = document.createElement('button');
        dropdownButton.className = 'btn btn-default dropdown-toggle pt-2';
        dropdownButton.type = 'button';
        dropdownButton.id = 'dropdownMenuButton';
        dropdownButton.setAttribute('data-toggle', 'dropdown');
        dropdownButton.textContent = 'Opcje';
        dropdown.appendChild(dropdownButton);

        let dropdownMenu = document.createElement('ul');
        dropdownMenu.className = 'dropdown-menu';
        dropdownMenu.setAttribute('aria-labelledby', 'dropdownMenuButton');
        dropdown.appendChild(dropdownMenu);

        let additionalAnswerOption = document.createElement('li');
        additionalAnswerOption.innerHTML = `<label class="dropdown-item font-weight-light question${this.questionCounter}"><input class="mr-1" type="checkbox">Wymaga dodatkowej odpowiedzi</label>`;
        $('body').on('click', '.question' + this.questionCounter, e => {
            const isChecked = additionalAnswerOption.querySelector('input').checked;

            question.dataset.extraAnswer = isChecked ? "true" : "false";
        });
        let activeOption = document.createElement('li');
        activeOption.innerHTML = `<label class="dropdown-item font-weight-light inactvie${this.questionCounter}"><input class="mr-1" type="checkbox">Zaznacz jako nieaktywne</label>`;

        $('body').on('click', '.inactvie'+this.questionCounter, e => {
            const isChecked = activeOption.querySelector('input').checked;
            question.dataset.active = isChecked ? "true" : "false";
        });

        dropdownMenu.appendChild(activeOption);
        dropdownMenu.appendChild(additionalAnswerOption);
        let deleteOption = document.createElement('li');
        deleteOption.innerHTML = '<div class="dropdown-item">Usuń</div>';
        deleteOption.onclick = (event) => {
            event.preventDefault();
            if (confirm('Czy na pewno chcesz usunąć to pytanie?')) {
                question.remove();
            }
        };
        dropdownMenu.appendChild(deleteOption);

        divCol3.appendChild(dropdown);
        divRow.appendChild(divCol3);

        question.appendChild(divRow);
        questionList.appendChild(question);

        $(questionList).sortable({
            connectWith: ".questions",
            handle: '.handle'
        });
    }

    serialize() {
        let sections = Array.from(this.element.querySelectorAll('.section'));

        let serialized = {
            title: this.title.value,
            sections: sections.map((section, sectionIndex) => {
                let sectionTitle = section.querySelector('input').value;
                let questions = Array.from(section.querySelectorAll('.question'));

                return {
                    title: sectionTitle || `Tytuł sekcji ${sectionIndex + 1}`,
                    questions: questions.map((question, questionIndex) => {
                        let questionTitle = question.querySelector('input').value;
                        return {
                            title: questionTitle || `Pytanie ${questionIndex + 1}`,
                            inActive: question.dataset.active === 'true',
                            extraAnswer: question.dataset.extraAnswer === 'true',
                            delete: question.dataset.delete === 'true'
                        };
                    })
                };
            })
        };

        return serialized;
    }

    deserialize(jsonData) {
        this.element.innerHTML = '';
        this.sectionCounter = 0;
        this.questionCounter = 0;

        const data = JSON.parse(jsonData);
        let newData = data[0];
        this.title.value = newData.title;
        this.element.appendChild(this.title);
        newData.sections.forEach(sectionData => {
            this.createSection();

            let section = this.element.lastElementChild;
            let sectionTitleInput = section.querySelector('input');
            sectionTitleInput.value = sectionData.title;

            let questionList = section.querySelector('.questions');

            sectionData.questions.forEach(questionData => {
                this.createQuestion(questionList);

                let question = questionList.lastElementChild;
                let questionTitleInput = question.querySelector('input');
                questionTitleInput.value = questionData.title;


                if (questionData.inActive) {
                    question.dataset.inActive = questionData.inActive.toString();
                }

                question.dataset.delete = "false"
                question.dataset.extraAnswer = questionData.extraAnswer.toString();

                let dropdownMenu = question.querySelector('.dropdown-menu');
                let activeOption = dropdownMenu.children[0];
                activeOption.querySelector('input').checked = questionData.inActive;

                let additionalAnswerOption = dropdownMenu.children[1];
                if (additionalAnswerOption) {
                    additionalAnswerOption.querySelector('input').checked = questionData.extraAnswer;
                }
            });
        });
    }



    initialize() {
        this.createSection();
    }
}
