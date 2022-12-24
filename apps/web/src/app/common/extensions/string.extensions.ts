export {};

declare global {
  interface String {
    toDate(): Date | string;
    getHourFromTime(): number | null;
  }
}

String.prototype.toDate = function (): Date | string {
  var str: string = String(this);
  if (str.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)) {
    return new Date(Date.parse(str));
  }
  return str;
};

String.prototype.getHourFromTime = function (): number | null {
  try {
    const arr = this.split(':');
    const hour = parseInt(arr[0]);
    const minute = parseInt(arr[1]) / 60;
    return hour + minute;
  } catch {
    return null;
  }
};
