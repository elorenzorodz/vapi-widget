import { defineCustomElement } from "vue";
import Widget from "./Widget.ce.vue";

// Convert Widget component to custom element.
const VapiElement = defineCustomElement(Widget);

// Register to recognize <vapi-widget>.
customElements.define("vapi-widget", VapiElement);
