# Message 컴포넌트 추상화 계획

반복적으로 사용되는 성공/에러 메시지 박스 패턴을 `src/shared/components/Message.tsx`로 공통 컴포넌트화합니다.

## 1. 컴포넌트 구조 (Props 설계)

기본 HTML 속성을 확장하며, 호출부에서 스타일을 완전히 제어할 수 있도록 설계합니다.

```tsx
import { ComponentProps } from 'react';
import { Interpolation, Theme } from '@emotion/react';

interface Props extends Omit<ComponentProps<'div'>, 'children'> {
  /** 표시할 메시지 텍스트 */
  message: string;
  /** 텍스트 색상 직접 지정 */
  messageColor?: string;
  /** 내부 박스에 적용할 스타일 (배경색, 테두리 등) */
  innerCss?: Interpolation<Theme>;
}
```

## 2. 구현 코드 제안

기본 수직 여백(`padding-top`, `padding-bottom`)은 **0**으로 설정하여 스타일 간섭을 최소화하고, 외부 `css` 프롭을 통해 여백을 결정하도록 구현합니다.

```tsx
import { ComponentProps } from 'react';
import { css, Interpolation, Theme } from '@emotion/react';
import { Text } from '_tosslib/components';

interface Props extends Omit<ComponentProps<'div'>, 'children'> {
  message: string;
  messageColor?: string;
  innerCss?: Interpolation<Theme>;
}

export function Message({ message, messageColor, innerCss, ...props }: Props) {
  const { css: customCss, ...rest } = props;

  return (
    <div 
      css={[
        // 기본 좌우 패딩만 유지하고 수직 여백은 0으로 설정
        css`padding: 0 24px;`, 
        customCss // 호출부에서 padding-top, padding-bottom 등을 자유롭게 결정
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
          innerCss
        ]}
      >
        <Text typography="t7" fontWeight="medium" color={messageColor}>
          {message}
        </Text>
      </div>
    </div>
  );
}
```

## 3. 적용 예시 (Refactoring)

### 사례 1: RoomBookingContent.tsx
원본 레이아웃에 맞춰 수직 여백을 직접 지정합니다.

```tsx
{errorMessage && (
  <Message 
    message={errorMessage} 
    messageColor={colors.red500} 
    innerCss={css`background: ${colors.red50};`}
    css={css`padding-top: 12px;`} 
  />
)}
```

### 사례 2: ReservationStatusPage/index.tsx
해당 페이지의 디자인 요구사항에 맞춰 하단 여백만 지정합니다.

```tsx
{message && (
  <Message 
    message={message.text}
    messageColor={message.type === 'success' ? colors.blue600 : colors.red500}
    innerCss={css`background: ${message.type === 'success' ? colors.blue50 : colors.red50};`}
    css={css`padding-bottom: 12px;`} 
  />
)}
```

---
**📚 References (공식 문서 출처):**
- [Emotion - CSS Prop Merging](https://emotion.sh/docs/css-prop): 기본 여백(0)을 호출부에서 넘긴 값으로 효과적으로 덮어쓰기 위해 참고함
- [Component Design - Principle of Least Surprise](https://en.wikipedia.org/wiki/Principle_of_least_astonishment): 컴포넌트가 예상치 못한 여백을 가지지 않도록 설계하기 위해 참고함
