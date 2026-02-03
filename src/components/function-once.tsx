// TanStack Router
import { ScriptOnce } from '@tanstack/react-router';

/**
 * 関数版ScriptOnce
 */
export function FunctionOnce<T extends Record<string, unknown>>({
  children,
  ...props
}: T & {
  children: (params: Omit<T, 'children'>) => void;
}) {
  return (
    <ScriptOnce>
      {`(${children})(${JSON.stringify(props)})`}
    </ScriptOnce>
  );
}
