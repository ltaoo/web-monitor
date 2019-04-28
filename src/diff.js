const isDate = d => d instanceof Date;
const isEmpty = o => Object.keys(o).length === 0;
const isObject = o => o != null && typeof o === 'object';
const properObject = o => isObject(o) && !o.hasOwnProperty ? { ...o } : o;

const diff = (lhs, rhs) => {
    if (lhs === rhs) return {}; // equal return no diff
  
    if (!isObject(lhs) || !isObject(rhs)) return rhs; // return updated rhs
  
    const l = properObject(lhs);
    const r = properObject(rhs);
  
    const deletedValues = Object.keys(l).reduce((acc, key) => {
      return r.hasOwnProperty(key) ? acc : { ...acc, [key]: undefined };
    }, {});
  
    if (isDate(l) || isDate(r)) {
      if (l.valueOf() == r.valueOf()) return {};
      return r;
    }
  
    return Object.keys(r).reduce((acc, key) => {
      if (!l.hasOwnProperty(key)) return { ...acc, [key]: r[key] }; // return added r key
  
      const difference = diff(l[key], r[key]);
  
      if (isObject(difference) && isEmpty(difference) && !isDate(difference)) return acc; // return no diff
  
      return { ...acc, [key]: difference }; // return updated key
    }, deletedValues);
  };
