import React, { createContext, useMemo, useState } from "react";

const toDoListContextValues = {
  openedItemKey: "",
  setOpenedItemKey: () => {},
};

export const ToDoListContext = createContext(
  toDoListContextValues,
);

export function ToDoListProvider({
  initialOpenedItemKey = "",
  children,
}) {
  const [openedItemKey, setOpenedItemKey] = useState(initialOpenedItemKey);

  const value = useMemo(() => {
    return {
      openedItemKey,
      setOpenedItemKey,
    };
  }, [openedItemKey]);

  return (
    <ToDoListContext.Provider value={value}>{children}</ToDoListContext.Provider>
  );
}

ToDoListProvider.Context = ToDoListContext;
