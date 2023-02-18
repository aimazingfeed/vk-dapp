import React from 'react';
import clsx from 'clsx';

export interface BaseSVGIconProps extends React.SVGProps<SVGSVGElement> {
  color?: 'action' | 'disabled' | 'error' | 'warning' | 'inherit' | 'primary' | 'secondary' | 'success';
  htmlColor?: string;
  fontSize?: 'default' | 'inherit' | 'large' | 'small';
  viewBox?: string;
  width?: string;
  height?: string;
  fill?: string;
  stroke?: string;
  className?: string;
}

export type IconProps = Partial<
  Pick<BaseSVGIconProps, 'color' | 'htmlColor' | 'width' | 'height' | 'fill' | 'className'>
>;

export const BaseSVGIcon: React.FC<BaseSVGIconProps> = ({
  children,
  htmlColor,
  viewBox = '0 0 24 24',
  width,
  height,
  fill,
  stroke,
  className,
  ...passedProps
}) => {
  return (
    <svg
      {...passedProps}
      className={clsx(className)}
      focusable="false"
      viewBox={viewBox}
      aria-hidden
      role={undefined}
      width={width}
      height={height}
      fill={fill}
      color={htmlColor}
      stroke={stroke}
    >
      {children}
    </svg>
  );
};
