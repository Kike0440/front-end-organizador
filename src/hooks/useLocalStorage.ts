import { useState, useEffect } from "react";

function getSavedValue<T>(key: string, initialValue: T | (() => T)): T {
    try {
        const storedValue = localStorage.getItem(key);
        if (storedValue) {
            return JSON.parse(storedValue);
        }
    } catch (error) {
        console.error(`Error reading localStorage key "${key}":`, error);
    }

    if (typeof initialValue === "function") {
        return (initialValue as () => T)();
    }
    return initialValue;
}

function useLocalStorage<T>(key: string, initialValue: T | (() => T)): [T, React.Dispatch<React.SetStateAction<T>>] {
    const [value, setValue] = useState<T>(() => getSavedValue(key,initialValue));

    useEffect(() => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error(`Error writing to localStorage key "${key}":`, error);
        }
    }, [key,value]);

    return [value, setValue];
}

export default useLocalStorage;