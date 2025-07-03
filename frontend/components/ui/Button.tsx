import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, TouchableOpacityProps } from 'react-native';
import { SvgProps } from 'react-native-svg';

interface ButtonProps extends TouchableOpacityProps {
  isLoading?: boolean;
  loadingText?: string;
  variant?: 'primary' | 'secondary' | 'danger';
  Icon?: React.FC<SvgProps>;
  children: React.ReactNode;
}

const variantStyles = {
  primary: 'bg-indigo-600 hover:bg-indigo-500',
  secondary: 'bg-gray-700 hover:bg-gray-600',
  danger: 'bg-red-600 hover:bg-red-500',
};

const Button: React.FC<ButtonProps> = ({
  isLoading = false,
  loadingText = 'Loading...',
  variant = 'primary',
  Icon,
  children,
  ...props
}) => {
  const isDisabled = props.disabled || isLoading;

  return (
    <TouchableOpacity
      {...props}
      disabled={isDisabled}
      className={`flex-row items-center justify-center gap-x-2 rounded-md px-4 py-3 text-sm font-inter-semibold text-white shadow-sm ${variantStyles[variant]} ${isDisabled ? 'opacity-50' : ''}`}
    >
      {isLoading ? (
        <><ActivityIndicator color="#fff" size="small" className="mr-2" /><Text className="text-white font-inter-semibold">{loadingText}</Text></>
      ) : (
        <>{Icon && <Icon width={20} height={20} color="#fff" />}<Text className="text-white font-inter-semibold">{children}</Text></>
      )}
    </TouchableOpacity>
  );
};

export default Button;
