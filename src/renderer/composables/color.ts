export interface UseColor {
    colors: string[]
    randomColor: () => string
}

export function useColor(): UseColor {
    const colors = [
        'red',
        'pink',
        'purple',
        'deep-purple',
        'indigo',
        'blue',
        'light-blue',
        'cyan',
        'teal',
        'green',
        'light-green',
        'lime',
        'yellow',
        'amber',
        'orange',
        'deep-orange',
        'brown',
        'blue-grey',
    ]

    const randomColor = () => {
        return colors[Math.floor(Math.random() * colors.length)]
    }

    return {
        colors,
        randomColor
    }
}