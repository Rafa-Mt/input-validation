/**
 * @typedef {Object} ButtonComponentProps
 * @property {Object} events
 * @property {Object} styles
 * @property {String} text
 * @property {Array} classes
 */
export default class BaseComponent extends HTMLElement {
    /**
     * @type {Object} 
     */
    props;
    /**
     * @type {Object} 
     */
    #input;

    /**
     * @type {String}
     */
    #baseElement;

    /**
     * @param {Object} input 
     */
    constructor(input, type="div") {
        super();
        this.#baseElement = type;
        const props = Object.assign({
            events: {},
            styles: {},
            classes: [],
            text: "",
            id: "custom-element"
        }, input)
        
        const attributes = this.getAttributeNames();
        
        const events = Object.fromEntries(
            Object.entries(this.#filterByPrefix(attributes, "@"))
            .map((pair) => [pair[0], window[pair[1]]])
        )
            
        const styles = this.#filterByPrefix(attributes, "#");
            
        if (Object.keys(events).length != 0)
            Object.assign(props, {events: events})

        if (Object.keys(styles).length != 0)
            Object.assign(props, {styles: styles})

        if (this.innerHTML != "") 
            Object.assign(props, {text: this.innerHTML})
        
        if (this.id != "")
            Object.assign(props, {id: this.id})
        
        this.props = props;
    }
    
    connectedCallback() {
        this.attachShadow({mode: "open"});
        const styleSheet = document.createElement("style");
        this.shadowRoot.appendChild(styleSheet);

        this.#input = document.createElement(this.#baseElement);
        this.#input.id = this.props.id;
        this.shadowRoot.appendChild(this.#input);
        
        this.addStyles({ // * Default Styles
            display: "flex",
            margin: "0",
            border: "1px solid #000",
            padding: "10px",
            cursor: "pointer",            
            width: "fit-content",
            margin: "2px"
        });

        this.addStyles(this.props.styles);
        this.addEvents(this.props.events);
        this.addClasses(...this.props.classes); 
    }

    /** 
     * @param {Object} styles 
     */
    addStyles(styles, modifier="") {
        const styleSheet = this.shadowRoot.querySelector("style");
        for (let name in styles) {
            if (typeof styles[name] == "object") {
                this.addStyles(styles[name], name)
                continue;
            }
            styleSheet.innerHTML += `
                #${this.props.id}${modifier} {
                    ${name}: ${styles[name]};
                }\n`
        }
    }

    /** 
     * @param {Object} styles 
     */
    addInlineStyles(styles) {
        for (let name in styles) {
            this.element.style[name] = styles[name];
        }
    }

    addEvents(events) {
        for (let name in events) {
            if (name == "connect") {
                events[name]({target: this})
            }
            this.addEventListener(name, events[name]);
        }
    }

    addClasses(...classes) {
        classes.forEach((cls) => this.classList.add(cls))
    }

    get element() {
        return this.shadowRoot.getElementById(this.props.id)
    }

    /**
     * @param {String[]} list 
     * @param {string} prefix 
     * @returns Object
     */
    #filterByPrefix(list, prefix) {
        return Object.fromEntries(
            list.filter((element) => element.includes(prefix))
            .map((name) => [name.slice(prefix.length), this.getAttribute(name)])
        )
    }

}