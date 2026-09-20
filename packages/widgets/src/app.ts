export type ExpoAppConfigContribution = {
  plugins?: readonly (string | readonly [string, Record<string, unknown>])[];
};
export const app: ExpoAppConfigContribution = {};
