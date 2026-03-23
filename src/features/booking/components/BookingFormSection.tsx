import { css } from '@emotion/react';
import { Spacing, Text } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import { DatePicker } from 'shared/components/Form/DatePicker';
import { StartTimePicker } from './StartTimePicker';
import { EndTimePicker } from './EndTimePicker';
import { AttendeesInput } from './AttendeesInput';
import { FloorSelect } from './FloorSelect';
import { EquipmentSelect } from './EquipmentSelect';

export function BookingFormSection() {
  return (
    <>
      {/* 날짜 */}
      <div
        css={css`
          display: flex;
          flex-direction: column;
          gap: 6px;
        `}
      >
        <Text as="label" typography="t7" fontWeight="medium" color={colors.grey600}>
          날짜
        </Text>
        <DatePicker name="date" />
      </div>
      <Spacing size={14} />

      {/* 시간 */}
      <div
        css={css`
          display: flex;
          gap: 12px;
        `}
      >
        <div
          css={css`
            display: flex;
            flex-direction: column;
            gap: 6px;
            flex: 1;
          `}
        >
          <StartTimePicker />
        </div>
        <div
          css={css`
            display: flex;
            flex-direction: column;
            gap: 6px;
            flex: 1;
          `}
        >
          <EndTimePicker />
        </div>
      </div>
      <Spacing size={14} />

      {/* 참석 인원 + 선호 층 */}
      <div
        css={css`
          display: flex;
          gap: 12px;
        `}
      >
        <div
          css={css`
            display: flex;
            flex-direction: column;
            gap: 6px;
            flex: 1;
          `}
        >
          <AttendeesInput />
        </div>
        <div
          css={css`
            display: flex;
            flex-direction: column;
            gap: 6px;
            flex: 1;
          `}
        >
          <FloorSelect />
        </div>
      </div>
      <Spacing size={14} />

      {/* 장비 */}
      <EquipmentSelect />
    </>
  );
}
