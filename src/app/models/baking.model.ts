// Interface defining the structure of an ingredient item and its density data
export interface Ingredient {
    key: string;
    name: string;
    density_g_per_unit: number; // density in grams per unit (e.g., g/cup or g/tbsp)
    unit: string;
}

// Dataset of standard baking ingredient densities (approximations)
export const DENSITY_DATA: Ingredient[] = [
    { key: 'flour_ap', name: 'All-Purpose Flour', density_g_per_unit: 120, unit: 'cup' },
    { key: 'flour_bread', name: 'Bread Flour', density_g_per_unit: 120, unit: 'cup' },
    { key: 'flour_ww', name: 'Whole Wheat Flour', density_g_per_unit: 120, unit: 'cup' },
    { key: 'sugar_granulated', name: 'Granulated Sugar', density_g_per_unit: 12.5, unit: 'tbsp' },
    { key: 'sugar_powdered', name: 'Powdered Sugar', density_g_per_unit: 8, unit: 'tbsp' },
    { key: 'salt_kosher', name: 'Salt (Kosher)', density_g_per_unit: 4, unit: 'tsp' },
    { key: 'milk_powder', name: 'Dry Milk Powder', density_g_per_unit: 8, unit: 'tbsp' },

    { key: 'baking_soda', name: 'Baking Soda', density_g_per_unit: 5, unit: 'tsp' },
    { key: 'baking_powder', name: 'Baking Powder', density_g_per_unit: 5, unit: 'tsp' },


    { key: 'water', name: 'Water', density_g_per_unit: 236, unit: 'cup' },
    { key: 'milk', name: 'Milk', density_g_per_unit: 236, unit: 'cup' },
    { key: 'butter', name: 'Butter (Solid)', density_g_per_unit: 227, unit: 'cup' },
    { key: 'egg', name: 'Egg (Large)', density_g_per_unit: 50, unit: 'each' },
];

// Colors for pie chart visualization
export const PIE_CHART_COLORS = [
    '#6366f1',
    '#facc15',
    '#22c55e',
];