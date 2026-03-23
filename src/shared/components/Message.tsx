import { ComponentProps } from 'react';
import { css, Interpolation, Theme } from '@emotion/react';
import { Text } from '_tosslib/components';

interface Props extends Omit<ComponentProps<'div'>, 'children'> {
  /** 표시할 메시지 텍스트 */
  message: string;
  /** 텍스트 색상 직접 지정 */
  messageColor?: string;
  /** 내부 박스에 적용할 스타일 (배경색, 테두리 등) */
  innerCss?: Interpolation<Theme>;
}

export function Message({ message, messageColor, innerCss, ...props }: Props) {
  // props에서 css를 별도로 추출하여 내부 스타일과 합성합니다. (덮어쓰기 방지)
  const { css: customCss, ...rest } = props;

  return (
    <div
      css={[
        // 기본 좌우 패딩만 유지하고 수직 여백은 0으로 설정
        css`
          padding: 0 24px;
        `,
        customCss, // 호출부에서 padding-top, padding-bottom 등을 자유롭게 결정
      ]}
      {...rest}
    >
      <div
        css={[
          css`
            padding: 10px 14px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            gap: 8px;
          `,
          innerCss, // 배경색 등 호출부에서 정의한 스타일 적용
        ]}
      >
        <Text typography="t7" fontWeight="medium" color={messageColor}>
          {message}
        </Text>
      </div>
    </div>
  );
}
