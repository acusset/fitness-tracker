import { employees } from "@/mocks/employees";

export type Employee = {
  id: number;
  name: string;
  avatar: string;
  rewardTier: {
    name: string;
    color: string;
  };
  activities: {
    steps: number;
    bike: number;
    active: number;
  };
  private: boolean;
};

/**
 * Simulates a database delay
 * @param ms Time in milliseconds
 */
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Get all employees
 * @param includePrivate - Whether to include private profiles (default: false)
 * @returns Promise with array of employees
 */
export const getEmployees = async (
  includePrivate: boolean = false,
): Promise<Employee[]> => {
  await delay(2000); // Simulate database latency

  if (includePrivate) {
    return [...employees];
  }

  return employees.filter((employee) => !employee.private);
};

/**
 * Get an employee by ID
 * @param id - The employee ID
 * @param includePrivate - Whether to include private profiles (default: false)
 * @returns Promise with the employee or undefined if not found
 */
export const getEmployeeById = async (
  id: number,
  includePrivate: boolean = false,
): Promise<Employee | undefined> => {
  await delay(2000); // Simulate database latency

  const employee = employees.find((emp) => emp.id === id);

  if (!employee) return undefined;
  if (employee.private && !includePrivate) return undefined;

  return employee;
};

/**
 * Get employees by reward tier
 * @param tierName - The reward tier name (Bronze, Silver, Gold, Diamond)
 * @param includePrivate - Whether to include private profiles (default: false)
 * @returns Promise with array of employees in the specified tier
 */
export const getEmployeesByRewardTier = async (
  tierName: string,
  includePrivate: boolean = false,
): Promise<Employee[]> => {
  await delay(2000); // Simulate database latency

  return employees.filter((employee) => {
    const matchesTier = employee.rewardTier.name === tierName;
    return matchesTier && (includePrivate || !employee.private);
  });
};

/**
 * Search employees by name
 * @param query - The search query
 * @param includePrivate - Whether to include private profiles (default: false)
 * @returns Promise with array of employees matching the search query
 */
export const searchEmployeesByName = async (
  query: string,
  includePrivate: boolean = false,
): Promise<Employee[]> => {
  await delay(2000); // Simulate database latency

  const normalizedQuery = query.toLowerCase().trim();

  return employees.filter((employee) => {
    const matchesQuery = employee.name.toLowerCase().includes(normalizedQuery);
    return matchesQuery && (includePrivate || !employee.private);
  });
};
