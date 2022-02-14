import { useState } from "react";

interface MutationState {
  loading: boolean;
  error: Error | null;
}

export function useMutation<T>(action: () => Promise<T>) {
  const [state, setState] = useState<MutationState>({
    loading: false,
    error: null
  });

  function unsetError() {
    setState({ loading: state.loading, error: null });
  }

  async function submit() {
    try {
      setState({ loading: true, error: null });
      await action();
      setState({ loading: false, error: null });
    } catch (error) {
      if (error instanceof Error) {
        setState({ loading: false, error });
      }
    }
  }

  return { submit, unsetError, ...state };
}
