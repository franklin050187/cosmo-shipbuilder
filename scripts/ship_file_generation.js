function getBitmap() {
    return ctx.getImageData(0, 0, canvas.width, canvas.height)
}

function convertJsonToOBNode(json) {
  if (json === null) {
    const node = new OBNode();
    node.changeToNull();
    return node;
  } else if (Array.isArray(json)) {
    const node = new OBNode();
    node.changeToChildList();
    for (const item of json) {
      node.addChild(convertJsonToOBNode(item));
    }
    return node;
  } else if (typeof json === 'object') {
    const node = new OBNode();
    node.changeToChildMap();
    for (const key in json) {
      if (json.hasOwnProperty(key)) {
        node.addChildWithKey(key, convertJsonToOBNode(json[key]));
      }
    }
    return node;
  } else {
    const node = new OBNode();
    const str = json.toString();
    const encoder = new TextEncoder();
    node.changeToData(encoder.encode(str));
    return node;
  }
}

const OBNodeType = {
    Unset: 0,
    Data: 1,
    ChildList: 2,
    ChildMap: 3,
    Link: 4,
    Null: 5
  };
  
  class OBNode {
    constructor() {
      this._type = OBNodeType.Unset;
      this._contents = null;
    }
    get nodeType() {
      return this._type;
    }
    get data() {
      if (this._type !== OBNodeType.Data)
        throw new Error("Node must be of type Data to get its data.");
      return this._contents;
    }
    set data(value) {
      if (!value)
        throw new Error("Value is required.");
      if (this._type === OBNodeType.Unset)
        this.changeToData(value);
      else if (this._type === OBNodeType.Data)
        this._contents = value;
      else
        throw new Error("Node must be of type Data or Unset to set its data.");
    }
    get childCount() {
      if (this._type === OBNodeType.ChildList)
        return this._contents.length;
      if (this._type === OBNodeType.ChildMap)
        return Object.keys(this._contents).length;
      return 0;
    }
    // ChildList indexer methods
    getChild(index) {
      if (this._type !== OBNodeType.ChildList)
        throw new Error("Node must be of type ChildList to get a child by index.");
      return this._contents[index];
    }
    setChild(index, child) {
      if (!child) throw new Error("Child is required.");
      if (this._type !== OBNodeType.ChildList)
        throw new Error("Node must be of type ChildList to set a child by index.");
      this._contents[index] = child;
    }
    // ChildMap indexer methods
    getChildByKey(key) {
      if (this._type !== OBNodeType.ChildMap)
        throw new Error("Node must be of type ChildMap to get a child by key.");
      return this._contents[key];
    }
    setChildByKey(key, child) {
      if (!child) throw new Error("Child is required.");
      if (this._type === OBNodeType.Unset)
        this.changeToChildMap();
      else if (this._type !== OBNodeType.ChildMap)
        throw new Error("Node must be of type ChildMap or Unset to set a child by key.");
      this._contents[key] = child;
    }
    // Link node
    get linkTarget() {
      if (this._type !== OBNodeType.Link)
        throw new Error("Node must be of type Link to get its target.");
      return this._contents;
    }
    set linkTarget(value) {
      if (this._type === OBNodeType.Unset)
        this.changeToLink(value);
      else if (this._type === OBNodeType.Link)
        this._contents = value;
      else
        throw new Error("Node must be of type Link to set its target.");
    }
    get finalLinkTarget() {
      let cur = this;
      while (cur && cur._type === OBNodeType.Link)
        cur = cur.linkTarget;
      return cur;
    }
    // Type conversion methods
    changeToUnset() {
      this._type = OBNodeType.Unset;
      this._contents = null;
    }
    changeToData(data = new Uint8Array()) {
      this._type = OBNodeType.Data;
      this._contents = data;
    }
    changeToChildList(children = []) {
      this._type = OBNodeType.ChildList;
      if (!Array.isArray(children))
        throw new Error("Children must be an array.");
      this._contents = [...children];
    }
    changeToChildMap(children = {}) {
      this._type = OBNodeType.ChildMap;
      this._contents = { ...children };
    }
    changeToLink(linkTarget = null) {
      this._type = OBNodeType.Link;
      this._contents = linkTarget;
    }
    changeToNull() {
      this._type = OBNodeType.Null;
      this._contents = null;
    }
    // Child list/map operations
    addChild(child) {
      if (!child) throw new Error("Child is required.");
      if (this._type === OBNodeType.Unset) this.changeToChildList();
      else if (this._type !== OBNodeType.ChildList)
        throw new Error("Node must be of type ChildList or Unset.");
      this._contents.push(child);
    }
    addChildWithKey(key, child) {
      if (!key) throw new Error("Key is required.");
      if (!child) throw new Error("Child is required.");
      if (this._type === OBNodeType.Unset) this.changeToChildMap();
      else if (this._type !== OBNodeType.ChildMap)
        throw new Error("Node must be of type ChildMap or Unset.");
      this._contents[key] = child;
    }
    insertChild(index, child) {
      if (!child) throw new Error("Child is required.");
      if (this._type === OBNodeType.Unset) this.changeToChildList();
      else if (this._type !== OBNodeType.ChildList)
        throw new Error("Node must be of type ChildList or Unset.");
      this._contents.splice(index, 0, child);
    }
    removeChild(child) {
      if (!child) throw new Error("Child is required.");
      if (this._type === OBNodeType.ChildList) {
        const idx = this._contents.indexOf(child);
        if (idx !== -1) {
          this._contents.splice(idx, 1);
          return true;
        }
        return false;
      } else if (this._type === OBNodeType.ChildMap) {
        for (let key in this._contents) {
          if (this._contents[key] === child) {
            delete this._contents[key];
            return true;
          }
        }
        return false;
      }
      return false;
    }
    removeChildAt(index) {
      if (this._type !== OBNodeType.ChildList)
        throw new Error("Node must be of type ChildList.");
      this._contents.splice(index, 1);
    }
    removeChildByKey(key) {
      if (!key) throw new Error("Key is required.");
      if (this._type === OBNodeType.ChildMap) {
        if (this._contents.hasOwnProperty(key)) {
          delete this._contents[key];
          return true;
        }
        return false;
      }
      return false;
    }
    clearChildren() {
      if (this._type === OBNodeType.ChildList)
        this._contents = [];
      else if (this._type === OBNodeType.ChildMap)
        this._contents = {};
    }
    containsChild(child) {
      if (!child) throw new Error("Child is required.");
      if (this._type === OBNodeType.ChildList)
        return this._contents.includes(child);
      if (this._type === OBNodeType.ChildMap)
        return Object.values(this._contents).includes(child);
      return false;
    }
    containsChildKey(key) {
      if (!key) throw new Error("Key is required.");
      return this._type === OBNodeType.ChildMap && this._contents.hasOwnProperty(key);
    }
    tryGetChild(key) {
      if (!key) throw new Error("Key is required.");
      if (this._type === OBNodeType.ChildMap && this._contents.hasOwnProperty(key))
        return this._contents[key];
      return null;
    }
    indexOfChild(child) {
      if (!child) throw new Error("Child is required.");
      return this._type === OBNodeType.ChildList ? this._contents.indexOf(child) : -1;
    }
    getOrMakeChild(key) {
      if (!key) throw new Error("Key is required.");
      if (this._type === OBNodeType.Unset) {
        this.changeToChildMap();
        const node = new OBNode();
        this._contents[key] = node;
        return node;
      } else if (this._type === OBNodeType.ChildMap) {
        if (!this._contents.hasOwnProperty(key))
          this._contents[key] = new OBNode();
        return this._contents[key];
      } else {
        throw new Error("Node must be of type ChildMap or Unset.");
      }
    }
  }