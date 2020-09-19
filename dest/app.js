"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
// DECORATORS
function autobind(_cons, _propName, descriptor) {
    const actualFunc = descriptor.value;
    return {
        enumerable: true,
        get() {
            return actualFunc.bind(this);
        }
    };
}
// CENTRAL STATE
class Projects {
    constructor() {
        this.allProjects = [];
        this.handlersArray = [];
        this.unfinishedCard = document.querySelector("#unfinishedCard");
        this.finishedCard = document.querySelector("#finishedCard");
        this.unfinishedCard.addEventListener("dragover", this.dragOverHandler);
        this.finishedCard.addEventListener("dragover", this.dragOverHandler);
        this.unfinishedCard.addEventListener("drop", this.dropHandler);
        this.finishedCard.addEventListener("drop", this.dropHandler);
    }
    createProject(projTitle, projDesc, projDays, finished = false) {
        this.allProjects.push({ id: Math.random(), projTitle, projDesc, projDays, finished });
    }
    createHandlerArray(handler) {
        this.handlersArray.push(...handler);
    }
    static createInstance() {
        if (this.instance) {
            return this.instance;
        }
        else {
            return new Projects();
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
    dragStartHandler(e, val) {
        var _a;
        (_a = e.dataTransfer) === null || _a === void 0 ? void 0 : _a.setData("text/plain", String(val));
    }
    dragEndHandler(e) {
    }
    // DROP LOGIC
    dragOverHandler(e) {
        e.preventDefault();
    }
    dropHandler(e) {
        var _a;
        e.preventDefault();
        var val = Number((_a = e.dataTransfer) === null || _a === void 0 ? void 0 : _a.getData("text/plain"));
        var filteredProjects = this.allProjects.map(el => {
            if (el.id === val) {
                let elClone = Object.assign({}, el);
                elClone.finished = !elClone.finished;
                return elClone;
            }
            return el;
        });
        this.allProjects = filteredProjects;
        this.runAllHandlers();
    }
}
__decorate([
    autobind
], Projects.prototype, "dragStartHandler", null);
__decorate([
    autobind
], Projects.prototype, "dragEndHandler", null);
__decorate([
    autobind
], Projects.prototype, "dragOverHandler", null);
__decorate([
    autobind
], Projects.prototype, "dropHandler", null);
var projectObject = Projects.createInstance();
// FORM COMPONENT
class FormComponent {
    constructor() {
        this.projTitle = document.getElementById("projTitle");
        this.projDesc = document.getElementById("projDesc");
        this.projDays = document.getElementById("projDays");
        this.addBtn = document.getElementById("addBtn");
        this.addBtn.addEventListener("click", this.btnClickHandler);
    }
    btnClickHandler(e) {
        e.preventDefault();
        if (this.projTitle.value && this.projDesc.value && +this.projDays.value) {
            projectObject.createProject(this.projTitle.value, this.projDesc.value, +this.projDays.value);
            this.clearTextBoxes();
            projectObject.runAllHandlers();
        }
        else {
            alert("FORM INCOMPLETE");
        }
    }
    clearTextBoxes() {
        this.projTitle.value = "";
        this.projDesc.value = "";
        this.projDays.value = "";
    }
}
__decorate([
    autobind
], FormComponent.prototype, "btnClickHandler", null);
__decorate([
    autobind
], FormComponent.prototype, "clearTextBoxes", null);
// UNFINISHED PROJECTS
class UnfinishedProjects {
    constructor() {
        this.unfinishedList = document.getElementById("unfinishedList");
        this.liUnfinishedList = document.querySelectorAll("#unfinishedList li");
        // FINALLY OBJECTS INTERACT, NOT CLASSES !!
        projectObject.createHandlerArray([this.renderUnfinished]);
    }
    renderUnfinished() {
        this.unfinishedList.innerHTML = "";
        for (let el of projectObject.allProjects) {
            if (!el.finished) {
                let li = document.createElement("li");
                li.setAttribute("draggable", "true");
                li.classList.add("list-group-item");
                li.textContent = el.projTitle;
                li.addEventListener("dragstart", function (e) {
                    projectObject.dragStartHandler(e, el.id);
                });
                this.unfinishedList.appendChild(li);
            }
        }
    }
}
__decorate([
    autobind
], UnfinishedProjects.prototype, "renderUnfinished", null);
// FINISHED PROJECTS
class FinishedProjects {
    constructor() {
        this.finishedList = document.getElementById("finishedList");
        projectObject.createHandlerArray([this.renderFinished]);
    }
    renderFinished() {
        this.finishedList.innerHTML = "";
        for (let el of projectObject.allProjects) {
            if (el.finished) {
                let li = document.createElement("li");
                li.setAttribute("draggable", "true");
                li.classList.add("list-group-item");
                li.textContent = el.projTitle;
                li.addEventListener("dragstart", function (e) {
                    projectObject.dragStartHandler(e, el.id);
                });
                this.finishedList.appendChild(li);
            }
        }
    }
}
__decorate([
    autobind
], FinishedProjects.prototype, "renderFinished", null);
var FormObject = new FormComponent();
var UnfinishedProjectsObj = new UnfinishedProjects();
var FinishedProjectsObj = new FinishedProjects();
