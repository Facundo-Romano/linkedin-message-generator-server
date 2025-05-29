export interface LinkedInMediaAsset {
    url: string;
    width: number;
    height: number;
}

export interface LinkedInDate {
    year: number;
    month: number;
    day: number;
}

export interface LinkedInGeo {
    country: string;
    city: string;
    full: string;
    countryCode: string;
}

export interface LinkedInMultiLocaleString {
    [locale: string]: string; // e.g., en_US: "CEO"
}

export interface LinkedInEducation {
    start: LinkedInDate;
    end: LinkedInDate;
    fieldOfStudy: string | null; // Can be empty string or potentially null
    degree: string | null;
    grade: string | null;
    schoolName: string;
    description: string | null;
    activities: string | null;
    url: string | null;
    schoolId: string | null;
    logo: LinkedInMediaAsset[] | null; // It's an array of logos in the example
}

export interface LinkedInPosition {
    companyId: number | null;
    companyName: string;
    companyUsername: string | null;
    companyURL: string | null;
    companyLogo: string | null; // URL string directly
    companyIndustry: string | null;
    companyStaffCountRange: string | null;
    title: string;
    multiLocaleTitle: LinkedInMultiLocaleString | null;
    multiLocaleCompanyName: LinkedInMultiLocaleString | null;
    location: string | null;
    locationType: string | null;
    description: string | null;
    employmentType: string | null;
    start: LinkedInDate;
    end: LinkedInDate | null; // Current positions might not have an end date
}

export interface LinkedInSkill {
    name: string;
    passedSkillAssessment?: boolean; // Optional as not always present
    endorsementsCount?: number; // Optional
}

export interface LinkedInProject {
    // Define structure if projects are expected, otherwise Record<string, never> or unknown
    // For the given empty object:
    [key: string]: never; // Or Record<string, unknown> if it can have properties
}

export interface LinkedInSupportedLocale {
    country: string;
    language: string;
}

export interface LinkedInMention {
    firstName: string;
    lastName: string;
    urn: string;
    publicIdentifier: string;
}

export interface LinkedInCompanyMention {
    id: number;
    name: string;
    publicIdentifier: string;
    url: string;
}

export interface LinkedInPostArticle {
    articleUrn?: string; // Optional as seen in some post examples
    title: string | null;
    subtitle: string | null;
    link: string | null;
    newsletter: Record<string, unknown> | null; // Could be more specific if structure is known
}

export interface LinkedInPostDocumentPage {
    width: number;
    height: number;
    imageUrls: string[];
}

export interface LinkedInPostDocument {
    title: string;
    urn: string;
    TranscribedDocumentUrl?: string; // Optional
    TranscribedDocumentUrlExpiresAt?: number; // Optional
    manifestUrlExpiresAt?: number; // Optional
    manifestUrl?: string; // Optional
    scanRequiredForDownload?: boolean; // Optional
    totalPageCount: number;
    coverPages: LinkedInPostDocumentPage[];
}

export interface LinkedInPostAuthor {
    firstName: string;
    lastName: "Selipsky" | string; // Selipsky for Adam, but could be other authors in reshared posts
    username: "adamselipsky" | string;
    url: string;
}

export interface LinkedInPostVideo {
    url: string;
    poster: string;
    duration: number;
    thumbnails: null; // Or a specific type if known
    video: null; // Or a specific type if known
}

export interface LinkedInResharedPost {
    isBrandPartnership: boolean;
    text: string;
    author: LinkedInPostAuthor;
    video?: LinkedInPostVideo[];
    image?: LinkedInMediaAsset[];
    company: Record<string, unknown> | null; // Could be more specific
    document: LinkedInPostDocument | Record<string, unknown> | null;
    celebration: Record<string, unknown> | null;
    poll: Record<string, unknown> | null;
    contentType: string;
    article: LinkedInPostArticle | null;
    entity: Record<string, unknown> | null;
    mentions?: LinkedInMention[];
    companyMentions?: LinkedInCompanyMention[];
}

export interface LinkedInPost {
    isBrandPartnership: boolean;
    text: string;
    totalReactionCount?: number;
    likeCount?: number;
    appreciationCount?: number;
    empathyCount?: number;
    InterestCount?: number; // Note: Case sensitive from JSON
    praiseCount?: number;
    funnyCount?: number;
    commentsCount?: number;
    repostsCount?: number;
    postUrl: string;
    postedAt: string; // e.g., "11mo", "1yr"
    postedDate: string; // ISO date string
    postedDateTimestamp: number;
    urn: string;
    author: LinkedInPostAuthor;
    company: Record<string, unknown> | null; // Can be more specific if known
    document: LinkedInPostDocument | Record<string, unknown> | null; // Can be {} or actual document
    celebration: Record<string, unknown> | null;
    poll: Record<string, unknown> | null;
    contentType: string;
    article: LinkedInPostArticle | null; // Can be {} or actual article
    entity: Record<string, unknown> | null;
    mentions?: LinkedInMention[];
    companyMentions?: LinkedInCompanyMention[];
    image?: LinkedInMediaAsset[];
    video?: LinkedInPostVideo[];
    reposted?: boolean; // For posts that are reshares by the main profile
    resharedPost?: LinkedInResharedPost; // For posts that are reshares of other users' posts
}

export interface LinkedInProfileData {
    id: number;
    urn: string;
    username: string;
    firstName: string;
    lastName: string;
    isTopVoice: boolean;
    isCreator: boolean;
    isPremium: boolean;
    profilePicture: string | null; // URL
    profilePictures: LinkedInMediaAsset[];
    backgroundImage: LinkedInMediaAsset[] | null;
    summary: string | null;
    headline: string;
    geo: LinkedInGeo | null;
    educations: LinkedInEducation[];
    position: LinkedInPosition[];
    fullPositions: LinkedInPosition[]; // Often same as position
    skills: LinkedInSkill[];
    projects: LinkedInProject | Record<string, unknown>; // Given it's {}, could be Record<string, never> if always empty
    supportedLocales: LinkedInSupportedLocale[];
    multiLocaleFirstName: LinkedInMultiLocaleString | null;
    multiLocaleLastName: LinkedInMultiLocaleString | null;
    multiLocaleHeadline: LinkedInMultiLocaleString | null;
}

export interface LinkedInResponse {
    firstName: string;
    lastName: string;
    headline: string;
    summary: string;
    location: string;
    position: LinkedInPosition[];
    educations: LinkedInEducation[];
    skills: LinkedInSkill[];
    posts: LinkedInPost[];
    isTopVoice: boolean;
    isCreator: boolean;
}