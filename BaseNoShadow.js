// events
const connectEvent = new CustomEvent("connect")

 
 /**
 * @typedef {Object} ButtonComponentProps
 * @property {Object} events
 * @property {Object} styles
 * @property {String} text
 * @property {Array} classes
 * @property {HTMLInputElement} baseElement
 */
export default class BaseComponent extends HTMLElement {
    /**
     * @type {Object} 
     */
    props;
    /**
     * @type {HTMLElement} 
     */
    baseElement;

    /**
     * @type {String}
     */
    #baseType;

    /**
     * @param {Object} input 
     */
    constructor(input, type="div") {
        super();
        this.#baseType = type;
        const props = Object.assign({
            events: {},
            styles: {},
            classes: [],
            text: "",
            id: "custom-element",
        }, input)
        
        const attributes = this.getAttributeNames();
        
        const events = Object.fromEntries(
            Object.entries(this.filterByPrefix(attributes, "@"))
            .map((pair) => [pair[0], window[pair[1]]])
        )
            
        const styles = this.filterByPrefix(attributes, "#");
            
        if (Object.keys(events).length != 0)
            Object.assign(props, {events: events})

        if (Object.keys(styles).length != 0)
            Object.assign(props, {styles: styles})

        if (this.innerHTML != "" && props.text == "") 
            Object.assign(props, {text: this.innerHTML})
        
        if (this.id != "")
            Object.assign(props, {id: this.id})
        
        this.props = props;
    }
    
    connectedCallback() {
        const styleSheet = document.createElement("style");
        this.appendChild(styleSheet);
        
        this.baseElement = document.createElement(this.#baseType);
        this.baseElement.id = this.props.id;
        this.appendChild(this.baseElement);
        
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
        
        this.filterByNotPrefixes(this.getAttributeNames(), "#", "@")
        .forEach((attr) => {
            Object.assign(this.props, { [attr[0]]: attr[1] })
        })

        this.baseElement.dispatchEvent(connectEvent);


    }

    /** 
     * @param {Object} styles 
     */
    addStyles(styles, modifier="") {
        const styleSheet = this.querySelector("style");
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
        return document.getElementById(this.props.id)
    }

    /**
     * @param {String[]} list 
     * @param {string} prefix 
     * @returns Object
     */
    filterByPrefix(list, prefix) {
        
        const res = Object.fromEntries(
            list.filter((element) => element.includes(prefix))
            .map((name) => [name.slice(prefix.length), this.getAttribute(name)])
        )

        return res;
    }

    filterByNotPrefixes(list, ...prefixes) {

        const result = list.filter((element) => 
            !prefixes.some((prefix) => element.includes(prefix))
        ).map((name) => [name, this.getAttribute(name)])
        return result;

        // const filteredArray = array1.filter(value => array2.includes(value));
    }

}
