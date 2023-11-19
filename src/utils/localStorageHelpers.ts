export function getItem(key: string) {
  const item = localStorage.getItem(key);

  if (item !== null) {
    const parsedItem = JSON.parse(item);

    if (Array.isArray(parsedItem) || typeof parsedItem === 'object') {
      return parsedItem;
    }
  }

  return item;
}

export function setItem(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function removeItem(key: string){
  localStorage.removeItem(key);
}
