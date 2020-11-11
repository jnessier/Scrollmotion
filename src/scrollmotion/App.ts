export class App {

    private readonly container: Element | Document;
    private readonly items: Array<HTMLElement>;
    private readonly selector: string;
    private readonly config: Config;
    private readonly intersectionObserver: IntersectionObserver;
    private readonly mutationObserver: MutationObserver;

    public constructor(selector: string, config: Config) {

        this.selector = selector;
        this.config = config;

        this.container = document;
        if (this.config.root && this.config.root.nodeType === Node.ELEMENT_NODE) {
            this.container = this.config.root
        } else {
            this.config.root = null;
        }

        this.items = Array.from(this.container.querySelectorAll(this.selector) as NodeListOf<HTMLElement>);
        this.items.forEach((item: HTMLElement) => {
            this.config.prepareItem(item);
        })

        this.intersectionObserver = this.createIntersectionObserver();

        if (this.config.observeMutation) {
            this.mutationObserver = this.createMutationObserver();
        }
        if (typeof this.config.initialized === 'function') {
            this.config.initialized(this.container, this.items);
        }
    }

    private createIntersectionObserver(): IntersectionObserver {
        const observer = new IntersectionObserver((items: IntersectionObserverEntry[]) => {
            items.forEach((entry: IntersectionObserverEntry) => {

                const target = entry.target as HTMLElement;

                let ratio = this.config.ratio;
                if (target.dataset.smRatio) {
                    ratio = target.dataset.smRatio as unknown as number;
                }

                if (entry.isIntersecting && entry.intersectionRatio >= ratio) {
                    this.animate(target);
                    observer.unobserve(target);
                }
            });
        }, {
            root: this.config.root,
            rootMargin: this.config.rootMargin,
            threshold: this.config.threshold
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
                                this.config.prepareItem(element);
                                this.intersectionObserver.observe(element);
                            }
                        }
                    });
                }
            });
        });
    }

    private animate(item: HTMLElement): void {
        this.config.animateItem(item);

        if (typeof this.config.itemAnimated === 'function') {
            this.config.itemAnimated(item);
        }
    }

    public start(): void {
        this.items.forEach((item: HTMLElement) => {
            this.intersectionObserver.observe(item);

            if (this.config.observeMutation) {
                this.mutationObserver.observe(this.container, {
                    childList: true,
                    subtree: true
                });
            }
        });

        if (typeof this.config.started === 'function') {
            this.config.started();
        }
    }

    /**
     * Stop application
     */
    public stop(): void {
        this.intersectionObserver.disconnect();

        if (typeof this.config.stopped === 'function') {
            this.config.stopped();
        }
    }
}
