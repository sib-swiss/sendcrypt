export interface UseDateFormatter {
    timestampToTime: (timestamp: string) => string
    dateToHumanFormat: (date: Date) => string
}

export function useDateFormatter(): UseDateFormatter {
    const timestampToTime = (timestamp: string) => {
        const date = new Date(timestamp);
        const locale = navigator.language;
        return date.toLocaleTimeString(locale, {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        })
    }

    const dateToHumanFormat = (date: Date) => {
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return "Today";
        } else if (date.toDateString() === yesterday.toDateString()) {
            return "Yesterday";
        } else {
            const options: Intl.DateTimeFormatOptions = {year: "numeric", month: "long", day: "numeric"};
            return date.toLocaleDateString(undefined, options);
        }
    }

    return {
        timestampToTime,
        dateToHumanFormat
    }
}