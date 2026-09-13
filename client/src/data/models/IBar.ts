export enum AccessPlan {
    BASIC = 'basic',
    MEDIUM = 'medium',
    PREMIUM = 'premium',
}

export const AccessPlanLabels: Record<AccessPlan, string> = {
    [AccessPlan.BASIC]: 'Básico',
    [AccessPlan.MEDIUM]: 'Médio',
    [AccessPlan.PREMIUM]: 'Premium',
};

export interface IBar {
    id: string;
    name: string;
    slug: string;
    image?: string;
    address: string;
    accessPlan: AccessPlan;
    isActive: boolean;
    comandasEnabled: boolean;
    deliveryEnabled: boolean;
    deliveryFee: number;
    minOrderValue: number;
    deliveryOriginAddress?: string;
    openingHours?: string;
    createdAt: Date;
    updatedAt: Date;
}