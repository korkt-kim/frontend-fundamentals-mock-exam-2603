import { Equipment } from '_tosslib/server/types';

export const ALL_EQUIPMENT: Equipment[] = ['tv', 'whiteboard', 'video', 'speaker'];

export function getValidEquipment(equipmentParam: string | null): Equipment[] {
  if (!equipmentParam) {
    return [];
  }
  
  return equipmentParam
    .split(',')
    .filter((eq): eq is Equipment => (ALL_EQUIPMENT as string[]).includes(eq));
}
