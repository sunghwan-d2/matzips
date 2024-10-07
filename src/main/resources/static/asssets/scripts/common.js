// class DialogObj {
//     static cover=null;
//     static stack = [];
//
//
//     static createButton(text, onclick) {
//         return {text: text, onclick: onclick};
//     }
//
//     static createSimpleOk(title, content,onclick){
//         return new DialogObj({
//             title: title,
//             content: content,
//             buttons : [{
//                 text:'확인',
//                 onclick: (instance) => {
//                     instance.hide();
//                     if (typeof onclick === 'function'){
//                         onclick(instance);
//                     }
//                 }
//             }]
//         });
// }
//
//
//     element;
//
//     constructor(params) {
//         if (DialogObj.cover === null) {
//             const cover = document.createElement('div');
//             cover.classList.add('_obj-dialog-cover');
//             document.body.prepend(cover);
//             DialogObj.cover = cover;
//         }
//         params.buttons ??=[];
//         const element = new DOMParser().parseFromString(`
//             <div class="_obj-dialog">
//                 <div class="__title">${params.title}</div>
//                 <div class="__content">${params.content}</div>
//             </div>`, 'text/html').querySelector('._obj-dialog');
//         if (params.buttons.length>0){
//             const buttonContainer = document.createElement('div');
//             buttonContainer.classList.add('__button-container');
//             buttonContainer.style.gridTemplateColumns= `repeat(${params.buttons.length},minmax(0,1fr))`;
//             for (const buttonObject of params.buttons){
//                 const button = document.createElement('button');
//                 button.classList.add('__button');
//                 button.setAttribute('type','button');
//                 button.innerText=buttonObject.text;
//                 if (typeof buttonObject.onclick === 'function'){
//                     button.onclick = () => {
//                         buttonObject.onclick(this);
//                     };
//                 }
//                 buttonContainer.append(button);
//             }
//             element.append(buttonContainer);
//         }
//         document.body.prepend(element);
//         this.element=element;
//     }
//
//     hide() {
//         DialogObj.stack.splice(DialogObj.stack.indexOf(this.element),1);
//         setTimeout(() => {
//             if (DialogObj.stack.length === 0){
//                 DialogObj.cover.hide();
//             }
//             this.element.hide();
//         },100);
//         return this;
//     }
//
//
//     show() {
//         DialogObj.stack.push(this.element);
//         setTimeout(() => {
//             DialogObj.cover.show();
//             this.element.show();
//         },100);
//         return this;
//     }
// }
//
// class LabelObj {
//     element;
//
//     constructor(element) {
//         this.element = element;
//     }
//
//     isValid() {
//         return !this.element.classList.contains(HTMLElement.INVALID_CLASS_NAME);
//     }
//
//     setValid(b) {
//         if (b === true){
//             this.element.classList.remove(HTMLElement.INVALID_CLASS_NAME);
//         }
//         if (b === false){
//             this.element.classList.add(HTMLElement.INVALID_CLASS_NAME);
//         }
//         return this;
//     }
// }
//
// HTMLElement.INVALID_CLASS_NAME= '-invalid';
// HTMLElement.VISIBLE_CLASS_NAME = '-visible';
//
// HTMLElement.prototype.disable = function () {
//     this.setAttribute('disabled','');
//     return this;
// }
//
// HTMLElement.prototype.enable = function () {
//     this.removeAttribute('disabled');
//     return this;
// }
//
// HTMLElement.prototype.hide = function (){
//     this.classList.remove(HTMLElement.VISIBLE_CLASS_NAME);
//     return this;
// }
//
// HTMLElement.prototype.isEnabled = function (){
//     return !this.hasAttribute('disabled');
// }
//
// HTMLElement.prototype.isVisible = function (){
//     return this.classList.contains(HTMLElement.VISIBLE_CLASS_NAME);
// }
//
// HTMLElement.prototype.show = function (){
//     this.classList.add(HTMLElement.VISIBLE_CLASS_NAME);
//     return this;
// }
//
// HTMLInputElement.prototype.tests = function () {
//     const expression = this.dataset.regex;
//     if (typeof expression !== 'string'){
//         return true;
//     }
//     if (typeof this._regExp === 'undefined'){
//         this._regExp = new RegExp(expression);
//     }
//     return this._regExp.test(this.value);
// }
//
// HTMLTextAreaElement.prototype.tests = function () {
//     const expression = this.dataset.regex;
//     if (typeof expression !== 'string'){
//         return true;
//     }
//     if (typeof this._regExp === 'undefined'){
//         this._regExp = new RegExp(expression);
//     }
//     return this._regExp.test(this.value);
// }

class DialogObj {
    static cover = null;
    static stack = [];

    static createButton(text, onclick) {
        return {text: text, onclick: onclick};
    }

    static createSimpleOk(title, content, onclick) {
        return new DialogObj({
            title: title,
            content: content,
            buttons: [{
                text: '확인',
                onclick: (instance) => {
                    instance.hide();
                    if (typeof onclick === 'function') {
                        onclick(instance);
                    }
                }
            }]
        });
    }

    element;

    constructor(params) {
        if (DialogObj.cover === null) {
            const cover = document.createElement('div');
            cover.classList.add('_obj-dialog-cover');
            document.body.prepend(cover);
            DialogObj.cover = cover;
        }
        params.buttons ??= [];
        const element = new DOMParser().parseFromString(`
            <div class="_obj-dialog">
                <div class="__title">${params.title}</div>
                <div class="__content">${params.content}</div>
            </div>`, 'text/html').querySelector('._obj-dialog');
        if (params.buttons.length > 0) {
            const buttonContainer = document.createElement('div');
            buttonContainer.classList.add('__button-container');
            buttonContainer.style.gridTemplateColumns = `repeat(${params.buttons.length}, minmax(0, 1fr))`;
            for (const buttonObject of params.buttons) {
                const button = document.createElement('button');
                button.classList.add('__button');
                button.setAttribute('type', 'button');
                button.innerText = buttonObject.text;
                if (typeof buttonObject.onclick === 'function') {
                    button.onclick = () => {
                        buttonObject.onclick(this);
                    };
                }
                buttonContainer.append(button);
            }
            element.append(buttonContainer);
        }
        document.body.prepend(element);
        this.element = element;
    }

    hide() {
        DialogObj.stack.splice(DialogObj.stack.indexOf(this.element), 1);
        setTimeout(() => {
            if (DialogObj.stack.length === 0) {
                DialogObj.cover.hide();
            }
            this.element.hide();
        }, 100);
        return this;
    }

    show() {
        DialogObj.stack.push(this.element);
        setTimeout(() => {
            DialogObj.cover.show();
            this.element.show();
        }, 100);
        return this;
    }
}

class LabelObj {
    element;

    constructor(element) {
        this.element = element;
    }

    isValid() {
        return !this.element.classList.contains(HTMLElement.INVALID_CLASS_NAME);
    }

    setValid(b) {
        if (b === true) {
            this.element.classList.remove(HTMLElement.INVALID_CLASS_NAME);
        }
        if (b === false) {
            this.element.classList.add(HTMLElement.INVALID_CLASS_NAME);
        }
        return this;
    }
}

HTMLElement.INVALID_CLASS_NAME = '-invalid';
HTMLElement.VISIBLE_CLASS_NAME = '-visible';

HTMLElement.prototype.disable = function () {
    this.setAttribute('disabled', '');
    return this;
}

HTMLElement.prototype.enable = function () {
    this.removeAttribute('disabled');
    return this;
}

HTMLElement.prototype.hide = function () {
    this.classList.remove(HTMLElement.VISIBLE_CLASS_NAME);
    return this;
}

HTMLElement.prototype.isEnabled = function () {
    return !this.hasAttribute('disabled');
}

HTMLElement.prototype.isVisible = function () {
    return this.classList.contains(HTMLElement.VISIBLE_CLASS_NAME);
}

HTMLElement.prototype.show = function () {
    this.classList.add(HTMLElement.VISIBLE_CLASS_NAME);
    return this;
}

HTMLInputElement.prototype.tests = function () {
    const expression = this.dataset.regex;
    if (typeof expression !== 'string') {
        return true;
    }
    if (typeof this._regExp === 'undefined') {
        this._regExp = new RegExp(expression);
    }
    return this._regExp.test(this.value);
}

HTMLTextAreaElement.prototype.tests = function () {
    const expression = this.dataset.regex;
    if (typeof expression !== 'string') {
        return true;
    }
    if (typeof this._regExp === 'undefined') {
        this._regExp = new RegExp(expression);
    }
    return this._regExp.test(this.value);
}















