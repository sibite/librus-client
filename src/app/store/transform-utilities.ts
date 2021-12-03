export function assignProperties(targetObj: any, srcContainer: { [key: number]: any }, properties: any[]): void {
  if (!targetObj) return;
  const srcObj = srcContainer[targetObj.Id];
  properties.forEach(property => {
    targetObj[property] = srcObj[property];
  });
}

export function getIdAsKeysObj(arrayOfChilds: any[]): { [key: number]: any} {
  let obj = {};
  arrayOfChilds.forEach(child => {
    obj[child.Id] = child;
  })
  return obj;
}
