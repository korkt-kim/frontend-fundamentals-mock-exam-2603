import { useSuspenseQuery } from '@tanstack/react-query';
import { getRooms } from 'pages/remotes';

export const roomsQueries = {
  all: () => ({
    queryKey: ['rooms'] as const,
    queryFn: getRooms,
  }),
};

export function useRooms() {
  const { data: rooms } = useSuspenseQuery(roomsQueries.all());
  return { rooms };
}
