export const validateImageUrl = async (url) => {
    try {
        const response = await fetch(url);
        const contentType = response.headers.get('content-type');
        return contentType.startsWith('image/');
    } catch {
        return false;
    }
};

export const validateImageUrls = async (urls) => {
    const validations = await Promise.all(urls.map(validateImageUrl));
    return urls.filter((_, index) => validations[index]);
}; 