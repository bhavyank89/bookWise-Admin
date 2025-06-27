// Utility function to join class names conditionally
export function cn(...classes) {
    return classes.filter(Boolean).join(' ');
}

// Example of a function to format a date
export function formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
}

// Example of a function to fetch JSON data with error handling
export async function fetchJson(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    } catch (error) {
        console.error('Fetch error: ', error);
        throw error;
    }
}

// Example of a function to capitalize a string
export function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
