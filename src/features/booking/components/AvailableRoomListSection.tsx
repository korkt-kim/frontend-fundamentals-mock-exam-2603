import { css } from '@emotion/react';
import { Text, Spacing, ListRow } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import { EQUIPMENT_LABELS } from 'shared/consts';
import { useAvailableRooms } from '../hooks/useAvailableRooms';

interface Props {
  selectedRoomId: string | null;
  onSelect: (roomId: string) => void;
}

export function AvailableRoomListSection({ selectedRoomId, onSelect }: Props) {
  const { availableRooms, isFilterComplete } = useAvailableRooms();

  if (!isFilterComplete) return null;

  return (
    <div css={css`padding: 0 24px;`}>
      <div css={css`display: flex; align-items: baseline; gap: 6px;`}>
        <Text typography="t5" fontWeight="bold" color={colors.grey900}>
          예약 가능 회의실
        </Text>
        <Text typography="t7" fontWeight="medium" color={colors.grey500}>
          {availableRooms.length}개
        </Text>
      </div>
      <Spacing size={16} />

      {availableRooms.length === 0 ? (
        <div css={css`padding: 40px 0; text-align: center; background: ${colors.grey50}; border-radius: 14px;`}>
          <Text typography="t6" color={colors.grey500}>
            조건에 맞는 회의실이 없습니다.
          </Text>
        </div>
      ) : (
        <div css={css`display: flex; flex-direction: column; gap: 10px;`}>
          {availableRooms.map((room) => {
            const isSelected = selectedRoomId === room.id;
            return (
              <div
                key={room.id}
                onClick={() => onSelect(room.id)}
                role="button"
                aria-pressed={isSelected}
                aria-label={room.name}
                css={css`
                  cursor: pointer; padding: 14px 16px; border-radius: 14px;
                  border: 2px solid ${isSelected ? colors.blue500 : colors.grey200};
                  background: ${isSelected ? colors.blue50 : colors.white};
                  transition: all 0.15s;
                  &:hover { border-color: ${isSelected ? colors.blue500 : colors.grey300}; }
                `}
              >
                <ListRow
                  contents={
                    <ListRow.Text2Rows
                      top={room.name}
                      topProps={{ typography: 't6', fontWeight: 'bold', color: colors.grey900 }}
                      bottom={`${room.floor}층 · ${room.capacity}명 · ${room.equipment.map(e => EQUIPMENT_LABELS[e]).join(', ')}`}
                      bottomProps={{ typography: 't7', color: colors.grey600 }}
                    />
                  }
                  right={
                    isSelected ? (
                      <Text typography="t7" fontWeight="bold" color={colors.blue500}>선택됨</Text>
                    ) : undefined
                  }
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
