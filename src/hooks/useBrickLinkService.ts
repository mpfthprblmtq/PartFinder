import axios, { AxiosError, HttpStatusCode } from "axios";
import { getAuthHeader } from "../utils/Oauth1Helper";
import { BricklinkItemResponse } from "../model/item/BricklinkItemResponse";
import { Item } from "../model/item/Item";
import { Type } from "../model/_shared/Type";
import { htmlDecode } from "../utils/StringUtils";

const corsProxyUrl: string = "https://proxy.cors.sh/";
const baseUrl: string = "https://api.bricklink.com/api/store/v1";

export interface BrickLinkHooks {
  getBricklinkData: (id: string, type: Type) => Promise<Item>;
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
   * Get function that retrieves basic set information (name, year released, etc)
   * @param id the id of the set
   * @param type the type of item to get
   */
  const getBricklinkData = async (id: string, type: Type): Promise<Item> => {
    // append a '-1' onto the end of the id, since that's how BrickLink stores their data
    if (type === Type.SET && !id.match(".*-\\d+")) {
      id += "-1";
    }

    try {
      const bricklinkData: BricklinkItemResponse =
        await get<BricklinkItemResponse>(`${baseUrl}/items/${type}/${id}`);
      const item = bricklinkData.data;
      return {
        setId: item.no,
        name: htmlDecode(item.name),
        type: item.type,
        imageUrl: item.image_url,
        thumbnailUrl: item.thumbnail_url,
        yearReleased: item.year_released,
      } as Item;
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

