import dom from "jsdom-sandbox";
import sinon from "sinon";
import test from "tape";
import Template from "./template";

// document.createRange isn't implemented in jsdom yet :(
// https://github.com/tmpvar/jsdom/issues/399
let createContextualFragmentSpy = sinon.spy();
let fakeOldBrowser = () => {
    let realCreateElement = document.createElement;
    document.createElement = (tagname) => {
        return tagname === "template" ? {} : realCreateElement.call(document, tagname);
    };
    document.createRange = sinon
        .stub()
        .returns({ createContextualFragment: createContextualFragmentSpy });
};

test("Template constructor should accept a DocumentFragment", (t) => {
    dom.sandbox("", {}, () => {
        let fragment = document.createDocumentFragment();
        let template = new Template(fragment);
        t.equal(template.documentFragment, fragment);
        t.end();
    });
});

test("Template constructor should accept an html element", (t) => {
    dom.sandbox("", {}, () => {
        let div = document.createElement("div");
        div.id = "id";
        let template = new Template(div);
        t.equal(template.querySelector("#id").outerHTML, "<div id=\"id\"></div>");
        t.end();
    });
});

test("Template constructor should accept an html string", (t) => {
    dom.sandbox("", {}, () => {
        let template = new Template("<div id=\"id\"></div>");
        t.equal(template.querySelector("#id").outerHTML, "<div id=\"id\"></div>");
        t.end();
    });
});

test("Template constructor should throw error for unknown object type", (t) => {
    dom.sandbox("", {}, () => {
        try {
            new Template(123);
            t.fail();
        }
        catch(error) {
            t.equal(error.message, "Invalid template content: [object Number]");
        }
        t.end();
    });
});

test("Template should create instance from element id with no inner content", (t) => {
    dom.sandbox("<div id='id'></div>", {}, () => {
        let template = Template.fromElementId("id");
        t.equal(template.querySelector("#id").outerHTML, "<div id=\"id\"></div>");
        t.end();
    });
});

test("Template should create instance from element id with inner content", (t) => {
    dom.sandbox("<div id='id'><div id='inner'>inner content</div></div>", {}, () => {
        let template = Template.fromElementId("id");
        t.equal(template.querySelector("#inner").outerHTML, "<div id=\"inner\">inner content</div>");
        t.end();
    });
});

test("Template should clear element content", (t) => {
    dom.sandbox("<div id='id'><div id='inner'>inner content</div></div>", {}, () => {
        let element = document.getElementById("id");
        Template.clear(element);
        t.equal(element.innerHTML, "");
        t.end();
    });
});

test("Template should clear element content and ignore undefined elements", (t) => {
    dom.sandbox("<div id='id'><div id='inner'>inner content</div></div>", {}, () => {
        let element = undefined;
        Template.clear(element);
        t.equal(element, undefined);
        t.end();
    });
});

test("Template should create and add element to parent id", (t) => {
    dom.sandbox("<div id='parent'></div>", {}, () => {
        let template = Template.fromElementId("parent");
        template.add("parent", "span", { innerHTML: "Hello" });
        t.equal(template.querySelector("#parent").outerHTML, "<div id=\"parent\"><span>Hello</span></div>");
        t.end();
    });
});

test("Template should create and add element to parent element", (t) => {
    dom.sandbox("<div id='parent'></div>", {}, () => {
        let template = Template.fromElementId("parent");
        let parent = template.querySelector("#parent");
        template.add(parent, "span", { innerHTML: "Hello" });
        t.equal(template.querySelector("#parent").outerHTML, "<div id=\"parent\"><span>Hello</span></div>");
        t.end();
    });
});

test("Template should clone itself", (t) => {
    dom.sandbox("<div id='id'></div>", {}, () => {
        let template = Template.fromElementId("id");
        let clone = template.clone();
        clone.add("id", "span");
        t.equal(template.querySelector("#id").outerHTML, "<div id=\"id\"></div>");
        t.equal(clone.querySelector("#id").outerHTML, "<div id=\"id\"><span></span></div>");
        t.end();
    });
});

test("Template should parse html and use fallback for older browsers", (t) => {
    dom.sandbox("", {}, () => {
        fakeOldBrowser();
        new Template("<div id='id'>Hello</div>");
        t.deepEqual(createContextualFragmentSpy.lastCall.args, ["<div id='id'>Hello</div>"]);
        t.end();
    });
});

test("Template should parse html with table row and use fallback for older browsers", (t) => {
    dom.sandbox("", {}, () => {
        fakeOldBrowser();
        let template = new Template("<tr><td>Hello</td></td>");
        t.equal(template.fragment().firstChild.outerHTML, "<tr><td>Hello</td></tr>");
        t.end();
    });
});

test("Template should expose querySelector", (t) => {
    dom.sandbox("", {}, () => {
        let template = new Template("<div id='id'></div>");
        t.equal(template.querySelector("#id").outerHTML, "<div id=\"id\"></div>");
        t.end();
    });
});

test("Template should expose querySelectorAll", (t) => {
    dom.sandbox("", {}, () => {
        let template = new Template("<span></span><span></span>");
        t.equal(template.querySelectorAll("span").length, 2);
        t.end();
    });
});

test("Template should replace in live element with itself", (t) => {
    dom.sandbox("<div id='id'><span>Goodbye</span></div>", {}, () => {
        let template = new Template("<span>Hello</span>");
        template.replaceContent("id");
        t.equal(document.getElementById("id").outerHTML, "<div id=\"id\"><span>Hello</span></div>");
        t.end();
    });
});

test("Template should suffix the id of an existing element with a random string", (t) => {
    dom.sandbox("", {}, () => {
        let template = new Template("<button id='button'></button>");
        let button = template.set("button");
        t.true(button.id.match(/button_[a-z0-9]{10}/));
        t.end();
    });
});

test("Template should set properties of an existing element", (t) => {
    dom.sandbox("", {}, () => {
        let template = new Template("<h1 id='h1'></h1>");
        let h1 = template.set("h1", { innerHTML: "Hello" });
        t.equal(h1.innerHTML, "Hello");
        t.end();
    });
});
