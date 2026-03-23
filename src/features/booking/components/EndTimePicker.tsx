import { Controller, useFormContext } from 'react-hook-form';
import { Select, Text } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import { TIME_SLOTS } from '../consts';
import { BookingFormValues } from 'shared/types';

export function EndTimePicker() {
  const { control, watch } = useFormContext<BookingFormValues>();

  return (
    <>
      <Text as="label" typography="t7" fontWeight="medium" color={colors.grey600}>
        종료 시간
      </Text>
      <Controller
        name="endTime"
        control={control}
        rules={{
          required: '종료 시간을 선택해주세요.',
          validate: value => {
            const start = watch('startTime');
            if (start && value <= start) {
              return '종료 시간은 시작 시간보다 늦어야 합니다.';
            }
            return true;
          },
        }}
        render={({ field }) => (
          <Select aria-label="종료 시간" {...field}>
            <option value="">선택</option>
            {TIME_SLOTS.slice(1).map(t => (
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
