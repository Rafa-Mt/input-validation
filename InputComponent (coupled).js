import BaseComponent from "./BaseComponent.js";

/**
 * @typedef {Object} InputComponentProps
 */
export default class InputComponent extends BaseComponent {
    /**
     * @property {InputComponentProps} props
     */
    constructor(props) {
        if (!Object.keys(props).includes("validations"))
            Object.assign(props, {validations: []})
        super(props, "input");
    }

    connectedCallback() {
        super.connectedCallback();
        this.element.placeholder = this.props.text;

        this.validationMessage = document.createElement("p");
        this.element.before(this.validationMessage);

        this.validationMessage.textContent = "Invalid input";
        this.validationMessage.style.color = "red";
        this.validationMessage.style.margin = "0";

        const checker = (event) => {
            const element = event.target;
            const valid = element.validateText(...element.props.validations)

            element.validationMessage.style.display = valid ? "none" : "block";
            element.addInlineStyles({"border": `1px ${valid ? "solid black" : "dashed red"}`,})
        }        

        this.addEvents({
            "connect": checker,
            "input": checker
        });
        
    }
    
    static validateData(data, ...types) {
        const validations = {
            "empty": (value) => {
                return typeof value == "string" && value.length != 0;
            },
            "integer": (value) => {
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

        return types.every((type) => validations[type](data));
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
            "color": "blue"
        }
    },
})
document.body.appendChild(none)

const createInput = (name) => {
    const properties = {
        text: name,
        validations: [name],
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
    }

    const item = new InputComponent(properties);
    document.body.appendChild(item)
}

createInput("empty");
createInput("integer");
createInput("float");
createInput("email")

