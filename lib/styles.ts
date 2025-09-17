// Common styles for consistent UI across the application

export const pageStyles = {
  // Page header styles
  header: {
    container: "mb-8",
    title: "text-3xl font-bold text-gray-900",
    description: "text-gray-600 mt-2 text-lg",
    withIcon: {
      container: "flex items-center gap-3",
      icon: "h-8 w-8 text-gray-700"
    }
  },

  // Section header styles
  section: {
    title: "text-2xl font-semibold text-gray-900",
    subtitle: "text-gray-600"
  },

  // Card styles
  card: {
    base: "bg-white rounded-lg shadow-sm border border-gray-200 p-6",
    header: "text-xl font-semibold text-gray-900 mb-4"
  },

  // Button styles (additional to shadcn)
  button: {
    primary: "bg-gray-700 hover:bg-gray-800 text-white",
    secondary: "border-gray-300"
  }
};

// Helper function to combine classes
export function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}