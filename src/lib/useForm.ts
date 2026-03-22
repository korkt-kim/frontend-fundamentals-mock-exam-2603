import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useForm as useRHFForm, UseFormProps, UseFormReturn, FieldValues } from 'react-hook-form';

export interface UseFormWithSyncProps<TFieldValues extends FieldValues = FieldValues, TContext = any> extends UseFormProps<TFieldValues, TContext> {
  searchParamSync?: boolean;
}

export function useForm<TFieldValues extends FieldValues = FieldValues, TContext = any>(
  props: UseFormWithSyncProps<TFieldValues, TContext> = {}
): UseFormReturn<TFieldValues, TContext> {
  const { searchParamSync, ...rhfProps } = props;
  const methods = useRHFForm<TFieldValues, TContext>(rhfProps);
  const [, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (!searchParamSync) return;

    const subscription = methods.watch((value) => {
      const params: Record<string, string> = {};

      Object.entries(value).forEach(([key, val]) => {
        if (val === undefined || val === null || val === '') return;

        if (Array.isArray(val)) {
          if (val.length > 0) params[key] = val.join(',');
        } else {
          params[key] = String(val);
        }
      });

      setSearchParams(params, { replace: true });
    });

    return () => subscription.unsubscribe();
  }, [methods, searchParamSync, setSearchParams]);

  return methods;
}
