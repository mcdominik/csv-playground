import ReactDOM from "react-dom/client";
import axios from "axios";
import { Router } from "./Router.tsx";
import { BrowserRouter } from "react-router-dom";

axios.defaults.baseURL = "http://localhost:8000/";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Router />
  </BrowserRouter>
);
