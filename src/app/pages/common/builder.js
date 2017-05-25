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
                let icon = field.getElementById("icon");
                icon.id = dataPath + "_icon";
                let input = field.getElementById("input");
                input.id = dataPath + "_input";
                let popup = field.getElementById("popup");
                popup.id = dataPath + "_popup";
                fieldContainer.appendChild(field.fragment());
                fields[input.id] = {
                    dataPath: dataPath,
                    iconId: icon.id,
                    inputId: input.id,
                    popupId: popup.id
                };
            });
        });
        return fields;
    }
}

export default Builder;
