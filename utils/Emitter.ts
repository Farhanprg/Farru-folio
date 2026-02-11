/**
 * Event Emitter Utility
 * Copied from land-portfolio reference
 */

class Emitter {
    events: Record<string, Array<{ cb: Function; context: any; once: boolean }>>

    constructor() {
        this.events = {}
    }

    /**
     * Attach handler to event
     */
    on(name: string, callback: Function, context?: any, once = false) {
        if (!this.events[name]) {
            this.events[name] = []
        }

        let exists = false
        this.events[name].forEach((object) => {
            if (object.cb === callback && object.context === context) {
                exists = true
                return
            }
        })
        if (exists) {
            return
        }

        this.events[name].push({
            cb: callback,
            context: context,
            once: once
        })
    }

    /**
     * Single event handler
     */
    once(name: string, callback: Function, context?: any) {
        this.on(name, callback, context, true)
    }

    /**
     * Emit event
     */
    emit(name: string, ...data: any[]) {
        if (this.events[name]) {
            this.events[name].forEach((object, index) => {
                object.cb.apply(object.context, data)

                if (object.once) {
                    delete this.events[name][index]
                }
            })
        }
    }

    /**
     * Detach handler from event
     */
    off(name: string, callback: Function, context?: any) {
        if (this.events[name]) {
            this.events[name].forEach((object, index) => {
                if (object.cb === callback && object.context === context) {
                    delete this.events[name][index]
                }
            })
        }
    }
}

export default new Emitter()
