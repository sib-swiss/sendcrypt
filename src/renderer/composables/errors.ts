export interface UseErrors {
    formatError: (error: string) => string
}

export function useErrors(): UseErrors {
    const formatError = (error: string) => {
        const regex = /Error invoking remote method '(.*)': (.*)/
        const match = error.match(regex)
        if (match !== null) {
            return match[2]
        }
    }

    return {
        formatError
    }
}