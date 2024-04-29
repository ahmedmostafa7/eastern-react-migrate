import { delay } from './settings';


export function delayedPromise(promise, delayPeriod){
    if (delay.delay) {
        window.clearTimeout(delay.delay);
        delay.resolve && delay.resolve()
    }
    return new Promise((resolve, reject) => {
        delay.resolve = resolve;
        delay.delay = setTimeout(() => {
            delay.delay = null;
            promise().then(d => resolve(d)).catch(d => reject(d))
        }, delayPeriod)
    })
}