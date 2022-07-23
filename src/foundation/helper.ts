function undefinedOrNull(value: any): boolean {
  return value !== undefined && value !== null;
}

function isNumber(value: any): boolean {
  return undefinedOrNull(value) && typeof value === 'number';
}

export default {
  undefinedOrNull,
  isNumber
}