import {autobind} from './Decorators/autobind';
import {projInterface} from './Interfaces/projectStruct';

    // CENTRAL STATE
    class Projects {
        static instance: Projects;
        allProjects: projInterface[] = [];
        handlersArray: Function[] = [];
        unfinishedCard: HTMLDivElement;
        finishedCard: HTMLDivElement;

        private constructor() {
            this.unfinishedCard = document.querySelector("#unfinishedCard")! as HTMLDivElement;
            this.finishedCard = document.querySelector("#finishedCard")! as HTMLDivElement

            this.unfinishedCard.addEventListener("dragover", this.dragOverHandler);
            this.finishedCard.addEventListener("dragover", this.dragOverHandler);
            this.unfinishedCard.addEventListener("drop", this.dropHandler);
            this.finishedCard.addEventListener("drop", this.dropHandler);
        }

        createProject(projTitle: string, projDesc: string, projDays: number, finished: boolean = false) {
            this.allProjects.push({ id: Math.random(), projTitle, projDesc, projDays, finished });

        }

        createHandlerArray(handler: Array<Function>) {
            this.handlersArray.push(...handler);
        }

        static createInstance() {
            if (this.instance) {
                return this.instance
            }
            else {
                return new Projects()
            }
        }

        runAllHandlers() {
            if (this.handlersArray.length) {
                for (let el of this.handlersArray) {
                    el();
                }
            }
        }


        // DRAG ENTER LOGIC
        @autobind
        dragStartHandler(e: DragEvent, val: number) {
            e.dataTransfer?.setData("text/plain", String(val));
        }

        @autobind
        dragEndHandler(e: DragEvent) {
        }

        // DROP LOGIC
        @autobind
        dragOverHandler(e: DragEvent) {
            e.preventDefault();
        }


        @autobind
        dropHandler(e: DragEvent) {
            e.preventDefault();
            var val = Number(e.dataTransfer?.getData("text/plain"));
            var filteredProjects = this.allProjects.map(el => {
                if (el.id === val) {
                    let elClone = { ...el };
                    elClone.finished = !elClone.finished;
                    return elClone
                }
                return el
            })
            this.allProjects = filteredProjects;
            this.runAllHandlers();
        }
    }

    var projectObject = Projects.createInstance();

    // FORM COMPONENT
    class FormComponent {

        projTitle: HTMLInputElement;
        projDesc: HTMLTextAreaElement;
        projDays: HTMLInputElement;
        addBtn: HTMLButtonElement;

        constructor() {
            this.projTitle = document.getElementById("projTitle")! as HTMLInputElement;
            this.projDesc = document.getElementById("projDesc")! as HTMLTextAreaElement;
            this.projDays = document.getElementById("projDays")! as HTMLInputElement;
            this.addBtn = document.getElementById("addBtn")! as HTMLButtonElement;
            this.addBtn.addEventListener("click", this.btnClickHandler);
        }

        @autobind
        btnClickHandler(e: Event) {
            e.preventDefault();
            if (this.projTitle.value && this.projDesc.value && +this.projDays.value) {
                projectObject.createProject(
                    this.projTitle.value, this.projDesc.value, +this.projDays.value
                )
                this.clearTextBoxes();
                projectObject.runAllHandlers();
            }
            else {
                alert("FORM INCOMPLETE");
            }
        }

        @autobind
        clearTextBoxes() {
            this.projTitle.value = "";
            this.projDesc.value = "";
            this.projDays.value = ""
        }
    }

    // UNFINISHED PROJECTS

    class UnfinishedProjects {
        unfinishedList: HTMLUListElement;
        liUnfinishedList: NodeListOf<HTMLLIElement>;

        constructor() {
            this.unfinishedList = document.getElementById("unfinishedList")! as HTMLUListElement;
            this.liUnfinishedList = document.querySelectorAll("#unfinishedList li")! as NodeListOf<HTMLLIElement>;

            // FINALLY OBJECTS INTERACT, NOT CLASSES !!
            projectObject.createHandlerArray([this.renderUnfinished]);
        }

        @autobind
        renderUnfinished() {
            this.unfinishedList.innerHTML = "";
            for (let el of projectObject.allProjects) {
                if (!el.finished) {
                    let li = document.createElement("li");
                    li.setAttribute("draggable", "true");
                    li.classList.add("list-group-item");
                    li.textContent = el.projTitle;
                    li.addEventListener("dragstart", function (e: DragEvent) {
                        projectObject.dragStartHandler(e, el.id)
                    })
                    this.unfinishedList.appendChild(li);

                }
            }
        }

    }



    // FINISHED PROJECTS

    class FinishedProjects {
        finishedList: HTMLUListElement;

        constructor() {
            this.finishedList = document.getElementById("finishedList")! as HTMLUListElement;
            projectObject.createHandlerArray([this.renderFinished]);
        }

        @autobind
        renderFinished() {
            this.finishedList.innerHTML = "";
            for (let el of projectObject.allProjects) {
                if (el.finished) {
                    let li = document.createElement("li");
                    li.setAttribute("draggable", "true");
                    li.classList.add("list-group-item");
                    li.textContent = el.projTitle;
                    li.addEventListener("dragstart", function (e: DragEvent) {
                        projectObject.dragStartHandler(e, el.id)
                    })
                    this.finishedList.appendChild(li);
                }
            }
        }
    }

    var FormObject = new FormComponent();
    var UnfinishedProjectsObj = new UnfinishedProjects();
    var FinishedProjectsObj = new FinishedProjects();
