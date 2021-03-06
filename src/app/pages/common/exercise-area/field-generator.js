import get from "lodash.get";
import Template from "../../../core/template/template";

class FieldGenerator {
    build(pageTemplate, context) {
        let fields = {};
        let fieldTemplate = Template.fromElementId("excercise-area-template");
        let fieldContainers = pageTemplate.querySelectorAll("[data-field-path]");
        for(let fieldContainer of fieldContainers) {
            let fieldPath = fieldContainer.getAttribute("data-field-path");
            let fieldData = get(context, fieldPath);
            for(let i = 0; i < fieldData.length; i++) {
                let field = fieldTemplate.clone();
                let input = this.createInput(field);
                fields[input.id] = {
                    dataPath: fieldPath + "[" + i + "]",
                    iconId: field.set("icon").id,
                    inputId: input.id,
                    popupId: field.set("popup").id
                };
                fieldContainer.appendChild(field.fragment());
            }
        }
        return fields;
    }

    createInput(field) {
        let input = field.set("input");
        input.autocapitalize = "off";
        input.autocomplete = "off";
        input.autocorrect = "off";
        input.spellcheck = false;
        return input;
    }
}

export default FieldGenerator;
