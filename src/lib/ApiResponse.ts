export default function ApiResponse<T>(
    status: number,
    message?: string,
    data?: T,
):ApiResponseType<T> {
    return {
        message: message || (status < 400 ? "Success" : "Failed"),
        data: data || undefined,
        success: status < 400,
    }
}

export interface ApiResponseType<T> {
    message: string
    data: T | undefined
    success: boolean
}