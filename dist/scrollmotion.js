/*!
* Scrollmotion v0.2.0
* Copyright 2020 Jonathan Nessier, Neoflow
* Licensed under MIT
*/
var Scrollmotion = (function () {
    'use strict';

    var App = (function () {
        function App(selector, config) {
            var _this = this;
            this.selector = selector;
            this.config = config;
            this.container = document;
            if (this.config.root && this.config.root.nodeType === Node.ELEMENT_NODE) {
                this.container = this.config.root;
            }
            else {
                this.config.root = null;
            }
            this.items = Array.from(this.container.querySelectorAll(this.selector));
            this.items.forEach(function (item) {
                _this.config.prepareItem(item);
            });
            this.intersectionObserver = this.createIntersectionObserver();
            if (this.config.observeMutation) {
                this.mutationObserver = this.createMutationObserver();
            }
            if (typeof this.config.initialized === 'function') {
                this.config.initialized(this.container, this.items);
            }
        }
        App.prototype.createIntersectionObserver = function () {
            var _this = this;
            var observer = new IntersectionObserver(function (items) {
                items.forEach(function (entry) {
                    var target = entry.target;
                    var ratio = _this.config.ratio;
                    if (target.dataset.smRatio) {
                        ratio = target.dataset.smRatio;
                    }
                    if (entry.isIntersecting && entry.intersectionRatio >= ratio) {
                        _this.animate(target);
                        observer.unobserve(target);
                    }
                });
            }, {
                root: this.config.root,
                rootMargin: this.config.rootMargin,
                threshold: this.config.threshold
            });
            return observer;
        };
        App.prototype.createMutationObserver = function () {
            var _this = this;
            return new MutationObserver(function (mutations) {
                mutations.forEach(function (mutation) {
                    if (mutation.addedNodes !== null) {
                        mutation.addedNodes.forEach(function (node) {
                            if (node.nodeType === Node.ELEMENT_NODE) {
                                var element = node;
                                if (element.matches(_this.selector)) {
                                    _this.config.prepareItem(element);
                                    _this.intersectionObserver.observe(element);
                                }
                            }
                        });
                    }
                });
            });
        };
        App.prototype.animate = function (item) {
            this.config.animateItem(item);
            if (typeof this.config.itemAnimated === 'function') {
                this.config.itemAnimated(item);
            }
        };
        App.prototype.start = function () {
            var _this = this;
            this.items.forEach(function (item) {
                _this.intersectionObserver.observe(item);
                if (_this.config.observeMutation) {
                    _this.mutationObserver.observe(_this.container, {
                        childList: true,
                        subtree: true
                    });
                }
            });
            if (typeof this.config.started === 'function') {
                this.config.started();
            }
        };
        App.prototype.stop = function () {
            this.intersectionObserver.disconnect();
            if (typeof this.config.stopped === 'function') {
                this.config.stopped();
            }
        };
        return App;
    }());

    var defaultConfig = {
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
        prepareItem: function (item) {
            item.style.visibility = "hidden";
        },
        animateItem: function (item) {
            item.style.visibility = "visible";
            item.classList.add('animate__animated');
            if (item.dataset.smAnimateClass) {
                item.classList.add(item.dataset.smAnimateClass);
            }
            else {
                item.classList.add(defaultConfig.animateClass);
            }
        },
    };

    var index = (function (items, customConfig) {
        if (items === void 0) { items = '.sm-item'; }
        var config = defaultConfig;
        if (typeof customConfig === 'object') {
            config = Object.assign(config, customConfig);
        }
        return new App(items, config);
    });

    return index;

}());
//# sourceMappingURL=scrollmotion.js.map
