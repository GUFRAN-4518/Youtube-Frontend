import api from "./axios";

export const getAllVideos = (params) => {
  return api.get("/videos", { params });
};

export const getVideoById = (id) => {
  return api.get(`/videos/${id}`);
};

export const searchVideos = (query) => {
  return api.get("/videos", {
    params: { query },
  });
};