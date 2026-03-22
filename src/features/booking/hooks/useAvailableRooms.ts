import { useFormContext } from 'react-hook-form';
import { useRooms } from 'queries/rooms';
import { useReservations } from 'queries/reservation';
import { BookingFormValues } from 'shared/types';

export function useAvailableRooms() {
  const { watch, formState: { errors } } = useFormContext<BookingFormValues>();
  const formValues = watch();
  const { roomId, date, startTime, endTime, attendees, equipment, floor: preferredFloor } = formValues;

  const { rooms } = useRooms();
  const { reservations } = useReservations(date);

  // react-hook-form의 errors 객체에서 첫 번째 에러 메시지를 추출
  const validationError = 
    errors.startTime?.message || 
    errors.endTime?.message || 
    errors.attendees?.message || 
    null;

  const hasTimeInputs = startTime !== '' && endTime !== '';
  // 에러가 없고 필수 입력값이 있을 때 필터가 완료된 것으로 간주
  const isFilterComplete = hasTimeInputs && !validationError;

  // 필터링
  const availableRooms = isFilterComplete
    ? rooms
        .filter((room) => {
          if (room.capacity < attendees) return false;
          if (!equipment.every(eq => room.equipment.includes(eq))) return false;
          if (preferredFloor !== '' && room.floor !== Number(preferredFloor)) return false;
          
          const hasConflict = reservations.some(
            (r) =>
              r.roomId === room.id && r.date === date && r.start < endTime && r.end > startTime
          );
          
          if (hasConflict) return false;
          return true;
        })
        .sort((a, b) => {
          if (a.floor !== b.floor) return a.floor - b.floor;
          return a.name.localeCompare(b.name);
        })
    : [];

  return {
    availableRooms,
    isFilterComplete,
    validationError,
    formValues,
  };
}
