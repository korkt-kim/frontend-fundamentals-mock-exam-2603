import { css } from '@emotion/react';
import { Controller, useFormContext } from 'react-hook-form';
import { Text } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import { BookingFormValues } from 'shared/types';

export function AttendeesInput() {
  const { control } = useFormContext<BookingFormValues>();

  return (
    <>
      <Text as="label" typography="t7" fontWeight="medium" color={colors.grey600}>
        참석 인원
      </Text>
      <Controller
        name="attendees"
        control={control}
        rules={{
          min: { value: 1, message: '참석 인원은 1명 이상이어야 합니다.' },
        }}
        render={({ field }) => (
          <input
            {...field}
            type="number"
            min={1}
            aria-label="참석 인원"
            onChange={e => field.onChange(Number(e.target.value))}
            css={css`
              box-sizing: border-box;
              font-size: 16px;
              font-weight: 500;
              line-height: 1.5;
              height: 48px;
              background-color: ${colors.grey50};
              border-radius: 12px;
              color: ${colors.grey800};
              width: 100%;
              border: 1px solid ${colors.grey200};
              padding: 0 16px;
              outline: none;
              transition: border-color 0.15s;
              &:focus {
                border-color: ${colors.blue500};
              }
            `}
          />
        )}
      />
    </>
  );
}
