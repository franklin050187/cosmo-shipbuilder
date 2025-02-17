//Currently broken
const OBNodeType = {
  Unset: 0,
  Data: 1,
  ChildList: 2,
  ChildMap: 3,
  Link: 4,
  Null: 5,
};

class BufferReader {
  constructor(uint8) {
    this.data = uint8;
    this.offset = 0;
  }
  readByte() {
    return this.data[this.offset++];
  }
  readBytes(n) {
    const bytes = this.data.subarray(this.offset, this.offset + n);
    this.offset += n;
    return bytes;
  }
}

function readVarint(reader) {
  let byte = reader.readByte();
  let count = 1;
  if (byte & 1) { count++; if (byte & 2) { count++; if (byte & 4) { count++; } } }
  for (let i = 1; i < count; i++) {
    byte |= reader.readByte() << (i * 8);
  }
  return byte >>> Math.min(count, 3);
}

function readString(reader) {
  let length = 0, i = 0;
  while (true) {
    const b = reader.readByte();
    length |= (b & 0x7F) << (i * 7);
    if ((b & 0x80) === 0) break;
    if (i++ > 2) break;
  }
  return new TextDecoder('latin1').decode(reader.readBytes(length));
}

function readInt32LE(arr) {
  return new DataView(arr.buffer, arr.byteOffset, arr.byteLength).getInt32(0, true);
}
function readUInt32LE(arr) {
  return new DataView(arr.buffer, arr.byteOffset, arr.byteLength).getUint32(0, true);
}
function readFloatLE(arr) {
  return new DataView(arr.buffer, arr.byteOffset, arr.byteLength).getFloat32(0, true);
}

function decodeNode(reader) {
  const type = reader.readByte();
  if (type === OBNodeType.Unset) return "Unset";
  if (type === OBNodeType.Data) {
    const size = readVarint(reader);
    return reader.readBytes(size);
  }
  if (type === OBNodeType.ChildList) {
    const count = readVarint(reader), list = [];
    for (let j = 0; j < count; j++) {
      let elem = decodeNode(reader);
      if (elem instanceof Uint8Array) {
        elem = new TextDecoder('latin1').decode(elem).replace(/[\x00-\x1F\x7F-\x9F]+/g, "");
      }
      list.push(elem);
    }
    return list;
  }
  if (type === OBNodeType.ChildMap) {
    const count = readVarint(reader), obj = {};
    for (let j = 0; j < count; j++) {
      const key = readString(reader);
      let value = decodeNode(reader);
      if (value instanceof Uint8Array) {
        const len = value.length;
        if (["Rotation","Orientation","Version","FlightDirection","FormationOrder","Key","Max","Min","ID","BuildMirrorAxis","PaintMirrorAxis","AssignmentPriority"].includes(key) && len === 4)
          value = readInt32LE(value);
        else if (key === "DefaultAttackRotation")
          value = readFloatLE(value);
        else if (key === "DefaultAttackRadius")
          value = readUInt32LE(value);
        else if (key === "Value" && len === 4)
          value = readUInt32LE(value);
        else if (["Location","Cell","Key"].includes(key) && len === 8)
          value = [readInt32LE(value.slice(0,4)), readInt32LE(value.slice(4,8))];
        else if (["FlipX","FlipY","Value","BuildMirrorEnabled","PaintMirrorEnabled","AutoFillFromLower"].includes(key) && len === 1)
          value = Boolean(value[0]);
        else if (key === "Value" && len === 8)
          value = [readFloatLE(value.slice(0,4)), readFloatLE(value.slice(4,8))];
        else if (["ID","Name","Author","RoofBaseTexture","ShipRulesID","Description","ComponentID","PartID","IDString","Value"].includes(key))
          value = new TextDecoder('latin1').decode(value);
        else if (["Color","RoofBaseColor","RoofDecalColor1","RoofDecalColor2","RoofDecalColor3","CrewUniformColor"].includes(key) && len === 16) {
          const groups = [];
          for (let k = 0; k < 4; k++) {
            let hex = "";
            for (let b = 0; b < 4; b++) {
              hex += value[k*4 + b].toString(16).padStart(2, '0');
            }
            groups.push(hex.toUpperCase());
          }
          value = groups;
        } else {
          console.log("Unhandled key with binary value:", { [key]: value });
          continue;
        }
      }
      obj[key] = value;
    }
    return obj;
  }
  if (type === OBNodeType.Link) {
    const subtype = reader.readByte();
    if (subtype === 255) return { _type: "link", _id: readVarint(reader) };
    if (subtype === 254) return null;
  }
  if (type === OBNodeType.Null) return null;
  throw new TypeError("Unexpected type " + type);
}

async function parseShipFile(file) {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => {
      const uint8 = new Uint8Array(fr.result);
      const png = UPNG.decode(uint8.buffer);
      const rgba = UPNG.toRGBA8(png)[0];
      const pixelCount = rgba.length / 4;
      const channelData = new Uint8Array(pixelCount * 3);
      for (let i = 0; i < pixelCount; i++) {
        channelData[i * 3] = rgba[i * 4];
        channelData[i * 3 + 1] = rgba[i * 4 + 1];
        channelData[i * 3 + 2] = rgba[i * 4 + 2];
      }
      const getByte = (offset, data) => {
        let out = 0;
        for (let b = 0; b < 8; b++) {
          out |= (data[offset * 8 + b] & 1) << b;
        }
        return out;
      };
      const lenBytes = [getByte(0, channelData), getByte(1, channelData), getByte(2, channelData), getByte(3, channelData)];
      const length = (lenBytes[0] << 24) | (lenBytes[1] << 16) | (lenBytes[2] << 8) | lenBytes[3];
      const compData = new Uint8Array(length);
      for (let i = 0; i < length; i++) {
        compData[i] = getByte(i + 4, channelData);
      }
      const header = new TextEncoder().encode("COSMOSHIP");
      let version = 1;
      if (compData.length >= header.length && header.every((b, i) => compData[i] === b)) {
        compData.set(compData.slice(header.length));
        compData = compData.slice(header.length);
        version = 2;
      }
      const rawData = pako.ungzip(compData);
      const readerObj = new BufferReader(rawData);
      try {
        resolve(decodeNode(readerObj));
      } catch (e) {
        reject(e);
      }
    };
    fr.onerror = reject;
    fr.readAsArrayBuffer(file);
  });
}