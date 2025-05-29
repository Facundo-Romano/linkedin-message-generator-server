export interface SenderInfo {
    name?: string;
    problemSolved: string;
    solutionOffered: string;
    writingStyle?: string;
}

export interface RecipientInfo {
    firstName: string;
    lastName: string;
    headline?: string;
    recentRoleTitle?: string;
    recentRoleCompany?: string;
    quantifiableAchievement?: string;
    careerImpact?: string;
    recentPosts?: {
    text?: string;
    topic?: string;
    url?: string;
    }[];
    skills?: string[];
    linkedinStatus?: string;
    education?: string;
    companyMention?: string;
    specificInterest?: string;
}