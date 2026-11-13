import { StrictMode } from 'react';
import { renderHook } from '@testing-library/react';
import { useUpdateEffect } from './useUpdateEffect';

describe('useUpdateEffect', () => {
  test('does not run on mount', () => {
    const effect = jest.fn();
    renderHook(({ dep }) => useUpdateEffect(effect, [dep]), { initialProps: { dep: 1 } });

    expect(effect).not.toHaveBeenCalled();
  });

  test('runs when a dependency changes', () => {
    const effect = jest.fn();
    const { rerender } = renderHook(({ dep }) => useUpdateEffect(effect, [dep]), {
      initialProps: { dep: 1 },
    });

    rerender({ dep: 2 });
    expect(effect).toHaveBeenCalledTimes(1);

    rerender({ dep: 3 });
    expect(effect).toHaveBeenCalledTimes(2);
  });

  test('does not run when the dependencies are unchanged', () => {
    const effect = jest.fn();
    const { rerender } = renderHook(({ dep }) => useUpdateEffect(effect, [dep]), {
      initialProps: { dep: 1 },
    });

    rerender({ dep: 1 });
    rerender({ dep: 1 });
    expect(effect).not.toHaveBeenCalled();
  });

  test('runs the cleanup returned by the effect before the next run', () => {
    const cleanup = jest.fn();
    const effect = jest.fn(() => cleanup);
    const { rerender, unmount } = renderHook(({ dep }) => useUpdateEffect(effect, [dep]), {
      initialProps: { dep: 1 },
    });

    rerender({ dep: 2 });
    expect(cleanup).not.toHaveBeenCalled();

    rerender({ dep: 3 });
    expect(cleanup).toHaveBeenCalledTimes(1);

    unmount();
    expect(cleanup).toHaveBeenCalledTimes(2);
  });

  test('skips the mount run again after a remount', () => {
    const effect = jest.fn();
    const { unmount } = renderHook(({ dep }) => useUpdateEffect(effect, [dep]), {
      initialProps: { dep: 1 },
    });
    unmount();

    renderHook(({ dep }) => useUpdateEffect(effect, [dep]), { initialProps: { dep: 1 } });
    expect(effect).not.toHaveBeenCalled();
  });

  // 마운트 이펙트의 cleanup 에서 ref 를 되돌리는 이유가 이것이다. usehooks-ts 가 제거한 구현은
  // 첫 렌더에서 ref 를 뒤집어서, StrictMode 의 이중 마운트에서 마운트 실행을 걸러내지 못했다.
  test('still skips the mount run under StrictMode', () => {
    const effect = jest.fn();
    const { rerender } = renderHook(({ dep }) => useUpdateEffect(effect, [dep]), {
      initialProps: { dep: 1 },
      wrapper: StrictMode,
    });

    expect(effect).not.toHaveBeenCalled();

    rerender({ dep: 2 });
    expect(effect).toHaveBeenCalledTimes(1);
  });
});
