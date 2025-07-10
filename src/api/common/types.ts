export interface ErrorResponseProps {
  message: string;
  title?: string;
  status?: number;
  translate?: boolean;
  translationParams?: Record<string, any>;
}
