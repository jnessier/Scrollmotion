import 'mocha';
import {expect} from 'chai';
import factory from '../src/index';
import {JSDOM} from 'jsdom';
import MockIntersectionObserver from './MockIntersectionObserver';

describe('App test', () => {

    beforeEach(() => {
        const jsdom = new JSDOM('<!doctype html><html><head></head><body>' +
            '<div class="sm-item">Item 1</div>' +
            '<div class="sm-item">Item 2</div>' +
            '</body></html>', {
            resources: "usable",
            runScripts: "dangerously",
            url: "http://localhost"
        })

        globalThis.window = jsdom.window as unknown as Window & typeof globalThis;
        globalThis.IntersectionObserver = MockIntersectionObserver;
        globalThis.document = jsdom.window.document;
    });

    it('Scrollmotion is initialized', () => {
        factory('.sm-item', {
            initialized: (container: any, items: Array<HTMLElement>) => {
                expect(container).to.be.a('Document');
                expect(items).to.be.a('Array');
                expect(Object.keys(items).length).is.equal(2);
            }
        });
    });

});