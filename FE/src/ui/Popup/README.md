# UniversalPopup — пример использования

```tsx
import { useState } from "react";
import { UniversalPopup } from "@/ui";

export const PopupDemo = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Открыть попап</button>

      <UniversalPopup
        isOpen={isOpen}
        title="Удалить сайт?"
        bodyText="Действие нельзя отменить. Продолжить?"
        onClose={() => setIsOpen(false)}
        primaryButton={{
          label: "Удалить",
          variant: "danger",
          onClick: () => {
            // ...ваш код
            setIsOpen(false);
          },
        }}
        secondaryButton={{
          label: "Отмена",
          variant: "secondary",
          onClick: () => setIsOpen(false),
        }}
      />
    </>
  );
};
```

