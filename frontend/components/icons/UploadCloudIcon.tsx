
import React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

export const UploadCloudIcon = (props: SvgProps) => (
  <Svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <Path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l-3.75 3.75M12 9.75l3.75 3.75M3 17.25V21h18v-3.75m-18 0V12a9 9 0 0118 0v5.25" />
  </Svg>
);
