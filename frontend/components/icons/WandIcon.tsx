
import React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

export const WandIcon = (props: SvgProps) => (
    <Svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <Path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-2.25-1.122h-.003c-.63.003-1.21.22-1.684.593m12.446-5.653a3 3 0 01-2.25 1.122h-.003c-.63-.003-1.21-.22-1.684-.592M12.75 9.75 9.5 4.5l-3.25 5.25M12.75 9.75 14.25 12l1.5 2.25M12.75 9.75 11.25 12l-1.5 2.25M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </Svg>
);
