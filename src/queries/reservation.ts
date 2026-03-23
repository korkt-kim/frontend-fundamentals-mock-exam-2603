import { useSuspenseQuery } from '@tanstack/react-query';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getReservations, getMyReservations, cancelReservation as cancelReservationRemote } from 'pages/remotes';

export const reservationQueries = {
  all: () => ['reservations'] as const,
  list: (date: string) => ({
    queryKey: [...reservationQueries.all(), date] as const,
    queryFn: () => (date ? getReservations(date) : Promise.resolve([])),
  }),
  my: () => ({
    queryKey: ['myReservations'] as const,
    queryFn: getMyReservations,
  }),
};

export function useReservations(date:string) {
  const { data: reservations } = useSuspenseQuery(reservationQueries.list(date));
  
  return { reservations };
}

export function useMyReservations() {
  const queryClient = useQueryClient();
  const { data: myReservations } = useSuspenseQuery(reservationQueries.my());

  const cancelMutation = useMutation((id: string) => cancelReservationRemote(id), {
    onSuccess: () => {
      queryClient.invalidateQueries(reservationQueries.all());
      queryClient.invalidateQueries(reservationQueries.my().queryKey);
    },
  });

  return {
    myReservations,
    cancelReservation: cancelMutation.mutateAsync,
  };
}
