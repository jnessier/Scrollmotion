interface Config {
    root: Element | null ;
    rootMargin: string;
    threshold: number[];
    ratio: number;
    observeMutation: boolean;
    initialized: ((container: Element | Document, items: Array<HTMLElement>) => void) | null,
    started: (() => void) | null,
    animateClass: string,
    itemAnimated: ((item: HTMLElement) => void) | null,
    stopped: (() => void) | null
    prepareItem: (item: HTMLElement) => void,
    animateItem: (item: HTMLElement) => void,
}
