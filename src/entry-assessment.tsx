import { render } from "@solidjs/web";
import { Assessment } from "./app/Assessment";
import "./styles.css";

const root = document.getElementById("app");
if (!root) throw new Error("missing #app");

render(() => <Assessment />, root);
