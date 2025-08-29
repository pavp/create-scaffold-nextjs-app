import { Badge as BadgeMui, BadgeProps as BadgePropsMui, SxProps, Theme } from '@mui/material';

interface BadgeProps extends BadgePropsMui {
  invisible?: boolean;
  color?: 'primary' | 'secondary' | 'default' | 'error' | 'info' | 'success' | 'warning';
  overlap?: 'rectangular' | 'circular';
  variant?: 'standard' | 'dot';
  sx?: SxProps<Theme>;
}

export const Badge = ({ children, color, invisible, overlap, variant, sx, ...props }: BadgeProps) => {
  return (
    <BadgeMui
      badgeContent=""
      color={color}
      overlap={overlap}
      variant={variant}
      {...props}
      invisible={invisible}
      sx={
        sx ?? {
          span: {
            top: 11,
            right: 18,
            border: 'solid 1px white',
            height: 10,
            width: 10,
            borderRadius: '50%',
          },
        }
      }
    >
      {children}
    </BadgeMui>
  );
};
