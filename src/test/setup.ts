// src/test/setup.mjs
import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

// TypeError: window.matchMedia is not a function
// This error occurs because testing environments like Jest or Vitest use jsdom (or happy-dom) to simulate a browser,
// but jsdom does not implement the window.matchMedia API by default.
// When your code or a third-party library (like Ant Design or Material-UI) calls window.matchMedia(),
// the test runner throws a TypeError because the function is undefined.
vi.hoisted(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});
