import BirdybopError from "@/lib/BirdybopError";
import axios, { Axios } from "axios";

const {
  SEARCHER_BASE_URL = "http://localhost:8000",
} = process.env;

class SearcherApi {
  public axiosInstance: Axios;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: SEARCHER_BASE_URL,
    });
  }

  get<ResponseDocument>(...args: Parameters<Axios["get"]>): Promise<ResponseDocument> {
    return this.axiosInstance.get<ResponseDocument>(...args)
      .then(({ data }) => data)
      .catch(BirdybopError.rethrow);
  }

  post<ResponseDocument>(...args: Parameters<Axios["post"]>): Promise<ResponseDocument> {
    return this.axiosInstance.post<ResponseDocument>(...args)
      .then(({ data }) => data)
      .catch(BirdybopError.rethrow);
  }
}

const searcherApi = new SearcherApi();

export default searcherApi;
