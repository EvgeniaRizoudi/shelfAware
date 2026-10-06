import axios from "axios";
import config from "../config/config";
import i18n from "./i18n";

export const api = axios.create({
    baseURL: config.apiBaseUrl,
    withCredentials: true,
    headers: { Accept: "application/json" },
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (axios.isAxiosError(error)) {
            const status = error.response?.status;

            if (status === undefined) {
                console.warn(i18n.t("errors.network"));
            } else if (status === 401) {
                // TODO APO-8: log the user out and redirect to /login
                console.warn(i18n.t("errors.unauthorized"));
            } else if (status === 403) {
                console.warn(i18n.t("errors.forbidden"));
            } else if (status === 404) {
                console.warn(i18n.t("errors.notFound"));
            } else if (status === 422) {
                // Field errors are shown by the form that sent the request
                console.warn(i18n.t("errors.validation"));
            } else if (status === 429) {
                console.warn(i18n.t("errors.tooManyRequests"));
            } else if (status >= 500) {
                console.warn(i18n.t("errors.server"));
            }
        }

        return Promise.reject(error);
    },
);
