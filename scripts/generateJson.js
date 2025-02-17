// Enum for node types
const OBNodeType = {
  Unset: 0,
  Data: 1,
  ChildList: 2,
  ChildMap: 3,
  Link: 4,
  Null: 5
}

// A helper to wrap an ArrayBuffer for sequential reading
class BufferReader {
  constructor(buffer) {
    this.buffer = buffer
    this.view = new DataView(buffer)
    this.offset = 0
    this.decoder = new TextDecoder('latin1')
  }
  readByte() {
    return this.view.getUint8(this.offset++)
  }
  readBytes(n) {
    const bytes = new Uint8Array(this.buffer, this.offset, n)
    this.offset += n
    return bytes
  }
  // Reads n bytes and returns a new BufferReader for them
  subReader(n) {
    const bytes = this.readBytes(n)
    return new BufferReader(bytes.buffer)
  }
}

// Extract a byte from the steganographic data using 8 LSBs from the flattened array
const getByte = (offset, data) => {
  let outByte = 0
  for (let bits = 0; bits < 8; bits++) {
    outByte |= (data[offset * 8 + bits] & 1) << bits
  }
  return outByte
}

// Reads the hidden byte stream from the image’s RGB pixel data
const readHiddenBytes = (pixelData) => {
  // pixelData is a Uint8Array of RGBA values; we only use R, G, B channels per pixel
  const rgbData = []
  for (let i = 0; i < pixelData.length; i += 4) {
    rgbData.push(pixelData[i], pixelData[i + 1], pixelData[i + 2])
  }
  // first 4 bytes encode length
  let length = 0
  for (let i = 0; i < 4; i++) {
    length = (length << 8) | getByte(i, rgbData)
  }
  const hidden = new Uint8Array(length)
  for (let i = 0; i < length; i++) {
    hidden[i] = getByte(i + 4, rgbData)
  }
  return hidden
}

// Reads a varint from the buffer
const readVarint = (br) => {
  let byte = br.readByte()
  let count = 1
  if (byte & 1) {
    count++
    if (byte & 2) {
      count++
      if (byte & 4) {
        count++
      }
    }
  }
  for (let i = 1; i < count; i++) {
    byte |= br.readByte() << (i * 8)
  }
  return byte >> Math.min(count, 3)
}

// Reads a string (latin1) prefixed by a variable-length length
const readString = (br) => {
  let length = 0, i = 0
  while (true) {
    const byte = br.readByte()
    length |= (byte & 0x7F) << (i * 7)
    if (!(byte & 0x80)) break
    if (++i > 2) break
  }
  const bytes = br.readBytes(length)
  return br.decoder.decode(bytes)
}

// The main recursive decoder
const decodeNode = (br) => {
  const type = br.readByte()
  if (type === OBNodeType.Unset) {
    return 'Unset'
  }
  else if (type === OBNodeType.Data) {
    const size = readVarint(br)
    return br.readBytes(size)
  }
  else if (type === OBNodeType.ChildList) {
    const count = readVarint(br)
    const list = []
    for (let i = 0; i < count; i++) {
      let elem = decodeNode(br)
      if (elem instanceof Uint8Array) {
        elem = new TextDecoder('latin1').decode(elem)
        // remove control characters
        elem = elem.replace(/[\x00-\x1F\x7F-\x9F]+/g, '')
      }
      list.push(elem)
    }
    return list
  }
  else if (type === OBNodeType.ChildMap) {
    const count = readVarint(br)
    const obj = {}
    for (let i = 0; i < count; i++) {
      const key = readString(br)
      let value = decodeNode(br)
      if (value instanceof Uint8Array) {
        const len = value.length
        // Conversion based on key and length
        if (['Rotation','Orientation','Version','FlightDirection','FormationOrder','Key','Max','Min','ID','BuildMirrorAxis','PaintMirrorAxis','AssignmentPriority'].includes(key) && len === 4) {
          value = new DataView(value.buffer, value.byteOffset, 4).getInt32(0, true)
        }
        else if (key === 'DefaultAttackRotation') {
          value = new DataView(value.buffer, value.byteOffset, 4).getFloat32(0, true)
        }
        else if (key === 'DefaultAttackRadius') {
          value = new DataView(value.buffer, value.byteOffset, 4).getUint32(0, true)
        }
        else if (key === 'Value' && len === 4) {
          value = new DataView(value.buffer, value.byteOffset, 4).getUint32(0, true)
        }
        else if (['Location','Cell','Key'].includes(key) && len === 8) {
          const dv = new DataView(value.buffer, value.byteOffset, 8)
          value = [dv.getInt32(0, true), dv.getInt32(4, true)]
        }
        else if (['FlipX','FlipY','Value','BuildMirrorEnabled','PaintMirrorEnabled','AutoFillFromLower'].includes(key) && len === 1) {
          value = Boolean(value[0])
        }
        else if (key === 'Value' && len === 8) {
          const dv = new DataView(value.buffer, value.byteOffset, 8)
          value = [dv.getFloat32(0, true), dv.getFloat32(4, true)]
        }
        else if (['ID','Name','Author','RoofBaseTexture','ShipRulesID','Description','ComponentID','PartID','IDString','Value'].includes(key)) {
          const subReader = new BufferReader(value.buffer.slice(value.byteOffset, value.byteOffset + value.byteLength))
          value = readString(subReader)
        }
        else if (['Color','RoofBaseColor','RoofDecalColor1','RoofDecalColor2','RoofDecalColor3','CrewUniformColor'].includes(key) && len === 16) {
          const hexGroup = (start) => {
            return Array.from(value.slice(start, start + 4)).map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase()
          }
          value = [hexGroup(0), hexGroup(4), hexGroup(8), hexGroup(12)]
        }
        else {
          // unhandled binary value – leave as Uint8Array
        }
      }
      obj[key] = value
    }
    return obj
  }
  else if (type === OBNodeType.Link) {
    const subtype = br.readByte()
    if (subtype === 255) {
      const _id = readVarint(br)
      return { _type: 'link', _id }
    }
    else if (subtype === 254) {
      return null
    }
  }
  else if (type === OBNodeType.Null) {
    return null
  }
  else {
    throw new TypeError(`Unexpected type ${type}`)
  }
}

// Main function to parse ship data from a PNG file or ArrayBuffer
const parseShip = async (fileInput) => {
  // Obtain ArrayBuffer from File or assume fileInput is already an ArrayBuffer
  let buffer
  if (fileInput instanceof File || fileInput instanceof Blob) {
    buffer = await new Promise(resolve => {
      const fr = new FileReader()
      fr.onload = () => resolve(fr.result)
      fr.readAsArrayBuffer(fileInput)
    })
  }
  else {
    buffer = fileInput
  }
  // Use UPng to decode PNG; upng.decode returns an object with {width, height, data} where data is RGBA
  const png = UPNG.decode(buffer)
  // Get pixel data (RGBA)
  const pixelData = new Uint8Array(UPNG.toRGBA8(png)[0])
  // Read hidden data bytes from the RGB channels
  let hidden = readHiddenBytes(pixelData)
  // If hidden data starts with "COSMOSHIP", strip the first 9 bytes (and note version if needed)
  const tag = new TextDecoder('ascii').decode(hidden.slice(0, 9))
  if (tag === 'COSMOSHIP') {
    hidden = hidden.slice(9)
  }
  // Decompress with pako
  const rawData = pako.ungzip(hidden)
  const br = new BufferReader(rawData.buffer)
  const data = decodeNode(br)
  return data
}