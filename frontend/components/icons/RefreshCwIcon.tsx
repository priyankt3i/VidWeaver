import React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

export const RefreshCwIcon: React.FC<SvgProps> = (props) => (
  <Svg
    {...props}
    width={props.width || 24}
    height={props.height || 24}
    viewBox="0 0 24 24"
    fill="none"
    stroke={props.color || 'currentColor'}
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Path d="M23 4v6h-6" />
    <Path d="M1 20v-6h6" />
    <Path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
  </Svg>
);
