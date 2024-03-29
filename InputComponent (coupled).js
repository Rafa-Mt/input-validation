import InputComponent from "./InputComponent.js";

/**
 * @typedef {Object} InputComponentProps
 */
export default class CoupledInputComponent extends InputComponent {
    /**
     * @property {InputComponentProps} props
     */
    constructor(props) {
        props = Object.assign({}, props)
        if (!Object.keys(props).includes("validations")) {
            Object.assign(props, {validations: []})
        }
        super(props);
        const validations = this.getAttribute("validations");
        if (validations) {
            this.props.validations.push(...validations.split(" "));
        }

    }

    connectedCallback() {
        super.connectedCallback();

        this.validationMessage = document.createElement("p");
        this.element.before(this.validationMessage);

        this.addStyles({
            "box-shadow": "none",
            "transition": "all 0.2s ease-in-out",
            "border-radius": "5px",
            ":focus": {
                "outline": "none"
            },
            ":hover": {
                "color": "blue"
            }
        })

        this.validationMessage.textContent = "Invalid input";
        this.validationMessage.style.color = "red";
        this.validationMessage.style.margin = "0";

        const checker = (event) => {
            const element = event.target;
            const valid = element.validateText(...element.props.validations)

            element.validationMessage.style.display = valid ? "none" : "block";
            element.addInlineStyles({"border": `1px ${valid ? "solid #91F291" : "dashed red"}`,})
            console.log(element.validateText(...element.props.validations))
        }        

        this.addEvents({
            "connect": checker,
            "input": checker
        });
        
    }
}

customElements.define('custom-input-coupled', CoupledInputComponent);

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

    const item = new CoupledInputComponent(properties);
    document.body.appendChild(item)
}

// createInput("empty");
// createInput("integer");
// createInput("float");
// createInput("email")


