/**
 * @name Collapser
 * @author Malte Zoudlik
 * @version 1.0.1
 * @copyright (c) 2018
 */
class Collapser {
    constructor(args) {
        this.params = {
            trigger: '.collapser',
            maxHeight: false,
            scrollTo: false,
            scrollToOffset: 0,
            openFirst: true,
            onhold: false
        };
        this.params =  {...this.params, ...args}
        this.status = false;
        this.triggerList = document.querySelectorAll(this.params.trigger);

        this.currentActiveElement = null;

        this.anker = (window.location.hash.indexOf('#') == -1 || window.location.hash.length <= 1) ? null : window.location.hash;

        if (this.params.onhold === false) {
            this.init();
        }
    }

    init() {
        if (this.status === false) {
            this.triggerList.forEach((trigger) => {
                trigger.addEventListener('click', this.handleClick.bind(this));
                trigger.classList.add('collapser-initialized');
                trigger.nextElementSibling.style.maxHeight = 0;
            });
            if (this.anker == null) this.updateStatus(this.triggerList[0], this.params.openFirst, true);
            else this.openById(window.location.hash, this.triggerList);
    
            this.status = true;
        }
    }

    destroy() {
        if (this.status && this.params.onhold) {
            this.triggerList.forEach((trigger) => {
                trigger.removeEventListener('click', this.handleClick);
                trigger.classList.remove('collapser-initialized');
                trigger.nextElementSibling.style.maxHeight = '100%';
            });
            this.status = false;
        }
    }

    handleClick(event) {
        const clickedElement = event.currentTarget;

        if (clickedElement.classList.contains('active')) {
            this.updateStatus(clickedElement, false);
        } else {
            this.triggerList.forEach((trigger) => { this.updateStatus(trigger, false); });
            this.updateStatus(clickedElement, true);
        }

    }

    updateStatus(element, type, initialCall = false) {
        let activeHeight, 
            nextElement = element.nextElementSibling;;
        if (type && element) {
            activeHeight = nextElement.scrollHeight + 'px';

            element.classList.add('active');
            if (this.params.maxHeight != false && this.params.maxHeight <= nextElement.scrollHeight) {
                nextElement.classList.add('limited');
                activeHeight = this.params.maxHeight + 'px';
            }
            nextElement.style.maxHeight = activeHeight;
            this.currentActiveElement = nextElement;
            window.addEventListener('resize', this.updateHeight.bind(this));
            if (initialCall !== true && this.params.scrollTo === true) this.scrollFunction(element);
        } else {
            element.classList.remove('active');
            nextElement.classList.remove('limited');
            window.removeEventListener('resize', this.updateHeight);
            nextElement.style.maxHeight = 0;
        }
    }

    updateHeight() {
        const activeHeight = this.currentActiveElement.scrollHeight + 'px';
        if (this.params.maxHeight != false && this.params.maxHeight <= e.target.resizeObserver.scrollHeight) {
            this.currentActiveElement.classList.add('limited');
            activeHeight = this.params.maxHeight + 'px';
        } else {
            this.currentActiveElement.classList.remove('limited');
        }
        this.currentActiveElement.style.maxHeight = activeHeight;
    }

    scrollFunction(element) {
        window.setTimeout(() => {
            element.scrollIntoView({left: 0, block: 'start', behavior: 'smooth'})
        }, 300)
    }

    openById(link) {
        this.triggerList.forEach((trigger) => {
            this.updateStatus(trigger, false);
            if (trigger.id == link.replace('#', '')) {
                this.updateStatus(trigger, true);
                if(this.params.scrollTo) this.scrollFunction(trigger);
            }
        });
    }

    openByNumber(number) {
        this.triggerList.forEach((trigger, key) => {
            this.updateStatus(trigger, false);
            if(number == key) {
                this.updateStatus(trigger, true);
                if(this.params.scrollTo) this.scrollFunction(trigger);
            }
        });
    }

    closeAll() {
        this.triggerList.forEach((trigger, key) => {
            this.updateStatus(trigger, false);
        });
    }
}