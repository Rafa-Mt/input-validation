import BaseComponent from './BaseNoShadow.js';
/**
 * @typedef StandardInputComponentProps
 * @property {string?} text
 * @property {InputValidations?} validations
 * @property {string?} mismatchmessage
 * @property {string?} emptymessage
 * 
 * @typedef {InputValidation[] | InputValidation} InputValidations
 * 
 * @typedef {'text' | 'email' | 'real' | 'int' | 'required'} InputValidation
 */

/**
 * @extends BaseComponent
 * @param {StandardInputComponentProps} props
 * @property {HTMLInputElement} baseElement
 */
export default class StdInput extends BaseComponent {
    /**
     * @param {StandardInputComponentProps} props 
     */
    constructor(props){
        super(props,'input');

        
    }
    static validators = {
        text: (element) => {
            element.type = "text";
        },
        email: (element) => {
            element.type = "email";
        },
        integer: (element) => {
            element.type = "number"
        },
        real: (element) => {
            element.type = "text"
            element.pattern = `\\d+\\.*\\d*`;
        }, 
        required: (element) => {
            element.required = true;
        }  
    }
        /**
         * 
         * @param {InputValidations} validations 
         */
    addValidations(validations) {
        this.baseElement.addEventListener("input", (e) => {
            if (this.baseElement.validity.valueMissing) {
                this.baseElement.setCustomValidity(this.props.emptymessage || "Input required");
            } 
            else if (this.baseElement.validity.typeMismatch || this.baseElement.validity.patternMismatch) {
                this.baseElement.setCustomValidity(this.props.mismatchmessage || "Invalid input");
            } 
            else {
                this.baseElement.setCustomValidity("");
            }
        })
        validations.forEach((type) => {
            if (!Object.keys(StdInput.validators).includes(type)) 
                return;
            
            StdInput.validators[type](this.baseElement);
        })
        
    }
    connectedCallback() {
        super.connectedCallback();
        this.baseElement.placeholder = this.props.text;


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
        });

        if (!Object.keys(this.props).includes("validations")) {
            Object.assign(this.props, {validations: []})
        }
        if (typeof this.props.validations == "string") {

            const type = this.props.validations.split(" ");

            Object.assign(this.props, {validations:type})
        }
        this.addValidations(this.props.validations);
    }

}

customElements.define('std-input', StdInput);












/**
 * validation: 'text' | 'email' | 'real' | 'int' | 'required'
 * validations: validation[] | validation
 * 
 * validate(type) -> null 
 * 
 */