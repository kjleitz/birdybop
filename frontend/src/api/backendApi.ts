import BirdybopError from "@/lib/BirdybopError";
import axios, { Axios } from "axios";

const {
  VUE_APP_BACKEND_BASE_URL = "http://localhost:3000",
} = process.env;

class BackendApi {
  public axiosInstance: Axios;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: VUE_APP_BACKEND_BASE_URL,
      withCredentials: true,
    });
  }

  get<ResourceData>(...args: Parameters<Axios["get"]>): Promise<ResourceData> {
    return this.axiosInstance.get<{ data: ResourceData }>(...args)
      .then(({ data: { data } }) => data)
      .catch(BirdybopError.rethrow);
  }

  patch<ResourceData>(...args: Parameters<Axios["patch"]>): Promise<ResourceData> {
    return this.axiosInstance.patch<{ data: ResourceData }>(...args)
      .then(({ data: { data } }) => data)
      .catch(BirdybopError.rethrow);
  }

  post<ResourceData>(...args: Parameters<Axios["post"]>): Promise<ResourceData> {
    return this.axiosInstance.post<{ data: ResourceData }>(...args)
      .then(({ data: { data } }) => data)
      .catch(BirdybopError.rethrow);
  }

  delete<ResourceData = void>(...args: Parameters<Axios["delete"]>): Promise<ResourceData> {
    return this.axiosInstance.delete<{ data: ResourceData }>(...args)
      .then(({ data: { data } }) => data)
      .catch(BirdybopError.rethrow);
  }

  getWithMeta<ResourceData, ResourceMeta extends Record<string, any>>(
    ...args: Parameters<Axios["get"]>
  ): Promise<{ data: ResourceData, meta?: ResourceMeta }> {
    return this.axiosInstance.get<{ data: ResourceData, meta?: ResourceMeta }>(...args)
      .then(({ data }) => data)
      .catch(BirdybopError.rethrow);
  }

  postWithMeta<ResourceData, ResourceMeta extends Record<string, any>>(
    ...args: Parameters<Axios["post"]>
  ): Promise<{ data: ResourceData, meta?: ResourceMeta }> {
    return this.axiosInstance.post<{ data: ResourceData, meta?: ResourceMeta }>(...args)
      .then(({ data }) => data)
      .catch(BirdybopError.rethrow);
  }

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
