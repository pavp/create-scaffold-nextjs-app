/* v8 ignore start */
import { OverridableComponent, SvgIconTypeMap } from '@/ui';

interface ItemSidebarProps {
  dataTestid: string;
  text: string;
  icon?: OverridableComponent<SvgIconTypeMap<object, 'svg'>>;
  navigateTo?: string;
  subOptions?: ItemSidebarProps[];
  disabled: boolean;
  hidden: boolean;
}

export default ItemSidebarProps;
