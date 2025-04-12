type typeSlots = 7 | 'A' | 'B' | 'C' | 'D' | 'E' 

export interface iSlot {
    slotValue:typeSlots
}

export class Slot {
    
    public slotValues:typeSlots[] = [7, 'A', 'B', 'C', 'D', 'E'];


    public rollSlots():iSlot[] {

        const slots:iSlot[] = [];

        for (let slot = 0; slot<3; slot++) {
            slots.push({ slotValue: this.slotValues[Math.floor(Math.random() * this.slotValues.length)] });
        }

        return slots;
    }

    public checkEqualSlots(slots:iSlot[]): boolean {
        const firstValue = slots[0].slotValue;
        return slots.every(slot => slot.slotValue === firstValue);
    }
}
