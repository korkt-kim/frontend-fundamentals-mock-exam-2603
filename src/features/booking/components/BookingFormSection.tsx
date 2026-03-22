import { css } from '@emotion/react';
import { useFormContext, Controller } from 'react-hook-form';
import { Text, Spacing, Select } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import { getValidDate } from 'utils/date';
import { ALL_EQUIPMENT } from 'utils/equipment';
import { EQUIPMENT_LABELS } from 'shared/consts';
import { TIME_SLOTS } from '../consts';
import { BookingFormValues } from '../types';

export function BookingFormSection({ floors }: { floors: number[] }) {
  const { watch, setValue, control } = useFormContext<BookingFormValues>();
  const equipment = watch('equipment');
  const today = getValidDate(null);

  return (
    <>
      {/* 날짜 */}
      <div css={css`display: flex; flex-direction: column; gap: 6px;`}>
        <Text as="label" typography="t7" fontWeight="medium" color={colors.grey600}>날짜</Text>
        <Controller
          name="date"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              type="date"
              min={today}
              aria-label="날짜"
              css={css`
                box-sizing: border-box; font-size: 16px; font-weight: 500; line-height: 1.5; height: 48px;
                background-color: ${colors.grey50}; border-radius: 12px; color: ${colors.grey800};
                width: 100%; border: 1px solid ${colors.grey200}; padding: 0 16px; outline: none;
                transition: border-color 0.15s; &:focus { border-color: ${colors.blue500}; }
              `}
            />
          )}
        />
      </div>
      <Spacing size={14} />

      {/* 시간 */}
      <div css={css`display: flex; gap: 12px;`}>
        <div css={css`display: flex; flex-direction: column; gap: 6px; flex: 1;`}>
          <Text as="label" typography="t7" fontWeight="medium" color={colors.grey600}>시작 시간</Text>
          <Controller
            name="startTime"
            control={control}
            rules={{ required: '시작 시간을 선택해주세요.' }}
            render={({ field }) => (
              <Select
                aria-label="시작 시간"
                {...field}
              >
                <option value="">선택</option>
                {TIME_SLOTS.slice(0, -1).map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </Select>
            )}
          />
        </div>
        <div css={css`display: flex; flex-direction: column; gap: 6px; flex: 1;`}>
          <Text as="label" typography="t7" fontWeight="medium" color={colors.grey600}>종료 시간</Text>
          <Controller
            name="endTime"
            control={control}
            rules={{
              required: '종료 시간을 선택해주세요.',
              validate: (value) => {
                const start = watch('startTime');
                if (start && value <= start) {
                  return '종료 시간은 시작 시간보다 늦어야 합니다.';
                }
                return true;
              }
            }}
            render={({ field }) => (
              <Select
                aria-label="종료 시간"
                {...field}
              >
                <option value="">선택</option>
                {TIME_SLOTS.slice(1).map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </Select>
            )}
          />
        </div>
      </div>
      <Spacing size={14} />

      {/* 참석 인원 + 선호 층 */}
      <div css={css`display: flex; gap: 12px;`}>
        <div css={css`display: flex; flex-direction: column; gap: 6px; flex: 1;`}>
          <Text as="label" typography="t7" fontWeight="medium" color={colors.grey600}>참석 인원</Text>
          <Controller
            name="attendees"
            control={control}
            rules={{
              min: { value: 1, message: '참석 인원은 1명 이상이어야 합니다.' }
            }}
            render={({ field }) => (
              <input
                {...field}
                type="number"
                min={1}
                aria-label="참석 인원"
                onChange={(e) => field.onChange(Number(e.target.value))}
                css={css`
                  box-sizing: border-box; font-size: 16px; font-weight: 500; line-height: 1.5; height: 48px;
                  background-color: ${colors.grey50}; border-radius: 12px; color: ${colors.grey800};
                  width: 100%; border: 1px solid ${colors.grey200}; padding: 0 16px; outline: none;
                  transition: border-color 0.15s; &:focus { border-color: ${colors.blue500}; }
                `}
              />
            )}
          />
        </div>
        <div css={css`display: flex; flex-direction: column; gap: 6px; flex: 1;`}>
          <Text as="label" typography="t7" fontWeight="medium" color={colors.grey600}>선호 층</Text>
          <Controller
            name="floor"
            control={control}
            render={({ field }) => (
              <Select
                aria-label="선호 층"
                {...field}
              >
                <option value="">전체</option>
                {floors.map((f: number) => (
                  <option key={f} value={String(f)}>{f}층</option>
                ))}
              </Select>
            )}
          />
        </div>
      </div>
      <Spacing size={14} />

      {/* 장비 */}
      <div>
        <Text as="label" typography="t7" fontWeight="medium" color={colors.grey600}>필요 장비</Text>
        <Spacing size={8} />
        <div css={css`display: flex; gap: 8px; flex-wrap: wrap;`}>
          {ALL_EQUIPMENT.map(eq => {
            const selected = equipment.includes(eq);
            return (
              <button
                key={eq}
                type="button"
                onClick={() => {
                  const next = selected ? equipment.filter(e => e !== eq) : [...equipment, eq];
                  setValue('equipment', next);
                }}
                aria-label={EQUIPMENT_LABELS[eq]}
                aria-pressed={selected}
                css={css`
                  padding: 8px 16px; border-radius: 20px;
                  border: 1px solid ${selected ? colors.blue500 : colors.grey200};
                  background: ${selected ? colors.blue50 : colors.grey50};
                  color: ${selected ? colors.blue600 : colors.grey700};
                  font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.15s;
                  &:hover { border-color: ${selected ? colors.blue500 : colors.grey400}; }
                `}
              >
                {EQUIPMENT_LABELS[eq]}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
