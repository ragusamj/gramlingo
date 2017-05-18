import get from "lodash.get";
import Template from "../../core/template";

class Builder {
    apply(pageTemplate, pageData) {
        let fields = {};
        let fieldTemplate = Template.fromElementId("excercise-area-template");
        let fieldContainers = pageTemplate.querySelectorAll("[data-field-path]");
        fieldContainers.forEach((fieldContainer) => {
            let fieldPath = fieldContainer.getAttribute("data-field-path");
            let fieldData = get(pageData, fieldPath);
            fieldData.forEach((variants, i) => {
                let dataPath = fieldPath + "[" + i + "]";
                let field = fieldTemplate.clone();
                let input = field.getElementById("input");
                input.id = dataPath + "_input";
                fieldContainer.appendChild(field.fragment());
                fields[input.id] = { dataPath: dataPath };
            });
        });
        return fields;
    }
}

export default Builder;
