import axios, { AxiosError, HttpStatusCode } from "axios";
import { getAuthHeader } from "../utils/Oauth1Helper";
import { BricklinkItemResponse } from "../model/bricklink/BricklinkItemResponse";
import { htmlDecode } from "../utils/StringUtils";
import {Part} from "../model/part/Part";

const corsProxyUrl: string = "https://proxy.cors.sh/";
const baseUrl: string = "https://api.bricklink.com/api/store/v1";

export interface BrickLinkHooks {
  getBricklinkData: (part: Part) => Promise<Part>;
}

export const useBrickLinkService = (): BrickLinkHooks => {

  // create our BrickLink Axios instance
  const brickLinkAxiosInstance = axios.create({
    baseURL: baseUrl,
    timeout: 10000,
    headers: {
      "x-cors-api-key": "live_6aba39ccdee8ed8b73605d0e20a44856036a469b78fd9fdbb2a0399951e920a1"
    }
  });

  const get = async <T, >(url: string): Promise<T> => {
    // build the request and authorization header
    const request = {
      url: url,
      method: "GET"
    };
    const authHeader = getAuthHeader(request);

    // make the request
    return (await brickLinkAxiosInstance.get<T>(
      `${corsProxyUrl}${url}`,
      { headers: authHeader }
    )).data;
  };

  /**
   * Get function that retrieves basic part information
   * @param part the part to search
   */
  const getBricklinkData = async (part: Part): Promise<Part> => {
    try {
      const bricklinkData: BricklinkItemResponse =
        await get<BricklinkItemResponse>(`${baseUrl}/items/PART/${part.id}`);
      const partResponse = bricklinkData.data;
      return {
        ...part,
        name: htmlDecode(partResponse.name)
      } as Part;
    } catch (error: AxiosError | any) {
      if (error.code === AxiosError.ECONNABORTED && error.message.startsWith("timeout")) {
        throw new AxiosError("Error with BrickLink, request timed out!", AxiosError.ECONNABORTED);
      } else if (error.code === AxiosError.ERR_BAD_REQUEST && error.response?.status === 404) {
        throw new AxiosError('Item not found!', HttpStatusCode.NotFound.toString());
      } else {
        throw new AxiosError(`Error with BrickLink: ${error.message}`);
      }
    }
  };

  return { getBricklinkData };
};

