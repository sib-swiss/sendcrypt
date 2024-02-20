export interface UseFormatter {
    formatFileSize: (size: number) => string
}

export function useFormatter(): UseFormatter {
    const formatFileSize = (size: number) => {
        if (size < 1024) {
            return `${size} B`
        } else if (size < 1024 * 1024) {
            return `${(size / 1024).toFixed(2)} KB`
        } else if (size < 1024 * 1024 * 1024) {
            return `${(size / 1024 / 1024).toFixed(2)} MB`
        } else {
            return `${(size / 1024 / 1024 / 1024).toFixed(2)} GB`
        }
    }

    return {
        formatFileSize,
    }
}

