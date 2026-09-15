import api from "../axiosInstance";

export const projectGroupService = {
  getPublishedGroups: async (): Promise<any> => {
    const response = await api.get<any>("/project-groups/published");
    return response.data;
  },
  getPublishedGroup: async (id: string): Promise<any> => {
    const response = await api.get<any>(`/project-groups/published/${id}`);
    return response.data;
  },
};
