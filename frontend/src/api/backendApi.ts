import BirdybopError from "@/lib/BirdybopError";
import type JsonApi from "@/types/JsonApi";
import axios, { Axios } from "axios";

const {
  VITE_BACKEND_BASE_URL = "http://localhost:3000",
} = import.meta.env;

class BackendApi {
  public axiosInstance: Axios;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: VITE_BACKEND_BASE_URL as string,
      withCredentials: true,
    });
  }

  get<R extends JsonApi.SuccessResponse>(...args: Parameters<Axios["get"]>): Promise<R> {
    return this.axiosInstance.get<R>(...args)
      .then(({ data }) => data)
      .catch(BirdybopError.rethrow);
  }

  patch<R extends JsonApi.SuccessResponse>(...args: Parameters<Axios["patch"]>): Promise<R> {
    return this.axiosInstance.patch<R>(...args)
      .then(({ data }) => data)
      .catch(BirdybopError.rethrow);
  }

  post<R extends JsonApi.SuccessResponse>(...args: Parameters<Axios["post"]>): Promise<R> {
    return this.axiosInstance.post<R>(...args)
      .then(({ data }) => data)
      .catch(BirdybopError.rethrow);
  }

  // delete<R extends JsonApi.SuccessResponse>(...args: Parameters<Axios["delete"]>): Promise<R> {
  //   return this.axiosInstance.delete<R>(...args)
  //     .then(({ data }) => data)
  //     .catch(BirdybopError.rethrow);
  // }

  delete(...args: Parameters<Axios["delete"]>): Promise<void> {
    return this.axiosInstance.delete(...args)
      .then(({ data }) => data)
      .catch(BirdybopError.rethrow);
  }

  // get<ResourceData>(...args: Parameters<Axios["get"]>): Promise<ResourceData> {
  //   return this.axiosInstance.get<{ data: ResourceData }>(...args)
  //     .then(({ data: { data } }) => data)
  //     .catch(BirdybopError.rethrow);
  // }

  // patch<ResourceData>(...args: Parameters<Axios["patch"]>): Promise<ResourceData> {
  //   return this.axiosInstance.patch<{ data: ResourceData }>(...args)
  //     .then(({ data: { data } }) => data)
  //     .catch(BirdybopError.rethrow);
  // }

  // post<ResourceData>(...args: Parameters<Axios["post"]>): Promise<ResourceData> {
  //   return this.axiosInstance.post<{ data: ResourceData }>(...args)
  //     .then(({ data: { data } }) => data)
  //     .catch(BirdybopError.rethrow);
  // }

  // delete<ResourceData = void>(...args: Parameters<Axios["delete"]>): Promise<ResourceData> {
  //   return this.axiosInstance.delete<{ data: ResourceData }>(...args)
  //     .then(({ data: { data } }) => data)
  //     .catch(BirdybopError.rethrow);
  // }

  // getWithMeta<ResourceData, ResourceMeta extends Record<string, any>>(
  //   ...args: Parameters<Axios["get"]>
  // ): Promise<{ data: ResourceData, meta?: ResourceMeta }> {
  //   return this.axiosInstance.get<{ data: ResourceData, meta?: ResourceMeta }>(...args)
  //     .then(({ data }) => data)
  //     .catch(BirdybopError.rethrow);
  // }

  // postWithMeta<ResourceData, ResourceMeta extends Record<string, any>>(
  //   ...args: Parameters<Axios["post"]>
  // ): Promise<{ data: ResourceData, meta?: ResourceMeta }> {
  //   return this.axiosInstance.post<{ data: ResourceData, meta?: ResourceMeta }>(...args)
  //     .then(({ data }) => data)
  //     .catch(BirdybopError.rethrow);
  // }

  setDefaultHeader(name: string, value: string): void {
    this.axiosInstance.defaults.headers.get[name] = value;
    this.axiosInstance.defaults.headers.post[name] = value;
    this.axiosInstance.defaults.headers.patch[name] = value;
    this.axiosInstance.defaults.headers.put[name] = value;
    this.axiosInstance.defaults.headers.delete[name] = value;
  }

  clearDefaultHeader(name: string): void {
    delete this.axiosInstance.defaults.headers.get[name];
    delete this.axiosInstance.defaults.headers.post[name];
    delete this.axiosInstance.defaults.headers.patch[name];
    delete this.axiosInstance.defaults.headers.put[name];
    delete this.axiosInstance.defaults.headers.delete[name];
  }

  useAccessToken(accessToken: string): void {
    this.setDefaultHeader("Authorization", `Bearer ${accessToken}`);
  }

  clearAccessToken(): void {
    this.clearDefaultHeader("Authorization");
  }
}

const backendApi = new BackendApi();

export default backendApi;
