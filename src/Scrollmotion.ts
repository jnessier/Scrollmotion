export class Scrollmotion {

    private readonly container: Element | Document;
    private readonly items: Array<HTMLElement>;
    private readonly selector: string;
    private readonly options: Options;
    private readonly intersectionObserver: IntersectionObserver;
    private readonly mutationObserver: MutationObserver | null = null;

    public constructor(selector: string, options: Options) {

        this.selector = selector;
        this.options = options;

        this.container = document;
        if (this.options.root && this.options.root.nodeType === Node.ELEMENT_NODE) {
            this.container = this.options.root
        } else {
            this.options.root = null;
        }

        this.items = Array.from(this.container.querySelectorAll(this.selector) as NodeListOf<HTMLElement>);
        this.items.forEach((item: HTMLElement) => {
            this.options.prepareItem(item);
        })

        this.intersectionObserver = this.createIntersectionObserver();

        if (this.options.observeMutation) {
            this.mutationObserver = this.createMutationObserver();
        }
        if (typeof this.options.initialized === 'function') {
            this.options.initialized(this.container, this.items);
        }
    }

    private createIntersectionObserver(): IntersectionObserver {
        const observer = new IntersectionObserver((items: IntersectionObserverEntry[]) => {
            items.forEach((entry: IntersectionObserverEntry) => {

                const target = entry.target as HTMLElement;

                let ratio = this.options.ratio;
                if (target.dataset.smRatio) {
                    ratio = target.dataset.smRatio as unknown as number;
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

    private createMutationObserver(): MutationObserver {
        return new MutationObserver((mutations: MutationRecord[]) => {
            mutations.forEach((mutation: MutationRecord) => {
                if (mutation.addedNodes !== null) {
                    mutation.addedNodes.forEach((node: Node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            const element = node as HTMLElement;
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

    private animate(item: HTMLElement): void {
        this.options.animateItem(item);

        if (typeof this.options.itemAnimated === 'function') {
            this.options.itemAnimated(item);
        }
    }

    public start(): void {
        this.items.forEach((item: HTMLElement) => {
            this.intersectionObserver.observe(item);


            this.mutationObserver?.observe(this.container, {
                childList: true,
                subtree: true
            });
        });

        if (typeof this.options.started === 'function') {
            this.options.started();
        }
    }

    /**
     * Stop application
     */
    public stop(): void {
        this.intersectionObserver.disconnect();

        if (typeof this.options.stopped === 'function') {
            this.options.stopped();
        }
    }
}
