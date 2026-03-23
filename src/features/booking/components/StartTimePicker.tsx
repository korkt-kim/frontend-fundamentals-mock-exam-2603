import { Controller, useFormContext } from 'react-hook-form';
import { Select, Text } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import { TIME_SLOTS } from '../consts';
import { BookingFormValues } from 'shared/types';

export function StartTimePicker() {
  const { control } = useFormContext<BookingFormValues>();

  return (
    <>
      <Text as="label" typography="t7" fontWeight="medium" color={colors.grey600}>
        시작 시간
      </Text>
      <Controller
        name="startTime"
        control={control}
        rules={{ required: '시작 시간을 선택해주세요.' }}
        render={({ field }) => (
          <Select aria-label="시작 시간" {...field}>
            <option value="">선택</option>
            {TIME_SLOTS.slice(0, -1).map(t => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Select>
        )}
      />
    </>
  );
}
