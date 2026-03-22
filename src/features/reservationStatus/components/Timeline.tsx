import { css } from '@emotion/react';
import { Text } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import { Room, Reservation } from '_tosslib/server/types';
import { HOUR_LABELS, timeToMinutes, TOTAL_MINUTES } from '../consts';

interface TimelineProps {
  rooms: Room[];
  reservations: Reservation[];
  renderRoomTimeline: (room: Room, roomReservations: Reservation[]) => React.ReactNode;
}

export function Timeline({ rooms, reservations, renderRoomTimeline }: TimelineProps) {
  return (
    <div css={css`background: ${colors.grey50}; border-radius: 14px; padding: 16px;`}>
      {/* 시간 헤더 */}
      <div css={css`display: flex; align-items: flex-end; margin-bottom: 8px;`}>
        <div css={css`width: 80px; flex-shrink: 0; padding-right: 8px;`} />
        <div css={css`flex: 1; position: relative; height: 18px;`}>
          {HOUR_LABELS.map(t => {
            const left = (timeToMinutes(t) / TOTAL_MINUTES) * 100;
            return (
              <Text
                key={t}
                typography="t7"
                fontWeight="regular"
                color={colors.grey400}
                css={css`
                  position: absolute; left: ${left}%; transform: translateX(-50%);
                  font-size: 10px; letter-spacing: -0.3px;
                `}
              >
                {t.slice(0, 2)}
              </Text>
            );
          })}
        </div>
      </div>

      {/* 회의실별 타임라인 */}
      {rooms.map((room, index) => {
        const roomReservations = reservations.filter(r => r.roomId === room.id);
        return (
          <div
            key={room.id}
            css={css`display: flex; align-items: center; height: 32px; ${index > 0 ? 'margin-top: 4px;' : ''}`}
          >
            <div css={css`width: 80px; flex-shrink: 0; padding-right: 8px;`}>
              <Text typography="t7" fontWeight="medium" color={colors.grey700} ellipsisAfterLines={1}
                css={css`font-size: 12px;`}
              >
                {room.name}
              </Text>
            </div>
            {renderRoomTimeline(room, roomReservations)}
          </div>
        );
      })}
    </div>
  );
}
