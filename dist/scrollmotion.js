/*!
* Scrollmotion v0.3.5
* Copyright 2021 Jonathan Nessier, Neoflow
* Licensed under MIT
*/
var Scrollmotion = (function () {
    'use strict';

    class Scrollmotion {
        constructor(selector, options) {
            this.mutationObserver = null;
            this.selector = selector;
            this.options = options;
            this.container = document;
            if (this.options.root && this.options.root.nodeType === Node.ELEMENT_NODE) {
                this.container = this.options.root;
            }
            else {
                this.options.root = null;
            }
            this.items = Array.from(this.container.querySelectorAll(this.selector));
            this.items.forEach((item) => {
                this.options.prepareItem(item);
            });
            this.intersectionObserver = this.createIntersectionObserver();
            if (this.options.observeMutation) {
                this.mutationObserver = this.createMutationObserver();
            }
            if (typeof this.options.initialized === 'function') {
                this.options.initialized(this.container, this.items);
            }
        }
        createIntersectionObserver() {
            const observer = new IntersectionObserver((items) => {
                items.forEach((entry) => {
                    const target = entry.target;
                    let ratio = this.options.ratio;
                    if (target.dataset.smRatio) {
                        ratio = target.dataset.smRatio;
                    }
                    if (entry.isIntersecting && entry.intersectionRatio >= ratio) {
                        this.animate(target);
                        observer.unobserve(target);
                    }
                });
            }, {
                root: this.options.root,
                rootMargin: this.options.rootMargin,
                threshold: this.options.threshold
            });
            return observer;
        }
        createMutationObserver() {
            return new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.addedNodes !== null) {
                        mutation.addedNodes.forEach((node) => {
                            if (node.nodeType === Node.ELEMENT_NODE) {
                                const element = node;
                                if (element.matches(this.selector)) {
                                    this.options.prepareItem(element);
                                    this.intersectionObserver.observe(element);
                                }
                            }
                        });
                    }
                });
            });
        }
        animate(item) {
            this.options.animateItem(item);
            if (typeof this.options.itemAnimated === 'function') {
                this.options.itemAnimated(item);
            }
        }
        start() {
            this.items.forEach((item) => {
                var _a;
                this.intersectionObserver.observe(item);
                (_a = this.mutationObserver) === null || _a === void 0 ? void 0 : _a.observe(this.container, {
                    childList: true,
                    subtree: true
                });
            });
            if (typeof this.options.started === 'function') {
                this.options.started();
            }
        }
        stop() {
            this.intersectionObserver.disconnect();
            if (typeof this.options.stopped === 'function') {
                this.options.stopped();
            }
        }
    }

    const options = {
        root: null,
        rootMargin: '0px 0px 0px 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1],
        ratio: 0,
        observeMutation: false,
        initialized: null,
        started: null,
        itemAnimated: null,
        stopped: null,
        animateClass: 'animate__swing',
        prepareItem: (item) => {
            item.style.visibility = "hidden";
        },
        animateItem: (item) => {
            item.style.visibility = "visible";
            item.classList.add('animate__animated');
            if (item.dataset.smAnimateClass) {
                item.classList.add(item.dataset.smAnimateClass);
            }
            else {
                item.classList.add(options.animateClass);
            }
        },
    };

    const factory = (items = '.sm-item', customOptions) => {
        const options$1 = Object.assign({}, options, customOptions);
        return new Scrollmotion(items, options$1);
    };

    return factory;

}());
//# sourceMappingURL=scrollmotion.js.map
