export enum ProductCategory {
    BEERS = 'beers',
    DRINKS = 'drinks',
    SNACKS = 'snacks',
    NON_ALCOHOLIC = 'non_alcoholic',
    OTHER = 'other',
    SKEWER = 'skewer',
    SOFT_DRINKS = 'soft_drinks',
}

export const ProductCategoryLabels: Record<ProductCategory, string> = {
    [ProductCategory.BEERS]: 'Cervejas',
    [ProductCategory.DRINKS]: 'Bebidas',
    [ProductCategory.SNACKS]: 'Petiscos',
    [ProductCategory.NON_ALCOHOLIC]: 'Não Alcoólicas',
    [ProductCategory.OTHER]: 'Outros',
    [ProductCategory.SKEWER]: 'Espetinhos',
    [ProductCategory.SOFT_DRINKS]: 'Refrigerantes',
}

export interface IProduct {
    id: string;
    name: string;
    description: string
    image: string;
    isActive: boolean;
    price: number;
    category: ProductCategory;
    createdAt: Date;
    updatedAt: Date;
}
