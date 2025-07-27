import React from 'react'
import { useI18n } from '~/hooks/useI8n';

interface ScoreBadgeProps {
    score: number
}

const ScoreBadge: React.FC<ScoreBadgeProps> = ({ score }) => {
    const { badge } = useI18n()

    let badgeColor: string = ''
    let badgeText: string = '';

    if (score > 70) {
        badgeColor = 'bg-badge-green text-green-600';
        badgeText = badge.strong;
    } else if (score > 49) {
        badgeColor = 'bg-badge-yellow text-yellow-600';
        badgeText = badge.goodStart;
    } else {
        badgeColor = 'bg-badge-red text-red-600';
        badgeText = badge.needWork;
    }
    return (
        <div className={`px-3 py-1 rounded-full text-xs ${badgeColor}`}>
            <p className="text-sm font-medium">{badgeText}</p>
        </div>
    )
}

export default ScoreBadge