export interface LogData {
    webhookUrl?: string;        
    code: string;    
    resourceId: string;
    sessionId: string;
    reticulumId: string;
    logTime?: Date;        
    action?: string | null;    
    ip?: string | null;
    userAgent?: string | null;  
}
