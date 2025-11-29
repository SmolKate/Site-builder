import { vi } from "vitest";

const useForm = vi.fn(() => ({
  register: vi.fn(),
  handleSubmit: vi.fn(),
  formState: { errors: {} },
}));

export default useForm;