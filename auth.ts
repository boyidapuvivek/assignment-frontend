export interface FormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  newPassword: string;
}

export interface AuthResult {
  success: boolean;
  message?: string;
  requiresOTP?: boolean;
  token?: string;
  user?: any;
}

export interface AuthFormProps {
  onSubmit: (data: Partial<FormData>) => Promise<void>;
  loading: boolean;
  onSwitchMode?: () => void;
  onForgotPassword?: () => void;
}
