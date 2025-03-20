/**
 * Returns the background and border color classes based on the block type
 * @param {string} type - The type of time block ('trabajo', 'descanso', 'comida', 'reunión')
 * @returns {Object} An object containing Tailwind CSS classes for background and border colors
 * @property {string} bg - The background color class
 * @property {string} border - The border color class
 * @example
 * getBlockColor('trabajo') - returns { bg: 'bg-blue-100', border: 'border-blue-200' }
 * getBlockColor('descanso') - returns { bg: 'bg-green-100', border: 'border-green-200' }
 */
export const getBlockColor = (type: string): { bg: string, border: string } => {
    switch (type) {
        case 'trabajo':
            return { bg: 'bg-blue-300', border: 'border-blue-400' };
        case 'descanso':
            return { bg: 'bg-green-300', border: 'border-green-400' };
        case 'comida':
            return { bg: 'bg-orange-300', border: 'border-orange-400' };
        case 'reunión':
            return { bg: 'bg-purple-300', border: 'border-purple-400' };
        default:
            return { bg: 'bg-gray-300', border: 'border-gray-400' };
    }
};