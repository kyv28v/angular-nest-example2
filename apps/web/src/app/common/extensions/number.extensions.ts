export {};

declare global {
  interface Number {
    toSize(): string | null
    round(base: any): number
    ceil(base: any): number
    floor(base: any): number
  }
}

Number.prototype.toSize = function (): string | null {
  try {
    const kb = 1024
    const mb = Math.pow(1024, 2)
    const gb = Math.pow(1024, 3)

    const size = parseInt(this.toString())

    if (size >= gb) {
      return (size / gb).floor(2) + ' GB'
    } else if (size >= mb) {
      return (size / mb).floor(2) + ' MB'
    } else if (size >= kb) {
      return (size / kb).floor(2) + ' KB'
    } else {
      return size + ' byte'
    }
  } catch(e) {
    return null;
  }
};

Number.prototype.round = function (base): number {
  return Math.round((this as number) * base) / base;
}

Number.prototype.ceil = function (base): number {
  return Math.ceil((this as number) * base) / base;
}

Number.prototype.floor = function (base): number {
  return Math.floor((this as number) * base) / base;
}
