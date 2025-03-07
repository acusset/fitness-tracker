import type { OAuthConfig, OAuthUserConfig } from "next-auth/providers";

export interface FitbitProfile {
  user: {
    aboutMe?: string;
    age: number;
    ambassador: boolean;
    autoStrideEnabled: boolean;
    avatar: string;
    avatar150: string;
    avatar640: string;
    averageDailySteps: number;
    challengesBeta: boolean;
    city?: string;
    clockTimeDisplayFormat: "12hour" | "24hour";
    country?: string;
    corporate: boolean;
    corporateAdmin: boolean;
    dateOfBirth: string;
    displayName: string;
    displayNameSetting: "name" | "username";
    distanceUnit: string;
    encodedId: string;
    features: { exerciseGoal: boolean };
    firstName: string;
    foodsLocale?: string;
    fullName: string;
    gender: "MALE" | "FEMALE" | "NA";
    glucoseUnit: string;
    height: number;
    heightUnit: string;
    isBugReportEnabled: boolean;
    isChild: boolean;
    isCoach: boolean;
    languageLocale: string;
    lastName: string;
    legalTermsAcceptRequired: boolean;
    locale: string;
    memberSince: string;
    mfaEnabled: boolean;
    offsetFromUTCMillis: number;
    phoneNumber?: string;
    sdkDeveloper: boolean;
    sleepTracking: "Normal" | "Sensitive";
    startDayOfWeek: "SUNDAY" | "MONDAY";
    state?: string;
    strideLengthRunning: number;
    strideLengthRunningType: "default" | "manual";
    strideLengthWalking: number;
    strideLengthWalkingType: "default" | "manual";
    swimUnit: string;
    temperatureUnit: string;
    timezone: string;
    topBadges: FitbitUserBadge[];
    waterUnit?: string;
    waterUnitName?: string;
    weight?: number;
    weightUnit: string;
  };
}

interface FitbitUserBadge {
  badgeGradientEndColor: string;
  badgeGradientStartColor: string;
  badgeType: string;
  category: string;
  cheers: [];
  dateTime: string;
  description: string;
  earnedMessage: string;
  encodedId: string;
  image100px: string;
  image125px: string;
  image300px: string;
  image50px: string;
  image75px: string;
  marketingDescription: string;
  mobileDescription: string;
  name: string;
  shareImage640px: string;
  shareText: string;
  shortDescription: string;
  shortName: string;
  timesAchieved: number;
  value: number;
}

export default function Fitbit(
  config: OAuthUserConfig<FitbitProfile>
): OAuthConfig<FitbitProfile> {
  const baseUrl = "https://www.fitbit.com";
  const apiBaseUrl = "https://api.fitbit.com";
  const defaultScopes = ["activity", "profile"];

  return {
    id: "fitbit",
    name: "Fitbit",
    type: "oauth",
    authorization: {
      url: `${baseUrl}/oauth2/authorize`,
      params: { scope: defaultScopes.join(" ") },
    },
    token: `${apiBaseUrl}/oauth2/token`,
    userinfo: {
      url: `${apiBaseUrl}/1/user/-/profile.json`,
    },
    profile: async (profile, tokens) => {
      return {
        id: `${tokens.user_id}`,
        encodedId: profile.user.encodedId,
        name: profile.user.fullName,
        image: profile.user.avatar,
      };
    },
    style: {
      bg: "#00B0B9",
      text: "#fff",
    },
    options: config,
  };
}
