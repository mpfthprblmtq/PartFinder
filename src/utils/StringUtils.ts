export const htmlDecode = (input: string): string => {
    return new DOMParser().parseFromString(input, "text/html").documentElement.textContent ?? '';
}