import ApiResponse, { ApiResponseType } from "./ApiResponse"


export default function AsyncHandler(fn: Function) {
    // return function with defautl argument that accepts a function
    return async function (...args: any) {
        try {
            return await fn(...args)
        } catch (error) {
            console.log({ AsyncHandlerError: error })
            let errorResponse = error as ApiResponseType<undefined>
            if (error instanceof Error) errorResponse = ApiResponse(500, error.message || "Something went wrong!")
            return errorResponse
        }
    }
}