import dotenv from 'dotenv';

export function loadEnv() {
    const nodeEnv = process.env.NODE_ENV ?? 'development';
    const envFiles = [
        `.env.${nodeEnv}.local`,
        `.env.${nodeEnv}`,
        '.env.local',
        '.env'
    ];
    
    for (const file of envFiles) {
        dotenv.config({ path: file });
    }
}
