import { smartUserService } from "@/services/smartuser";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

export function useGetUserInfinite(search: string) {
  return useInfiniteQuery({
    queryKey: ["users", search],
    initialPageParam: 1,
    refetchOnWindowFocus: false,
    queryFn: async ({ pageParam = 1 }) => {
      return smartUserService.getAllUsers({
        PageNumber: pageParam,
        Username: search,
      });
    },
    getNextPageParam: (lastPage) => {
      // lastPage contains: data, totalCount, pageNumber, pageSize, totalPages
      const { pageNumber, totalPages } = lastPage;
      return pageNumber < totalPages ? pageNumber + 1 : undefined;
    },
  });
}

export function useGetDepartmentsQuery() {
  return useQuery({
    queryKey: ["departments"],
    queryFn: smartUserService.getAllDepartments,
  });
}

export function useGetRolesQuery() {
  return useQuery({
    queryKey: ["roles"],
    queryFn: smartUserService.getAllRoles,
  });
}
