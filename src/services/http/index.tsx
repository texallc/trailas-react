import { handleError } from "../../utils/functions";
import { getCurrentToken } from "../firebase/auth";

const baseUrl = "https://octopus-app-hn94d.ondigitalocean.app";

const getHeaders = (token: string) => ({
  Accept: 'application/json',
  'Content-Type': 'application/json',
  Authorization: "Bearer " + token
});

export const get = async<T extends {}>(url: string, abortController: AbortController) => {
  try {
    const token = await getCurrentToken();
    const response = await fetch(
      baseUrl + url,
      {
        method: 'GET',
        headers: getHeaders(token),
        signal: abortController.signal
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw handleError(error);
    }

    return response.json() as Promise<T>;
  } catch (error) {
    throw handleError(error);
  }
};

export const post = async<T extends {}>(url: string, body: Record<string, any>, abortController: AbortController) => {
  try {
    const token = await getCurrentToken();
    const response = await fetch(
      baseUrl + url,
      {
        method: 'POST',
        body: JSON.stringify(body),
        headers: getHeaders(token),
        signal: abortController.signal
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw handleError(error);
    }

    return response.json() as Promise<T>;
  } catch (error) {
    throw handleError(error);
  }
};

export const put = async<T extends {}>(url: string, body: Record<string, unknown>, abortController: AbortController) => {
  try {
    const token = await getCurrentToken();
    const response = await fetch(
      baseUrl + url,
      {
        method: 'PUT',
        body: JSON.stringify(body),
        headers: getHeaders(token),
        signal: abortController.signal
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw handleError(error);
    }

    return response.json() as Promise<T>;
  } catch (error) {
    throw handleError(error);
  }
};

export const patch = async<T extends {}>(url: string, body: Record<string, unknown>, abortController: AbortController) => {
  try {
    const token = await getCurrentToken();
    const response = await fetch(
      baseUrl + url,
      {
        method: 'PATCH',
        body: JSON.stringify(body),
        headers: getHeaders(token),
        signal: abortController.signal
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw handleError(error);
    }

    return response.json() as Promise<T>;
  } catch (error) {
    throw handleError(error);
  }
};
