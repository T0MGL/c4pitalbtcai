import React from 'react';

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FeatureProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export interface ChartDataPoint {
  month: string;
  balance: number;
}