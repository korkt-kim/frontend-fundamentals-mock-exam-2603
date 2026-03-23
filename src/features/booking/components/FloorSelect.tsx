import { Suspense } from 'react';
import { css } from '@emotion/react';
import { Controller, useFormContext } from 'react-hook-form';
import { Select, Text } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import { useRooms } from 'queries/rooms';
import { BookingFormValues } from 'shared/types';

function FloorSelectFallback() {
  return (
    <>
      <Text as="label" typography="t7" fontWeight="medium" color={colors.grey600}>
        선호 층
      </Text>
      <select
        disabled
        aria-label="선호 층"
        css={css`
          box-sizing: border-box;
          height: 48px;
          background-color: ${colors.grey50};
          border-radius: 12px;
          border: 1px solid ${colors.grey200};
          width: 100%;
          padding: 0 16px;
          color: ${colors.grey400};
          font-size: 16px;
        `}
      >
        <option>불러오는 중...</option>
      </select>
    </>
  );
}

function FloorSelectInner() {
  const { rooms } = useRooms();
  const floors = [...new Set(rooms.map(r => r.floor))].sort((a: number, b: number) => a - b);
  const { control } = useFormContext<BookingFormValues>();

  return (
    <>
      <Text as="label" typography="t7" fontWeight="medium" color={colors.grey600}>
        선호 층
      </Text>
      <Controller
        name="floor"
        control={control}
        render={({ field }) => (
          <Select aria-label="선호 층" {...field}>
            <option value="">전체</option>
            {floors.map((f: number) => (
              <option key={f} value={String(f)}>
                {f}층
              </option>
            ))}
          </Select>
        )}
      />
    </>
  );
}

export function FloorSelect() {
  return (
    <Suspense fallback={<FloorSelectFallback />}>
      <FloorSelectInner />
    </Suspense>
  );
}
