import { css } from '@emotion/react';
import { useState } from 'react';
import { Text, Spacing } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import { useRooms } from 'queries/rooms';
import { useReservations } from 'queries/reservation';
import { EQUIPMENT_LABELS } from 'shared/consts';
import { timeToMinutes, TOTAL_MINUTES } from '../consts';
import { Timeline } from './Timeline';
import { useFormContext } from 'react-hook-form';
import { BookingFormValues } from 'shared/types';


export function TimelineSection() {
    const { watch } = useFormContext<BookingFormValues>();
  const { rooms } = useRooms();
  const { reservations } = useReservations(watch('date'));
  const [activeReservation, setActiveReservation] = useState<string | null>(null);

  return (
    <div css={css`padding: 0 24px;`}>
      <Text typography="t5" fontWeight="bold" color={colors.grey900}>
        예약 현황
      </Text>
      <Spacing size={16} />
      
      <Timeline
        rooms={rooms}
        reservations={reservations}
        renderRoomTimeline={(room, roomReservations) => (
          <div css={css`flex: 1; height: 24px; background: ${colors.white}; border-radius: 6px; position: relative; overflow: visible;`}>
            {roomReservations.map(res => {
              const left = (timeToMinutes(res.start) / TOTAL_MINUTES) * 100;
              const width = ((timeToMinutes(res.end) - timeToMinutes(res.start)) / TOTAL_MINUTES) * 100;
              const isActive = activeReservation === res.id;
              return (
                <div key={res.id} css={css`position: absolute; left: ${left}%; width: ${width}%; height: 100%;`}>
                  <div
                    role="button"
                    aria-label={`${room.name} ${res.start}-${res.end} 예약 상세`}
                    onClick={() => setActiveReservation(isActive ? null : res.id)}
                    css={css`
                      width: 100%; height: 100%; background: ${colors.blue400}; border-radius: 4px;
                      opacity: ${isActive ? 1 : 0.75}; cursor: pointer; transition: opacity 0.15s;
                      &:hover { opacity: 1; }
                    `}
                  />
                  {isActive && (
                    <div
                      role="tooltip"
                      css={css`
                        position: absolute; top: 100%; left: 50%; transform: translateX(-50%); margin-top: 6px;
                        background: ${colors.grey900}; color: ${colors.white}; padding: 8px 12px;
                        border-radius: 8px; font-size: 12px; white-space: nowrap; z-index: 10;
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12); line-height: 1.6;
                      `}
                    >
                      <div>{res.start} ~ {res.end}</div>
                      <div>{res.attendees}명</div>
                      {res.equipment.length > 0 && (
                        <div>{res.equipment.map(e => EQUIPMENT_LABELS[e]).join(', ')}</div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      />
    </div>
  );
}
