import deleteController from "./delete-controller.js";
import uploadController from "./upload-controller.js";

export function loadControllers() {
  return [uploadController, deleteController];
}
