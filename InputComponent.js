import BaseComponent from "./BaseComponent.js";

/**
 * @typedef {Object} InputComponentProps
 */
export default class InputComponent extends BaseComponent {
    /**
     * @property {InputComponentProps} props
     */
    constructor(props) {
        super(props, "input");
    }

    connectedCallback() {
        super.connectedCallback();
        this.element.placeholder = this.props.text;
    }
    
    static validateData(data, ...types) {
        const validations = {
            "empty": (value) => {
                return typeof value == "string" && value.length != 0;
            },
            "integer": (value) => {
                if (value.includes(".")) return false;
                return value != "" && Number.isInteger(Number(value));
            },
            "float": (value) => {
                return !!parseFloat(Number(value))
            },
            "email": (value) => {
                const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
                return typeof value == "string" && regex.test(value);
            },
        }

        return types.every((type) => {
            if (!Object.keys(validations).includes(type)) return false;
            return validations[type](data);
        });
    }

    validateText(...types) {
        return InputComponent.validateData(this.element.value, ...types)
    }
}

customElements.define('custom-input', InputComponent);

const none = new InputComponent({
    text: "no validation",
    styles: {
        "box-shadow": "none",
        "transition": "all 0.2s ease-in-out",
        "border-radius": "5px",
        ":focus": {
            "outline": "none"
        },
        ":hover": {
            "color": "blue",
            "background-color": "#f1f1f1"
        }
    },
    events: {
        "click": (event) => {
            const valid = event.target.validateText("empty");
            console.log(valid)
        }
    },
})
document.body.appendChild(none)

const createInput = (name) => {
    const checkerCreator = (name) => {
        return (event) => {
            const valid = event.target.validateText(name)
            event.target.addInlineStyles({"border": `1px ${valid ? "solid black" : "dashed red"}`,})
        }
    }
    const properties = {
        text: name,
        styles: {
            "box-shadow": "none",
            "transition": "all 0.2s ease-in-out",
            "border-radius": "5px",
            ":focus": {
                "outline": "none"
            },
            ":hover": {
                "color": "blue",
                "background-color": "#f1f1f1"
            }
        },
        events: {
            "click": (event) => {
                console.log("clicked")
            },
            "input": checkerCreator(name),
            "connect": checkerCreator(name)
        },
    }

    const item = new InputComponent(properties);
    document.body.appendChild(item)
}

createInput("empty");
createInput("integer");
createInput("float");
createInput("email")

