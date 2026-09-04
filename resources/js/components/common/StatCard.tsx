import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
    label: string;
    value: string | number;
    icon?: React.ReactNode;
    trend?: {
        value: number;
        label?: string;
        direction?: 'up' | 'down';
    };
    accent?: 'green' | 'blue' | 'amber' | 'red' | 'neutral';
    sublabel?: string;
    className?: string;
}

const accentStyles: Record<NonNullable<StatCardProps['accent']>, { bg: string; text: string }> = {
    green: { bg: 'bg-[#DCFCE7]', text: 'text-[#166534]' },
    blue: { bg: 'bg-[#DBEAFE]', text: 'text-[#1E40AF]' },
    amber: { bg: 'bg-[#FEF3C7]', text: 'text-[#92400E]' },
    red: { bg: 'bg-[#FEE2E2]', text: 'text-[#991B1B]' },
    neutral: { bg: 'bg-muted', text: 'text-muted-foreground' },
};

export function StatCard({ label, value, icon, trend, accent = 'green', sublabel, className }: StatCardProps) {
    const style = accentStyles[accent];
    return (
        <div className={cn("surface-card surface-card-hover p-5", className)}>
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                    <div className="text-eyebrow text-muted-foreground">{label}</div>
                    <div className="mt-2 text-metric tracking-tight text-foreground">{value}</div>
                    {sublabel && (
                        <div className="mt-1 text-meta text-muted-foreground">{sublabel}</div>
                    )}
                </div>
                {icon && (
                    <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-lg", style.bg, style.text)}>
                        {icon}
                    </div>
                )}
            </div>
            {trend && (
                <div className="mt-3 flex items-center gap-1.5 text-xs">
                    <span
                        className={cn(
                            "inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 font-semibold",
                            trend.direction === 'down'
                                ? "bg-[#FEE2E2] text-[#991B1B]"
                                : "bg-[#DCFCE7] text-[#166534]"
                        )}
                    >
                        {trend.direction === 'down' ? (
                            <ArrowDownRight className="h-3 w-3" />
                        ) : (
                            <ArrowUpRight className="h-3 w-3" />
                        )}
                        {Math.abs(trend.value)}%
                    </span>
                    {trend.label && <span className="text-muted-foreground">{trend.label}</span>}
                </div>
            )}
        </div>
    );
}
