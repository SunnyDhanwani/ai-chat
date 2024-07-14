export const getGlobalItem = (key: string) => {
  if (typeof window !== "undefined") {
    const value = localStorage.getItem(key);

    if (value) {
      return JSON.parse(value);
    } else {
      return null;
    }
  }

  return null;
};


export const setGlobalItem = (key: any, value: any) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

export const clearGlobalItem = () => {
  if (typeof window !== "undefined") {
    localStorage.clear();
  }
};
