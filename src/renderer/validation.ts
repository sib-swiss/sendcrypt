export default {
    required: (value: string) => !!value || 'This field is required',
    min: (value: string, limit = 3) => (value && value.length >= limit) || `Min ${limit} characters`,
    max: (value: string, limit = 15) => (value && value.length <= limit) || `Max ${limit} characters`,
    password: (value: string) => (value && value.length >= 9) || 'Min 9 characters',
    email: (value: string) => /.+@.+/.test(value) || 'E-mail must be valid',
    url: (value: string) => /^(http:\/\/)|^(https:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(value) || 'URL must be valid',
    path: (value: string) => /^\/[a-zA-Z0-9_\-/]+$/.test(value) || 'Path must be valid',
    number: (value: string) => /^[0-9]+$/.test(value) || 'Must be a number',
}