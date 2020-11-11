export const config: Config = {
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
    prepareItem: (item: HTMLElement): void => {
        item.style.visibility = "hidden";
    },
    animateItem: (item: HTMLElement): void => {
        item.style.visibility = "visible";
        item.classList.add('animate__animated');

        if (item.dataset.smAnimateClass) {
            item.classList.add(item.dataset.smAnimateClass);
        } else {
            item.classList.add(config.animateClass);
        }
    },
};
