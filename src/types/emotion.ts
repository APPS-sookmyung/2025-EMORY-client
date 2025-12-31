export type EmotionIcon = 
  | 'sun' 
  | 'cloud' 
  | 'brain' 
  | 'flame' 
  | 'alert-triangle' 
  | 'droplets' 
  | 'zap'
  | 'sparkles';

export type EmotionCategory = 
  | 'joy' 
  | 'calm' 
  | 'thoughtful' 
  | 'anger'
  | 'anxiety' 
  | 'sadness' 
  | 'excitement';

export interface EmotionData {
  id: EmotionCategory;
  name: string;
  icon: EmotionIcon;
  description: string;
  percentage: number;
  color: string;
}

export interface EmotionReport {
  id: string;
  userId: string;
  createdAt: string;
  mainEmotion: EmotionData;
  emotionDistribution: EmotionData[];
  feedback: string;
}

export const EMOTION_ICON_MAP: Record<EmotionIcon, string> = {
  'sun': 'bg-yellow-400 rounded-full',
  'cloud': 'bg-blue-300 rounded-full', 
  'brain': 'bg-purple-400 rounded-full',
  'flame': 'bg-red-400 rounded-full',
  'alert-triangle': 'bg-yellow-400 rounded-full',
  'droplets': 'bg-blue-400 rounded-full',
  'zap': 'bg-yellow-300 rounded-full',
  'sparkles': 'bg-orange-300 rounded-full'
};