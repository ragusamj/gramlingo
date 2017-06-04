import get from "lodash.get";
import Template from "../../core/template";

class Page {
    apply(pageTemplate, pageData) {
        let fields = {};
        let fieldTemplate = Template.fromElementId("excercise-area-template");
        let fieldContainers = pageTemplate.querySelectorAll("[data-field-path]");
        fieldContainers.forEach((fieldContainer) => {
            let fieldPath = fieldContainer.getAttribute("data-field-path");
            let fieldData = get(pageData, fieldPath);
            for(let i = 0; i < fieldData.length; i++) {
                let field = fieldTemplate.clone();
                let input = field.set("input");
                fields[input.id] = {
                    dataPath: fieldPath + "[" + i + "]",
                    iconId: field.set("icon").id,
                    inputId: input.id,
                    popupId: field.set("popup").id
                };
                fieldContainer.appendChild(field.fragment());
            }
        });
        return fields;
    }
}

export default Page;