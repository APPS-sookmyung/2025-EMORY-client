import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

//cn 함수: 클래스 조합 유틸리티
// - clsx: 조건부 클래스 조합
// - twMerge: Tailwind CSS 클래스 병합
