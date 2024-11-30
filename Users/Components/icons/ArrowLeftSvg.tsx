import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface ArrowLeftSVGProps {
  width: number;
  height: number;
  color: string;
}

const ArrowLeftSVG: React.FC<ArrowLeftSVGProps> = ({ width, height, color }) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 12 13" fill="none">
      <Path
        d="M1.5 8.63364C-0.499998 7.47894 -0.500002 4.59219 1.5 3.43749L6.74999 0.4064C8.74999 -0.748301 11.25 0.695073 11.25 3.00447L11.25 9.06665C11.25 11.376 8.75 12.8194 6.75 11.6647L1.5 8.63364Z"
        fill={color}
      />
    </Svg>
  );
};

export default ArrowLeftSVG;
