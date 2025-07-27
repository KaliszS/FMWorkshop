export function getParentDirectory(filePath: string): string {
    // Remove trailing slash if present
    const cleanPath = filePath.replace(/[\/\\]$/, '');
    // Split by path separators and remove the last part (filename)
    const parts = cleanPath.split(/[\/\\]/);
    parts.pop(); // Remove the filename
    return parts.join('/'); // Rejoin with forward slashes
}