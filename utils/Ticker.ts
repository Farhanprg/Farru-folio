/**
 * Animation Ticker Utility
 * Copied from land-portfolio reference
 */

import Emitter from './Emitter'
import { gsap } from 'gsap'

class Ticker {
    callbacks: Array<{ callback: Function; context: any }>
    delta: number

    constructor() {
        this.callbacks = []
        this.delta = 0
    }

    /**
     * Initialize the ticker
     */
    init() {
        gsap.ticker.add(this.tick.bind(this))
    }

    /**
     * Tick handler - runs every frame
     */
    tick(time: number, delta: number) {
        this.delta = delta

        this.callbacks.forEach((object, index) => {
            object.callback.apply(object.context)
            delete this.callbacks[index]
        })

        // Clean up deleted items
        this.callbacks = this.callbacks.filter(Boolean)

        Emitter.emit('tick', time * 1000)
    }

    /**
     * Execute callback on next tick
     */
    nextTick(callback: Function, context?: any) {
        this.callbacks.push({
            callback,
            context
        })
    }
}

export default new Ticker()
