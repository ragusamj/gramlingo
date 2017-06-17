
const wrappers = {
    col: { selector: "colgroup", before: "<table><colgroup>", after: "</colgroup></table>" },
    td: { selector: "tr", before: "<table><tr>", after: "</tr></table>" },
    thead: { selector: "table", before: "<table>", after: "</table>" },
    tr: { selector: "tbody", before: "<table><tbody>", after: "</tbody></table>" }
};

class FragmentParser {

    static parse(html) {

        let fragment;
        let template = document.createElement("template");

        if("content" in template) {
            template.innerHTML = html;
            fragment = template.content;
        }
        else {

            let firstTagName = html.match(/^[\s]*<([a-z][^\/\s>]+)/i)[1];
            let wrapper = wrappers[firstTagName];

            if(wrapper) {
                let parser = document.createElement("div");
                parser.insertAdjacentHTML("afterbegin", wrapper.before + html + wrapper.after);
                let query = parser.querySelector(wrapper.selector);
                fragment = document.createDocumentFragment();
                while (query.firstChild) {
                    fragment.appendChild(query.firstChild);
                }
            }
            else {
                fragment = document.createRange().createContextualFragment(html);
            }
        }

        return fragment;
    }
}

export default FragmentParser;
