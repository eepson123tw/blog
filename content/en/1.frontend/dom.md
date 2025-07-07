---
title: The Abyss of DOM's Foundation
description: What exactly is the DOM?
icon: 'lucide:dice-6'
gitTalk: false
date: 2022-10-28 23:45:03
read: '20'
authors:
  - name: Aaron Shih
    username: eepson123tw
    avatar: https://www.github.com/eepson123tw.png
    to: https://github.com/eepson123tw
    target: _blank
---

> What exactly is the DOM?

In fact, the DOM is a [definition](https://www.w3.org/TR/WebIDL/) specified by W3C WebIDL, which host browser applications implement according to this definition (with underlying C++ implementation), and it is a data structure that exists in [WebKit][1]'s memory.

## How Browsers Implement DOM

As mentioned earlier, the DOM exists in WebKit memory, and the specific operations can be simplified into the diagram below:

![Internal Relationship Diagram](/images/dom/inside.webp)

## Wrapper Objects and V8 Binding

The browser binds with WebKit (DOM) through its internal engine (V8 binding), creating a **wrapper object** that can be accessed in memory.

![binding](/images/dom/bindingV8.webp)

The [detailed implementation](https://www.jianshu.com/p/53de5e4deb43) of V8 and DOM binding. What we see in devtools during daily development is not the DOM, but the **render tree**, which is a combination of DOM and CSSOM.

```javascript
// After executing the first two lines, the binding between v8 dom wrapper and c++ DOM is complete
let div = document.createElement('div');
div.innerHTML = '<p><span>foo</span></p>';
// Test the code below
div.xxx = 123;
document.body.appendChild(div);
div = null;
document.body.lastChild.xxx; // 123
```

Through DOM generation APIs, **mappings are created** and stored in memory, allowing us to perform operations without being **garbage collected**.

![Memory Layout](/images/dom/dom-related.webp)

From this diagram, we can understand that once a mapping is created, even if we cancel the memory location reference, the mapping will still exist and the DOM can still be accessed. **_To cancel the mapping, you can only use DOM API remove_**.

> DOM is the interface for JS to manipulate pages, but JS cannot directly perform CRUD operations on DOM - it can only operate indirectly through DOM APIs provided by the host.
>
> > 1. JS operates pages through mapping relationships with DOM 2. Page content control 3. Table and form data events 4. Listening to various user interactions 5. Lazy loading of other resources 6. Component-based and engineering development of complex applications

---

### What methods can create elements and establish mappings?

```markdown
1. Element.innerHTML
2. DOMParser
var parser = new DOMParser();
const htmlString = "<strong>Beware of the leopard</strong>";
const doc3 = parser.parseFromString(htmlString, "text/html");
3. Document.createElementNS
document.createElementNS('p','endition')
->"<endition></endition>"
4. Document.createElement
5. Document.write
6. Document.createDocumentFragment
DocumentFragments are DOM Nodes. They do not become part of the main DOM tree and need to be appended to the DOM tree.
7. Document.createTextNode
Creates text nodes
...
```

---

## DOM Composition

The standard-defined DOM consists of three major parts: 1. Nodes 2. Events 3. Range API

### Nodes

**Tags** are the basic units of HTML, such as: p, div, h1, input, etc.
**Nodes** are the basic units of DOM. A document with a standard structured model has Element, Text, comments, etc., totaling 12 types of nodes [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Node).

Among them, Element <=> HTML tags have a corresponding relationship.

```html
<h2>hello world!<h2>
```

h2 is a tag, and two nodes will be generated inside the DOM.

- Element Node: h2
- Text Node: "hello world!"

> Document
> **Refers to any structured document**:
> XML Document - A document with XML standard model
> HTML Document - A document with HTML standard model
> JSON Document - A document with JSON standard model
>
> > **The browser's document object is a DOM wrapper object that binds the root of the entire DOM** and is mounted on the Global Object (as shown in the memory layout diagram). They [inherit from each other][2] (document -> HTMLDocument.prototype -> Document.prototype -> Node.prototype) and can trace back to object.prototype.

---

### Element

Belongs to the semantics in programming languages. In HTML it's called Tag, and in CSS presentation it's called Box.
Operating the DOM means performing CRUD operations, listening, and binding events on Nodes.

**_Element.prototype_** Common methods for all elements.

> If you use methods to create elements and establish mappings, the element's **proto** will point to this prototype method, which contains various element operation functions, special properties of each tag, default behavioral styles of different tags, etc.

---

**_Document.prototype_** Common methods for document.

> It's the root and general term for an XML document, mounting many DOM common functions, as well as some browser information (URL, engine-related load ready), HTML tag collections (document.all), etc. Its semantics cover HTML, DOM, and documents. Due to various historical factors, it contains many methods and data.

---

## DOM Tree

A term used to describe the DOM. Like the DOM, it refers to Objects in WebKit memory, but when talking about DOM Tree, the focus is on **tree structure**, while when talking about DOM, it's contrasting with **Wrapper objects** in JS.

![DOM Tree](/images/dom/dom_tree.webp)

---

### NodeList vs HTMLCollection

- NodeList: Static/dynamic collection containing all Node types including Element, Text, attributes, comments - all 12 types of nodes (querySelector series)
- HTMLCollection: Dynamic collection containing only Element nodes (getElement series)

---

## Reflow and Repaint

![Repaint ReFlow](/images/dom/webkit_render.webp)

Page generation process:

1. HTML is parsed by HTML parser into DOM tree
2. CSS is parsed by CSS parser into CSSOM tree
3. DOM tree + CSSOM tree generate a render tree
4. Generate layout (flow) - browser draws all nodes on screen
5. Paint the layout on screen, displaying the entire page
6. Steps 4 and 5 are the most time-consuming parts. These two steps together are what we usually call rendering

**Reflow**: When DOM changes affect an element's geometric information, the browser needs to recalculate element size, width, height and other properties, and arrange them in correct positions. This is called reflow - regenerating layout and rearranging.
**Repaint**: When an element's appearance changes but layout doesn't change, the process of redrawing the element's appearance is called repaint.
**_Any operation that changes the render tree will cause reflow or repaint. Reflow inevitably causes repaint_**

- [CSS Triggers](https://csstriggers.com/)

---

## DOM vs VDOM

Why does direct DOM manipulation affect performance?

- Frequent DOM operations cause reflow and repaint, making the browser switch back and forth between V8 and WebKit threads (can only choose one)
- Switching between the two engine threads causes **"performance loss"**
- Therefore, modern frameworks naturally developed the concept of Virtual DOM to avoid frequent DOM operations

VDOM Design

- Using JS objects to simulate DOM is VDOM (Vue VNode)
- When page data changes, generate new VDOM (Vue side effects, reactive generation, Diff comparison)
- Compare differences between two VDOMs (Vue Diff algorithm, double-ended Diff, fast Diff)
- Map differences to real DOM through DOM APIs (Vue renderer)

## API Classification

Source: MDN

```markdown
{

---Document Verification

Document.readyState
  - Property describing document's loading state

Document.title
  - Document title

Document.visibilityState
  - Returns document visibility, the context environment of currently visible elements. This shows whether the current document (page) is in background or hidden in invisible tabs

----

---Document Writing
Document.write()
  - document.write(markup);
  - Method writes a text string to a document stream opened by document.open()
---

--- Fullscreen Related
Document.webkitFullscreenEnabled
  - "Fullscreen enabled" property indicates whether fullscreen mode is available
Document.webkitIsFullScreen
  - Whether in fullscreen mode
Document.exitFullscreen()
  - Used to exit fullscreen mode for current document

document.fullscreenElement //Returns Element node currently in fullscreen mode in current document, returns null if not using fullscreen mode
document.fullscreenEnabled //Returns boolean indicating whether browser supports fullscreen mode
---

--- Range Objects

Document.createRange()
  - Range object (can be used for rich text cutting)
  - var range = document.createRange();
    range.setStart(startNode, startOffset);
    range.setEnd(endNode, endOffset);

Document.caretRangeFromPoint()
  - var range = document.caretRangeFromPoint(float x, float y);
  - Returns a Range object (document fragment at specified coordinates)
---

--- Creation Classes (DOM/Elements/Comments/Events)
Document.createAttribute()
  - attribute = document.createAttribute(name)
  - Creates and returns a new attribute node

Document.createElement()
  - document.createElement(tagName[, options]);
  - Creates an HTML element specified by tagName. If user agent cannot recognize tagName, generates an unknown HTML element HTMLUnknownElement

Document.createDocumentFragment()
  - let fragment = document.createDocumentFragment();
  - Creates a new empty document fragment. Document fragments exist in memory and not in DOM tree,
  - so inserting child elements into document fragments doesn't cause page reflow (calculations of element position and geometry). Therefore, using document fragments usually brings better performance
---

--- Getting Element Information

Node.nodeType  //Read-only property representing node object type
  - document.nodeType 9 (Node.DOCUMENT_NODE)

Node.previousSibling //Returns previous sibling node of current node
Element.nextElementSibling // Returns next element node among child element nodes of parent element, returns null if element is already the last element node
Element.previousElementSibling  //Returns previous element node among child element nodes of parent element, returns null if element is already the first element node
Element.classList //Read-only property representing live updated collection of class attributes - DOMTokenList
Element.className  // Gets or sets class attribute value of specified element

Element.innerHTML // Property gets or sets HTML or XML markup contained within element

Element.getBoundingClientRect()
  - Returns element size and its position relative to viewport
  - For standard box model, element size equals total of width/height + padding + border-width
  - If box-sizing: border-box, element size equals width/height

Element.querySelector()
  - baseElement.querySelector(selectors)
  - Returns first element descendant matching specified selector group

Element.querySelectorAll()
  - Returns non-live NodeList containing all non-active nodes from elements matching specified CSS selector group
  - baseElement.querySelectorAll(selectors);

Node.cloneNode()
 - var dupNode = node.cloneNode(deep{true||false}); //If true, all descendant nodes will also be cloned
  - Function returns copy of node object calling this method
Node.contains()
  - document.body.contains(node) ex. document.body.contains(document.querySelector('body') //true
  - Returns boolean indicating whether passed node is descendant node of this node

Document.getElementById()
  - document.getElementById(id);
  - Returns element matching specific ID

Document.getElementsByClassName()
  - document.getElementsByClassName(names);
  - Returns array-like object containing all child elements with specified class names

Document.getElementsByName()
  - document.getElementsByName(name)
  - Returns node list collection in (X)HTML document

Document.getElementsByTagName()
  - document.getElementsByTagName(name);
  - Returns HTMLCollection containing all elements with given tag name

Element.getAttribute()
  - align = div1.getAttribute("align");
  - Function returns attribute of web element. If attribute doesn't exist, return value will be null or "" (empty string)
Element.getAttributeNS()
  - Namespaces only supported in XML documents
  - Returns string value of attribute with specified namespace and name. If named attribute doesn't exist, return value will be null or "" (empty string)
Element.getAttributeNames()
  - let attributeNames = element.getAttributeNames();
  - Returns Array containing all attribute names of specified Element, returns empty array if element contains no attributes

Element.hasAttribute()
  - element.hasAttribute(attName);
  - Returns boolean indicating whether element contains specified attribute

---

--- Setting Elements

Element.attributes //Turns all attributes in specific node into collection and returns it // NamedNodeMap is not an array. attributes is key/value pairing

Element.toggleAttribute()
  - Element.toggleAttribute(name [, force]);
  - Toggles boolean attribute state of given element (adds attribute if doesn't exist, removes if exists)

Element.setAttribute()
  - element.setAttribute(name, value);
  - Sets attribute value on specified element. If attribute already exists, updates the value

Element.before()
  - child.before(span);
  - Method can insert series of Node or DOMString objects in parent node of this ChildNode,
  - position is before ChildNode, DOMString objects are inserted like Text nodes

Element.after()
  - after(... nodes)
  - Method inserts Node or DOMString objects in parent node's child node list. Insert position is after this node. DOMString objects are inserted as Text

Element.append()
  - parent.append(p);
  - Inserts set of Node objects or DOMString objects after last child node of Element
  - No return value, Node.appendChild() returns appended object

Element.prepend()
  - Element.prepend((Node or DOMString)... nodes);
  - Inserts series of Node objects or DOMString objects before first child node of parent node

Element.insertAdjacentElement()
  - element.insertAdjacentElement(position, element);
  - activeElem.insertAdjacentElement('afterend',div)
  - Inserts given element node at given position relative to called element
  'beforebegin': Before the element itself
  'afterbegin': Inside the element, before its first child
  'beforeend': Inside the element, after its last child
  'afterend': After the element itself

Element.insertAdjacentHTML()
  - insertAdjacentHTML() parses passed string as HTML or XML and inserts that node at specified position in DOM tree
  - It doesn't reparse used element, so doesn't destroy existing elements inside
  - element.insertAdjacentHTML(position, text);
  - position like top
  - d1.insertAdjacentHTML('afterend', '<div id="two">two</div>');

Element.insertAdjacentText()
  - Inserts given text node at given position relative to called element
  - element.insertAdjacentText(position, element);
  - position like top
  - para.insertAdjacentText('afterbegin',textInput.value);

Element.replaceChildren()
  - Element.replaceChildren(...nodesOrDOMStrings)
  - Replaces Node descendants with specified descendant collection. New descendants can be DOMString or Node objects

Element.replaceWith()
  - child.replaceWith(span);
  - Node object or DOMString object replaces child node under this node's parent

----

---Removal

Node.removeChild()
  - node.removeChild(child);
  - Removes child node from DOM and returns removed node. Can delete DOM mapping bound by v8binding, immediately unusable and irreversible

Node.replaceChild()
  - parentNode.replaceChild(newChild, oldChild);
  - Replaces child node of current node with specified node and returns replaced node
  - Can explore whether DOM binding still exists?

Element.remove()
  - node.remove();
  - Removes object from DOM tree it belongs to

Element.removeAttribute()
  - element.removeAttribute(attrName);
  - Removes attribute from specified element

----

location object's position (URL), contains URL-related information of document and provides methods to change that URL and load other URLs
----
  document.location
  document.location === window.location interface locations are equal
  document.location.href //entire url
  document.location.host //returns domain name (including port) 192.168.31.121:8080
  document.location.search  //returns URL parameters including (?)
  document.location.hash   // returns identifier URL parameters including (#)
  document.location.reload // fn reloads page resources
  document.location.replace // fn navigates to given URL, no history record
---

Settable Function Types
---
document.designMode // Controls whether entire document is editable = "on" || "off"
document.dir // Document text direction = 'ltr' || 'rtl'
---

}
```

## References and Citations

- [What, exactly, is the DOM?](https://bitsofco.de/what-exactly-is-the-dom/)
- [Virtual DOM](https://www.gushiciku.cn/pl/gFY6/zh-tw)
- [Why is DOM manipulation the most performance-intensive operation in frontend?](https://www.zhihu.com/question/324992717/answer/707044362)
- [v8](https://www.jianshu.com/p/53de5e4deb43)
- [Why are functions on document and element different?](https://www.zhihu.com/question/269333790/answer/350467595)
- [HTML Tag Periodic Table](https://html5.tool.webfrontend.dev/)
- [Rendering Process](https://www.cnblogs.com/111testing/p/11186335.html)
- [Chrome BindingDesign](https://chromium.googlesource.com/chromium/src.git/+/62.0.3178.1/third_party/WebKit/Source/bindings/core/v8/V8BindingDesign.md)

[1]: https://en.wikipedia.org/wiki/WebKit "Webkit"
[2]: https://www.796t.com/post/YjJ2dWc=.html "dom inheritance"
