import {useAxios} from "@/renderer/composables/axios";
import {Metadata, Profile} from "@/types";

interface ProfileResponse extends Profile {
    description: string
}

type UploadRequest = Metadata

interface UploadResponse {
    status: string
}

export interface UseSendcryptAPI {
    queryProjects(): Promise<Array<ProfileResponse>>
    storeUpload(url: string, params: UploadRequest): Promise<UploadResponse>
}

export function useSendcryptAPI(): UseSendcryptAPI {
    const {get, post} = useAxios()

    const queryProjects = async () => {
        return get<Array<ProfileResponse>>('/projects').then((response) => {
            return Promise.resolve(response.data)
        })
    }

    const storeUpload = async (url: string, body: UploadRequest) => {
        return post<UploadRequest, UploadResponse>(url, body).then((response) => {
            return Promise.resolve(response.data)
        })
    }

    return {
        queryProjects,
        storeUpload
    }
}
