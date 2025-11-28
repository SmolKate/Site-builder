import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import type { ReactNode } from 'react';
import userEvent from '@testing-library/user-event';
import { render } from '@testing-library/react';
import { UniversalPopup } from '../UniversalPopup';

jest.mock('react-dom', () => {
  const actual = jest.requireActual<typeof import('react-dom')>('react-dom');

  return {
    ...actual,
    createPortal: (node: ReactNode) => node,
  };
});

const baseProps = {
  isOpen: true,
  title: 'Тестовый попап',
  onClose: jest.fn(),
};

describe('UniversalPopup', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('рендерит заголовок и текст', () => {
    const { getByRole, getByText } = render(
      <UniversalPopup {...baseProps} bodyText="Привет!" />
    );

    expect(getByRole('dialog')).toBeInstanceOf(HTMLElement);
    expect(getByText('Тестовый попап')).toBeInstanceOf(HTMLElement);
    expect(getByText('Привет!')).toBeInstanceOf(HTMLElement);
  });

  it('закрывается при клике по оверлею, если это разрешено', () => {
    const onClose = jest.fn();
    const { container } = render(
      <UniversalPopup {...baseProps} onClose={onClose} closeOnOverlay />
    );

    const overlay = container.querySelector(
      '.ui-popup__overlay'
    ) as HTMLElement | null;
    expect(overlay).not.toBeNull();
    overlay?.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('не закрывается при клике по контенту', () => {
    const onClose = jest.fn();
    const { container } = render(
      <UniversalPopup {...baseProps} onClose={onClose} closeOnOverlay>
        <div data-testid="content">Контент</div>
      </UniversalPopup>
    );

    const panel = container.querySelector('.ui-popup__panel') as HTMLElement;
    panel.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

    expect(onClose).not.toHaveBeenCalled();
  });

  it('реагирует на Escape, если разрешено', () => {
    const onClose = jest.fn();
    render(<UniversalPopup {...baseProps} onClose={onClose} closeOnEsc />);

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('игнорирует Escape, если closeOnEsc=false', () => {
    const onClose = jest.fn();
    render(
      <UniversalPopup {...baseProps} onClose={onClose} closeOnEsc={false} />
    );

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

    expect(onClose).not.toHaveBeenCalled();
  });

  it('рендерит экшн-кнопки и вызывает их обработчики', async () => {
    const primaryHandler = jest.fn();
    const secondaryHandler = jest.fn();

    const { getByText } = render(
      <UniversalPopup
        {...baseProps}
        primaryButton={{ label: 'Ок', onClick: primaryHandler }}
        secondaryButton={{ label: 'Отмена', onClick: secondaryHandler }}
      />
    );

    const user = userEvent.setup();
    await user.click(getByText('Ок'));
    await user.click(getByText('Отмена'));

    expect(primaryHandler).toHaveBeenCalledTimes(1);
    expect(secondaryHandler).toHaveBeenCalledTimes(1);
  });
});
