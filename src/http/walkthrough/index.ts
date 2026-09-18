import api from "../axiosInstance";

export type Walkthrough = {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnail: string;
  isActive?: boolean;
  sortOrder?: number;
  createdAt?: string;
  updatedAt?: string;
};

export const walkthroughService = {
  getPublishedWalkthroughs: async (): Promise<Walkthrough[]> => {
    const response = await api.get("/walkthrough/published");

    return response.data?.data || [];
  },

  getPublishedWalkthroughById: async (
    id: string
  ): Promise<Walkthrough | null> => {
    try {
      const response = await api.get(`/walkthrough/${id}`);

      return response.data?.data || null;
    } catch {
      return null;
    }
  },
};
